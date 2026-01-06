/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { LoggerPlusService } from '../../logger/logger-plus.service.js';
import { KafkaProducerService } from '../../messaging/kafka-producer.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { withSpan } from '../../trace/utils/span.utils.js';
import { SendPasswordResetInput } from '../models/input/send-password-reset.input.js';
import { SecurityMapper } from '../models/mapper/security.mapper.js';
import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { trace } from '@opentelemetry/api';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';

const MAX_ATTEMPTS = 5;
// const LOCK_MINUTES = 15;

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

  /* ------------------------------------------------------
   * Add Security Question
   * ---------------------------------------------------- */
  async addQuestion(params: {
    userId: string;
    question: string;
    answer: string;
  }) {
    const { userId, question, answer } = params;

    if (!question.trim() || !answer.trim()) {
      throw new BadRequestException('Invalid security question or answer');
    }

    const existing = await this.prisma.security.findUnique({
      where: {
        userId_question: {
          userId,
          question,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Security question already exists for this user',
      );
    }

    const answerHash = await argon2.hash(answer, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    const newPair = await this.prisma.security.create({
      data: {
        userId,
        question,
        answer,
        answerHash,
        attempts: 0,
        lockedAt: undefined,
      },
    });

    return SecurityMapper.toPayload(newPair);
  }

  /* ------------------------------------------------------
   * Verify Security Question
   * ---------------------------------------------------- */
  async verifyQuestion(params: {
    userId: string;
    question: string;
    answer: string;
  }): Promise<{
    success: boolean;
    lockedUntil?: Date;
  }> {
    const { userId, question, answer } = params;

    if (!question.trim() || !answer.trim()) {
      throw new BadRequestException('Invalid verification payload');
    }

    return this.prisma.$transaction(async (tx) => {
      const record = await tx.security.findUnique({
        where: {
          userId_question: {
            userId,
            question,
          },
        },
      });

      if (!record) {
        // intentionally generic to prevent enumeration
        throw new BadRequestException('Security verification failed');
      }

      /* --------------------------------------------------
       * Lock check
       * ------------------------------------------------ */
      if (record.lockedAt && record.lockedAt > new Date()) {
        throw new ForbiddenException('Security question is temporarily locked');
      }

      const isValid = await argon2.verify(record.answerHash, answer);

      /* --------------------------------------------------
       * Success
       * ------------------------------------------------ */
      if (isValid) {
        await tx.security.update({
          where: { id: record.id },
          data: {
            attempts: 0,
            lockedAt: null,
          },
        });

        return { success: true };
      }

      /* --------------------------------------------------
       * Failure → increment attempts
       * ------------------------------------------------ */
      const attempts = record.attempts + 1;

      const lockedAt =
        attempts >= MAX_ATTEMPTS
          ? // ? new Date(Date.now() + LOCK_MINUTES * 60_000)
            new Date()
          : null;

      await tx.security.update({
        where: { id: record.id },
        data: {
          attempts,
          lockedAt,
        },
      });

      return {
        success: false,
        lockedUntil: lockedAt ?? undefined,
      };
    });
  }

  /* ------------------------------------------------------
   * Optional: Reset all security locks for user (admin / recovery)
   * ---------------------------------------------------- */
  async resetSecurityLocks(userId: string): Promise<void> {
    await this.prisma.security.updateMany({
      where: { userId },
      data: {
        attempts: 0,
        lockedAt: null,
      },
    });
  }

  /* ------------------------------------------------------
   * Get 3 Verification Questions
   * ---------------------------------------------------- */
  async getVerificationQuestions(email: string) {
    return withSpan(
      this.tracer,
      this.logger,
      'getVerificationQuestions',
      async (span) => {
        const user = await this.loadUserIdentity(email);

        const questions = await this.prisma.security.findMany({
          where: {
            userId: user.id,
            attempts: { lt: 2 },
          },
          take: 3,
        });
        const sc = span.spanContext();

        if (questions.length < 3) {
          // Kafka: alert Omnixys team
          void this.kafka.sendSecurityAlert(
            {
              username: user.username,
              email: user.email,
              requestedAt: new Date().toISOString(),
              ipAddress: undefined,
              alert: 'NOT_ENOUGH_VALID_QUESTIONS',
            },
            'security.service',
            { traceId: sc.traceId, spanId: sc.spanId },
          );

          throw new ForbiddenException('Security verification unavailable');
        }

        // Defensive check
        if (questions.some((q) => q.attempts >= 2)) {
          void this.kafka.sendSecurityAlert(
            {
              username: user.username,
              email: user.email,
              requestedAt: new Date().toISOString(),
              ipAddress: undefined,
              alert: 'QUESTION_LOCK_THRESHOLD_REACHED',
            },
            'security.service',
            { traceId: sc.traceId, spanId: sc.spanId },
          );

          throw new ForbiddenException('Security verification blocked');
        }

        return questions.map((q) => ({
          id: q.id,
          question: q.question,
        }));
      },
    );
  }

  async resolveUserIdFromResetToken(token: string): Promise<string> {
    const record = await this.prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new ForbiddenException('Invalid or expired reset token');
    }

    return record.userEmail;
  }

  /* ------------------------------------------------------
   * Verify Answers & Trigger Password Reset
   * ---------------------------------------------------- */
  async verifyQuestionsAndResetPassword(params: {
    token: string;
    answers: { questionId: string; answer: string }[];
  }): Promise<{ success: boolean }> {
    return withSpan(
      this.tracer,
      this.logger,
      'getVerificationQuestions',
      async (span) => {
        const { token, answers } = params;

        const email = await this.resolveUserIdFromResetToken(token);
        const user = await this.loadUserIdentity(email);

        if (answers.length !== 3) {
          throw new BadRequestException('Exactly 3 answers required');
        }

        return this.prisma.$transaction(async (tx) => {
          const records = await tx.security.findMany({
            where: {
              id: { in: answers.map((a) => a.questionId) },
              userId: user.id,
            },
          });

          if (records.length !== 3) {
            throw new ForbiddenException('Invalid security questions');
          }

          const sc = span.spanContext();

          for (const record of records) {
            if (record.attempts >= 2) {
              void this.kafka.sendSecurityAlert(
                {
                  username: user.username,
                  email: user.email,
                  requestedAt: new Date().toISOString(),
                  ipAddress: undefined,
                  alert: 'ATTEMPT_LIMIT_REACHED',
                },
                'security.service',
                { traceId: sc.traceId, spanId: sc.spanId },
              );

              throw new ForbiddenException('Security verification blocked');
            }
          }

          // Map answers
          const answerMap = new Map(
            answers.map((a) => [a.questionId, a.answer]),
          );

          for (const record of records) {
            const isValid = await argon2.verify(
              record.answerHash,
              answerMap.get(record.id)!,
            );

            if (!isValid) {
              await tx.security.update({
                where: { id: record.id },
                data: { attempts: record.attempts + 1 },
              });

              return { success: false };
            }
          }

          // All 3 correct → reset counters
          await tx.security.updateMany({
            where: { id: { in: records.map((r) => r.id) } },
            data: { attempts: 0, lockedAt: null },
          });

          return { success: true, userId: user.id };
        });
      },
    );
  }

  async sendPasswordResetNotification(
    input: SendPasswordResetInput,
  ): Promise<void> {
    return withSpan(
      this.tracer,
      this.logger,
      'getVerificationQuestions',
      async (span) => {
        const { email, resetUrl, ipAddress } = input;
        const sc = span.spanContext();

        const user = await this.loadUserIdentity(email);

        if (!user) {
          this.logger.warn('Password reset requested for unknown email');
          return;
        }

        const token = this.generateResetToken();
        const expiresAt = new Date(Date.now() + 15 * 60_000); // 15 min

        this.logger.debug('token=%s', token)

        // ✅ PERSIST TOKEN
        await this.prisma.passwordReset.create({
          data: {
            userId: user.id,
            userEmail: user.email,
            token,
            expiresAt,
            ipAddress,
          },
        });

        // Kafka: trigger password reset
        void this.kafka.resetPassword(
          {
            recipientUsername: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            resetUrl: `${resetUrl}?token=${token}`,
            requestedAt: new Date().toISOString(),
            ipAddress,
          },
          'security.service',
          { traceId: sc.traceId, spanId: sc.spanId },
        );
      },
    );
  }

  generateResetToken(): string {
    return randomBytes(32).toString('hex');
  }

  async loadUserIdentity(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: userId },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    return user;
  }
}
