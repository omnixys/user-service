import { KafkaProducerService } from '../../kafka/kafka-producer.service.js';
import { LoggerPlusService } from '../../logger/logger-plus.service.js';
import type { User } from '../../prisma/generated/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { withSpan } from '../../trace/utils/span.utils.js';
import { UserIdDTO } from '../models/dto/kc-sign-up.dto.js';
import { StatusType } from '../models/enums/status-type.enum.js';
import { UserType } from '../models/enums/user-type.enum.js';
import type { CreateUserInput } from '../models/input/create-user.input.js';
import { Injectable } from '@nestjs/common';
import { trace } from '@opentelemetry/api';
import * as argon2 from 'argon2';

@Injectable()
export class RegisterService {
  private readonly tracer;
  private readonly logger;

  constructor(
    private readonly prisma: PrismaService,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly loggerService: LoggerPlusService,
  ) {
    this.tracer = trace.getTracer(RegisterService.name);
    this.logger = this.loggerService.getLogger(RegisterService.name);
  }

  /* ------------------------------------------------------------------
   * Create user via public signup
   * ------------------------------------------------------------------ */
  async create(input: CreateUserInput): Promise<User> {
    this.logger.debug('Creating full user aggregate: %o', input);
    return withSpan(this.tracer, this.logger, 'user.delete', async (span) =>
      this.prisma.$transaction(async (tx) => {
        /* ------------------------------------------------------------
         * 1. User (technical root)
         * ------------------------------------------------------------ */
        const user = await tx.user.create({
          data: {
            username: input.username,
            userType: input.userType,
            status: 'ACTIVE',
            invitationIds: input.invitationIds ?? [],
            ticketIds: [],
          },
        });

        /* ------------------------------------------------------------
         * 2. PersonalInfo
         * ------------------------------------------------------------ */
        const personalInfo = await tx.personalInfo.create({
          data: {
            id: user.id,
            email: input.personalInfo.email,
            firstName: input.personalInfo.firstName,
            lastName: input.personalInfo.lastName,
            birthDate: input.personalInfo.birthDate,
            gender: input.personalInfo.gender,
            maritalStatus: input.personalInfo.maritalStatus,
          },
        });

        /* ------------------------------------------------------------
         * 3. PhoneNumbers (optional)
         * ------------------------------------------------------------ */
        if (input.phoneNumbers?.length) {
          await tx.phoneNumber.createMany({
            data: input.phoneNumbers.map((p) => ({
              infoId: user.id,
              number: p.number,
              type: p.type,
              label: p.label,
              isPrimary: p.isPrimary ?? false,
            })),
          });
        }

        /* ------------------------------------------------------------
         * 4. Addresses (mandatory)
         * ------------------------------------------------------------ */
        await tx.address.createMany({
          data: input.addresses.map((a) => ({
            userId: user.id,
            street: a.street,
            houseNumber: a.houseNumber,
            zipCode: a.zipCode,
            city: a.city,
            state: a.state,
            country: a.country,
            additionalInfo: a.additionalInfo,
          })),
        });

        /* ------------------------------------------------------------
         * 5. Customer OR Employee (exclusive)
         * ------------------------------------------------------------ */
        if (input.userType === UserType.CUSTOMER && input.customer) {
          await tx.customer.create({
            data: {
              id: user.id,
              tierLevel: input.customer.tierLevel,
              subscribed: input.customer.subscribed,
              state: input.customer.state ?? StatusType.ACTIVE,
              interests: input.customer.interests,
              contactOptions: input.customer.contactOptions,
            },
          });
        }

        if (input.userType === UserType.EMPLOYEE && input.employee) {
          await tx.employee.create({
            data: {
              id: user.id,
              department: input.employee.department,
              position: input.employee.position,
              role: input.employee.role,
              salary: input.employee.salary,
              hireDate: input.employee.hireDate,
              isExternal: input.employee.isExternal,
            },
          });
        }

        /* ------------------------------------------------------------
         * 6. SecurityQuestions (optional)
         * ------------------------------------------------------------ */
        if (input.securityQuestions?.length) {
          const hashedQuestions = await Promise.all(
            input.securityQuestions.map(async (q) => ({
              userId: user.id,
              question: q.question,
              answerHash: await argon2.hash(q.answer, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16,
                timeCost: 3,
                parallelism: 1,
              }),
            })),
          );

          await tx.securityQuestion.createMany({
            data: hashedQuestions,
          });
        }

        /* ------------------------------------------------------------
         * 7. Contacts (optional)
         * ------------------------------------------------------------ */
        if (input.contacts?.length) {
          await tx.contact.createMany({
            data: input.contacts.map((c) => ({
              userId: user.id,
              contactId: c.contactId,
              relationship: c.relationship,
              withdrawalLimit: c.withdrawalLimit ?? 0,
              emergency: c.emergency ?? false,
              startDate: c.startDate,
              endDate: c.endDate,
            })),
          });
        }

        const sc = span.spanContext();

        void this.kafkaProducerService.createKcUser(
          {
            id: user.id,
            username: user.username,
            firstName: personalInfo.firstName,
            lastName: personalInfo.lastName,
            email: personalInfo.email,
            password: input.password,
          },
          'user.register-service',
          {
            traceId: sc.traceId,
            spanId: sc.spanId,
          },
        );

        return user;
      }),
    );
  }

  async addUserId(input: UserIdDTO): Promise<void> {
    this.logger.debug('addUserId: id received: %s', input);

    await this.prisma.user.update({
      where: { id: input.oldId },
      data: { id: input.newId },
    });
  }

  async checkUsername(username: string): Promise<boolean> {
    this.logger.debug('check for username: %s', username);

    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    return !user;
  }

  async checkEmail(email: string): Promise<boolean> {
    this.logger.debug('check for Email: %s', email);

    const user = await this.prisma.user.findFirst({
      where: {
        personalInfo: {
          email,
        },
      },
      select: { id: true },
    });

    return !user;
  }
}
