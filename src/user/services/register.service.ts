/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { KafkaProducerService } from '../../kafka/kafka-producer.service.js';
import { LoggerPlusService } from '../../logger/logger-plus.service.js';
import { type User } from '../../prisma/generated/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { withSpan } from '../../trace/utils/span.utils.js';
import { ValkeyService } from '../../valkey/valkey.service.js';
import { Injectable } from '@nestjs/common';
import { KcSignUpUserDTO, StatusType, UserType } from '@omnixys/contracts';
import { CreateUserInput } from '@omnixys/graphql';
import { trace } from '@opentelemetry/api';

@Injectable()
export class RegisterService {
  private readonly tracer;
  private readonly logger;

  constructor(
    private readonly prisma: PrismaService,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly loggerService: LoggerPlusService,
    private readonly valkey: ValkeyService,
  ) {
    this.tracer = trace.getTracer(RegisterService.name);
    this.logger = this.loggerService.getLogger(RegisterService.name);
  }

  async verifySignup(id: string, token?: string) {
    if (!token) {
      throw Error('TOKEN FEHLT!');
    }
    const key = `verification:signup:user:${token}`;

    const raw = await this.valkey.client.get(key);
    if (!raw) {
      throw new Error('Token invalid or expired');
    }

    const parsed = JSON.parse(raw);
    const input = parsed.userData as CreateUserInput;

    // Call UserService
    await this.create2(input, id);

    // Delete key
    await this.valkey.client.del(key);
    return true;
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
              countryCode: p.countryCode,
            })),
          });
        }

        /* ------------------------------------------------------------
         * 5. Customer OR Employee (exclusive)
         * ------------------------------------------------------------ */
        if (input.userType === UserType.CUSTOMER && input.customer) {
          await tx.customer.create({
            data: {
              id: user.id,
              subscribed: input.customer.subscribed,
              state: input.customer.state ?? StatusType.ACTIVE,
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

        void this.kafkaProducerService.sendCreateNotification(
          {
            username: user.username,
            firstName: personalInfo.firstName,
            lastName: personalInfo.lastName,
            email: personalInfo.email,
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

  async create2(input: CreateUserInput, id: string): Promise<User> {
    this.logger.debug('Creating full user aggregate: %o', input);
    return withSpan(this.tracer, this.logger, 'user.create', async (span) =>
      this.prisma.$transaction(async (tx) => {
        /* ------------------------------------------------------------
         * 1. User (technical root)
         * ------------------------------------------------------------ */
        const user = await tx.user.create({
          data: {
            id,
            username: input.username,
            userType: input.userType,
            status: StatusType.ACTIVE,
          },
        });

        /* ------------------------------------------------------------
         * 2. PersonalInfo
         * ------------------------------------------------------------ */
        const personalInfo = await tx.personalInfo.create({
          data: {
            id,
            email: input.personalInfo.email,
            firstName: input.personalInfo.firstName,
            lastName: input.personalInfo.lastName,
            birthDate: input.personalInfo.birthDate,
            gender: input.personalInfo.gender,
            maritalStatus: input.personalInfo.maritalStatus,

            phoneNumbers: {
              create:
                input.phoneNumbers?.map((p) => ({
                  number: p.number,
                  type: p.type,
                  label: p.label,
                  isPrimary: p.isPrimary ?? false,
                  countryCode: p.countryCode,
                })) ?? [],
            },
          },
        });

        /* ------------------------------------------------------------
         * 5. Customer OR Employee (exclusive)
         * ------------------------------------------------------------ */
        if (input.userType === UserType.CUSTOMER && input.customer) {
          await tx.customer.create({
            data: {
              id,
              subscribed: input.customer.subscribed,
              state: input.customer.state ?? StatusType.ACTIVE,
              contactOptions: input.customer.contactOptions,

              customerInterests: {
                createMany: {
                  data: input.customer.interestIds.map((interestId) => ({
                    interestId,
                  })),
                },
              },
            },
          });
        }

        if (input.userType === UserType.EMPLOYEE && input.employee) {
          await tx.employee.create({
            data: {
              id,
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
         * 7. Contacts (optional)
         * ------------------------------------------------------------ */
        if (input.contacts?.length) {
          await tx.contact.createMany({
            data: input.contacts.map((c) => ({
              userId: id,
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

        void this.kafkaProducerService.sendCreateNotification(
          {
            username: user.username,
            firstName: personalInfo.firstName,
            lastName: personalInfo.lastName,
            email: personalInfo.email,
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

  async addUserId(input: KcSignUpUserDTO): Promise<void> {
    await this.verifySignup(input.newId, input.token);
  }

  async createProviderUser(input: {
    userId: string;
    email?: string;
    username?: string;
  }): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      /* ------------------------------------------------------------
       * 1. User (technical root)
       * ------------------------------------------------------------ */
      await tx.user.create({
        data: {
          id: input.userId,
          username: input.username ?? input.email ?? '',
          userType: UserType.CUSTOMER,
          status: 'ACTIVE',
        },
      });
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
