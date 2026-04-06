/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { type User } from '../../prisma/generated/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { CreateUserInput } from '@omnixys/graphql';
import { OmnixysLogger } from '@omnixys/logger';
import { TraceRunner } from '@omnixys/observability';
import { PhoneNumberDTO, StatusType, UserType } from '@omnixys/shared';

export interface CreateGuestUserDTO {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumbers?: PhoneNumberDTO[];
  actorId: string;
  userId: string;
  username: string;
}

@Injectable()
export class RegisterService {
  private readonly log;

  constructor(
    private readonly prisma: PrismaService,
    // private readonly kafkaProducerService: KafkaProducerService,
    private readonly logger: OmnixysLogger,
  ) {
    this.log = this.logger.log(this.constructor.name);
  }

  async create(input: CreateUserInput, id: string): Promise<User> {
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

  async createGuest(input: CreateGuestUserDTO) {
    return TraceRunner.run('[SERVICE] createGuest', async () => {
      this.log.debug('Creating guest user aggregate: %o', input);
      const { userId, username, email, firstName, lastName, phoneNumbers } = input;

      return await this.prisma.$transaction(async (tx) => {
        await tx.user.create({
          data: {
            id: userId,
            username: username,
            userType: UserType.GUEST,
            status: StatusType.ACTIVE,
          },
        });

        await tx.personalInfo.create({
          data: {
            id: userId,
            email: email,
            firstName: firstName,
            lastName: lastName,

            phoneNumbers: {
              create:
                phoneNumbers?.map((p) => ({
                  number: p.number,
                  type: p.type,
                  label: p.label,
                  isPrimary: p.isPrimary ?? false,
                  countryCode: p.countryCode,
                })) ?? [],
            },
          },
        });
      });
    });
  }
}
