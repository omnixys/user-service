/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { type User } from '../../prisma/generated/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { ValkeyKey, ValkeyService } from '@omnixys/cache';
import { CreateUserInput } from '@omnixys/graphql';
import { OmnixysLogger} from '@omnixys/logger';
import { TraceRunner } from '@omnixys/observability';
import { KcSignUpUserDTO, StatusType, UserType } from '@omnixys/shared';
// import { KafkaProducerService, KafkaTopics } from '@omnixys/kafka';

@Injectable()
export class RegisterService {
  private readonly log;

  constructor(
    private readonly prisma: PrismaService,
    // private readonly kafkaProducerService: KafkaProducerService,
    private readonly logger: OmnixysLogger,
    private readonly cache: ValkeyService,
  ) {
    this.log = this.logger.log(this.constructor.name);
  }

  async verifySignup(id: string, token?: string) {
    return TraceRunner.run('verify SignUp', async () => {
      if (!token) {
        throw Error('TOKEN FEHLT!');
      }

      const raw = await this.cache.get(ValkeyKey.signupVerificationUser, token);
      if (!raw) {
        throw new Error('Token invalid or expired');
      }

      const parsed = JSON.parse(raw);
      const input = parsed.userData as CreateUserInput;

      // Call UserService
      await this.create2(input, id);

      // Delete key
      await this.cache.delete(ValkeyKey.signupVerificationUser, token);
      return true;
    });
  }

  /* ------------------------------------------------------------------
   * Create user via public signup
   * ------------------------------------------------------------------ */
  async create(input: CreateUserInput): Promise<User> {
    this.log.debug('Creating full user aggregate: %o', input);
    return this.prisma.$transaction(async (tx) => {
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
      await tx.personalInfo.create({
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

      // void this.kafkaProducerService.sendCreateNotification(
      //   {
      //     username: user.username,
      //     firstName: personalInfo.firstName,
      //     lastName: personalInfo.lastName,
      //     email: personalInfo.email,
      //   },
      //   'user.register-service',
      //   {
      //     traceId: sc.traceId,
      //     spanId: sc.spanId,
      //   },
      // );

      return user;
    });
  }

  async create2(input: CreateUserInput, id: string): Promise<User> {
        return TraceRunner.run('Create User', async () => {
    this.log.debug('Creating full user aggregate: %o', input);
    return await this.prisma.$transaction(async (tx) => {
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
      await tx.personalInfo.create({
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

      // void this.kafkaProducerService.send<
      //   typeof KafkaTopics.notification.createUser
      //   >(
      // KafkaTopics.notification.createUser,
      //   {
      //     username: user.username,
      //     firstName: personalInfo.firstName,
      //     lastName: personalInfo.lastName,
      //     email: personalInfo.email,
      //   },
      //   'user-service',
      //   {
      //     traceId: sc.traceId,
      //     spanId: sc.spanId,
      //   },
      // );

      return user;
    });
    });
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

  async isUsernameAvailable(username: string): Promise<boolean> {
      return TraceRunner.run('isUsernameAvailable', async () => {
        this.log.debug('Checking username availability: %s', username);

        const user = await this.prisma.user.findUnique({
          where: { username },
          select: { id: true },
        });

        if (user) {
          this.log.error('Username already exists: %s', username);
          return false;
        }

        return true;
      });
  }

  async checkEmail(email: string): Promise<boolean> {
    this.log.debug('check for Email: %s', email);

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
