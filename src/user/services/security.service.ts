/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { KafkaProducerService } from '../../kafka/kafka-producer.service.js';
import { LoggerPlusService } from '../../logger/logger-plus.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { withSpan } from '../../trace/utils/span.utils.js';
import { AddSecurityQuestionInput } from '../models/input/security-question.input.js';
import { SendPasswordResetInput } from '../models/input/send-password-reset.input.js';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { trace } from '@opentelemetry/api';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';

const MAX_ATTEMPTS = 5;

@Injectable()
export class SecurityService {
  private readonly tracer;
  private readonly logger;

  constructor(
    private readonly prisma: PrismaService,
    private readonly kafka: KafkaProducerService,
    private readonly loggerService: LoggerPlusService,
  ) {
    this.tracer = trace.getTracer(SecurityService.name);
    this.logger = this.loggerService.getLogger(SecurityService.name);
  }

  /* ============================================================
   * ADD SECURITY QUESTION
   * ============================================================ */
  async addQuestion(input: AddSecurityQuestionInput, userId: string) {
    const { question, answer } = input;

    if (!question.trim() || !answer.trim()) {
      throw new BadRequestException('Invalid security question or answer');
    }

    const existing = await this.prisma.securityQuestion.findUnique({
      where: {
        userId_question: { userId, question },
      },
    });

    if (existing) {
      throw new BadRequestException('Security question already exists');
    }

    const answerHash = await argon2.hash(answer, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    return this.prisma.securityQuestion.create({
      data: {
        userId,
        question,
        answerHash,
        attempts: 0,
        lockedAt: null,
      },
    });
  }

  /* ============================================================
   * VERIFY SINGLE QUESTION
   * ============================================================ */
  async verifyQuestion(params: {
    userId: string;
    questionId: string;
    answer: string;
  }): Promise<{ success: boolean; lockedUntil?: Date }> {
    const { userId, questionId, answer } = params;

    return this.prisma.$transaction(async (tx) => {
      const record = await tx.securityQuestion.findUnique({
        where: { id: questionId },
      });

      if (record?.userId !== userId) {
        throw new BadRequestException('Security verification failed');
      }

      if (record.lockedAt && record.lockedAt > new Date()) {
        throw new ForbiddenException('Security question locked');
      }

      const valid = await argon2.verify(record.answerHash, answer);

      if (valid) {
        await tx.securityQuestion.update({
          where: { id: record.id },
          data: { attempts: 0, lockedAt: null },
        });
        return { success: true };
      }

      const attempts = record.attempts + 1;
      const lockedAt = attempts >= MAX_ATTEMPTS ? new Date() : null;

      await tx.securityQuestion.update({
        where: { id: record.id },
        data: { attempts, lockedAt },
      });

      return { success: false, lockedUntil: lockedAt ?? undefined };
    });
  }

  /* ============================================================
   * LOAD USER IDENTITY VIA EMAIL (SCHEMA-CORRECT)
   * ============================================================ */
  private async loadUserIdentityByEmail(email: string) {
    const info = await this.prisma.personalInfo.findUnique({
      where: { email },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });

    if (!info) {
      throw new ForbiddenException('User not found');
    }

    return {
      id: info.user.id,
      username: info.user.username,
      email: info.email,
      firstName: info.firstName,
      lastName: info.lastName,
    };
  }

  /* ============================================================
   * GET 3 VERIFICATION QUESTIONS
   * ============================================================ */
  async getVerificationQuestions(email: string) {
    return withSpan(
      this.tracer,
      this.logger,
      'security.getVerificationQuestions',
      async () => {
        const user = await this.loadUserIdentityByEmail(email);

        const questions = await this.prisma.securityQuestion.findMany({
          where: {
            userId: user.id,
            attempts: { lt: MAX_ATTEMPTS },
            OR: [{ lockedAt: null }, { lockedAt: { lt: new Date() } }],
          },
          take: 3,
        });

        if (questions.length < 3) {
          throw new ForbiddenException('Not enough valid security questions');
        }

        return questions.map((q) => ({
          id: q.id,
          question: q.question,
        }));
      },
    );
  }

  /* ============================================================
   * RESET TOKEN → EMAIL
   * ============================================================ */
  async resolveEmailFromResetToken(token: string): Promise<string> {
    const record = await this.prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new ForbiddenException('Invalid or expired reset token');
    }

    return record.userEmail;
  }

  /* ============================================================
   * VERIFY 3 QUESTIONS + CONSUME TOKEN
   * ============================================================ */
  async verifyQuestionsAndResetPassword(params: {
    token: string;
    answers: Array<{ questionId: string; answer: string }>;
  }): Promise<{ success: boolean }> {
    return this.prisma.$transaction(async (tx) => {
      const email = await this.resolveEmailFromResetToken(params.token);
      const user = await this.loadUserIdentityByEmail(email);

      if (params.answers.length !== 3) {
        throw new BadRequestException('Exactly 3 answers required');
      }

      const records = await tx.securityQuestion.findMany({
        where: {
          id: { in: params.answers.map((a) => a.questionId) },
          userId: user.id,
        },
      });

      if (records.length !== 3) {
        throw new ForbiddenException('Invalid security questions');
      }

      const answerMap = new Map(
        params.answers.map((a) => [a.questionId, a.answer]),
      );

      for (const record of records) {
        const ok = await argon2.verify(
          record.answerHash,
          answerMap.get(record.id)!,
        );

        if (!ok) {
          await tx.securityQuestion.update({
            where: { id: record.id },
            data: { attempts: record.attempts + 1 },
          });
          return { success: false };
        }
      }

      // ✅ Reset counters
      await tx.securityQuestion.updateMany({
        where: { id: { in: records.map((r) => r.id) } },
        data: { attempts: 0, lockedAt: null },
      });

      // ✅ CONSUME TOKEN
      await tx.passwordReset.update({
        where: { token: params.token },
        data: { usedAt: new Date() },
      });

      return { success: true };
    });
  }

  /* ============================================================
   * SEND PASSWORD RESET
   * ============================================================ */
  async sendPasswordResetNotification(
    input: SendPasswordResetInput,
  ): Promise<void> {
    return withSpan(
      this.tracer,
      this.logger,
      'security.sendReset',
      async (span) => {
        const user = await this.loadUserIdentityByEmail(input.email);

        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60_000);
        const sc = span.spanContext();

        await this.prisma.passwordReset.create({
          data: {
            userId: user.id,
            userEmail: user.email,
            token,
            expiresAt,
          },
        });

        void this.kafka.resetPassword(
          {
            recipientUsername: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            resetUrl: `${input.resetUrl}?token=${token}`,
            requestedAt: new Date().toISOString(),
          },
          'security.service',
          { traceId: sc.traceId, spanId: sc.spanId },
        );
      },
    );
  }
}
