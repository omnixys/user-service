/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerPlusService } from '../../logger/logger-plus.service.js';
import { KafkaProducerService } from '../../messaging/kafka-producer.service.js';
import { User } from '../../prisma/generated/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { withSpan } from '../../trace/utils/span.utils.js';
import { UserDTO } from '../models/dto/user.dto.js';
import { GenderType } from '../models/enums/gender-type.enum.js';
import { MaritalStatusType } from '../models/enums/marital-status-type.enum.js';
import { StatusType } from '../models/enums/status-type.enum.js';
import { UserType } from '../models/enums/user-type.enum.js';
import { AddressInput } from '../models/input/address.input.js';
import { AddContactInput } from '../models/input/contact.input.js';
import { CreateUserInput } from '../models/input/create-user.input.js';
import { PhoneNumberInput } from '../models/input/phone-number.input.js';
import { UpdateUserInput } from '../models/input/update-user.input.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { trace } from '@opentelemetry/api';
import * as argon2 from 'argon2';
import { AddSecurityQuestionInput } from '../models/input/security-question.input.js';

export interface AddPhoneNumbersDTO {
  userId: string;
  phoneNumbers: PhoneNumberInput[];
}

export interface RemovePhoneNumbersDTO {
  userId: string;
  ids: string[];
}

@Injectable()
export class UserWriteService {
  private readonly tracer;
  private readonly logger;

  constructor(
    private readonly prisma: PrismaService,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly loggerService: LoggerPlusService,
  ) {
    this.tracer = trace.getTracer(UserWriteService.name);
    this.logger = this.loggerService.getLogger(UserWriteService.name);
  }

  /* ------------------------------------------------------------------
   * Create user from Identity Provider (ID is known)
   * ------------------------------------------------------------------ */
  async createWithId(input: UserDTO): Promise<void> {
    this.logger.debug('Persisting user from IdP: %o', input);

    await this.prisma.user.create({
      data: {
        id: input.id,
        username: input.username,
        userType: input.userType,
        invitationIds: input.invitationId ? [input.invitationId] : [],
        personalInfo: {
          create: {
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            phoneNumbers: input.phoneNumbers?.length
              ? {
                  create: input.phoneNumbers.map((p) => ({
                    number: p.number,
                    type: p.type,
                  })),
                }
              : undefined,
          },
        },
      },
    });

    if (input.invitationId) {
      void this.kafkaProducerService.addInvitation(
        {
          invitationId: input.invitationId,
          guestId: input.id,
        },
        'user.write-service',
      );
    }
  }

  /* ------------------------------------------------------------------
   * Create user via public signup
   * ------------------------------------------------------------------ */
  async create(input: CreateUserInput): Promise<User> {
    this.logger.debug('Creating full user aggregate: %o', input);

    return this.prisma.$transaction(async (tx) => {
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

      return user;
    });
  }

  /* ------------------------------------------------------------------
   * Update technical user data
   * ------------------------------------------------------------------ */
  async update(input: UpdateUserInput): Promise<User> {
    const { id, ...patch } = input;

    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('User nicht gefunden');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ticketIds: patch.ticketIds ?? undefined,
        invitationIds: patch.invitationIds ?? undefined,
        status: patch.status,
        userType: patch.userType ?? undefined,
      },
    });
  }

  /* ------------------------------------------------------------------
   * Delete user
   * ------------------------------------------------------------------ */
  async delete(id: string): Promise<boolean> {
    return withSpan(this.tracer, this.logger, 'user.delete', async (span) => {
      const exists = await this.prisma.user.findUnique({ where: { id } });
      if (!exists) {
        throw new NotFoundException('User nicht gefunden');
      }

      await this.prisma.user.delete({ where: { id } });

      const sc = span.spanContext();

      void this.kafkaProducerService.deleteInvitations(
        { guestId: id },
        'user.write-service',
        {
          traceId: sc.traceId,
          spanId: sc.spanId,
        },
      );

      void this.kafkaProducerService.deleteTickets(
        { guestId: id },
        'user.write-service',
        {
          traceId: sc.traceId,
          spanId: sc.spanId,
        },
      );

      return true;
    });
  }

  /* ------------------------------------------------------------------
   * Phone numbers (via PersonalInfo)
   * ------------------------------------------------------------------ */
  async addPhoneNumber(input: AddPhoneNumbersDTO): Promise<void> {
    const { userId, phoneNumbers } = input;

    await this.prisma.personalInfo.update({
      where: { id: userId },
      data: {
        phoneNumbers: {
          create: phoneNumbers.map((p) => ({
            number: p.number,
            type: p.type,
          })),
        },
      },
    });
  }

  async removePhoneNumber(input: RemovePhoneNumbersDTO): Promise<void> {
    const { userId, ids } = input;

    await this.prisma.phoneNumber.deleteMany({
      where: {
        id: { in: ids },
        infoId: userId,
      },
    });
  }

  /* ------------------------------------------------------------------
   * Tickets
   * ------------------------------------------------------------------ */
  async addTicketId({
    guestId,
    ticketId,
  }: {
    guestId: string;
    ticketId: string;
  }): Promise<void> {
    this.logger.debug('Adding ticketId %s to user %s', ticketId, guestId);

    await this.prisma.user.update({
      where: { id: guestId },
      data: {
        ticketIds: {
          push: ticketId,
        },
      },
    });
  }

  async addAddress(userId: string, input: AddressInput): Promise<void> {
    await this.prisma.address.create({
      data: {
        userId,
        ...input,
      },
    });
  }

  async removeAddress(userId: string, addressId: string): Promise<void> {
    const count = await this.prisma.address.count({
      where: { userId },
    });

    if (count <= 1) {
      throw new Error('At least one address must remain');
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });
  }

  async addContact(input: AddContactInput): Promise<void> {
    await this.prisma.contact.create({
      data: {
        userId: input.userId,
        contactId: input.Contact.contactId,
        relationship: input.Contact.relationship,
        withdrawalLimit: input.Contact.withdrawalLimit ?? 0,
        emergency: input.Contact.emergency ?? false,
        startDate: input.Contact.startDate,
        endDate: input.Contact.endDate,
      },
    });
  }

  async removeContact(userId: string, contactId: string): Promise<void> {
    await this.prisma.contact.delete({
      where: {
        userId_contactId: {
          userId,
          contactId,
        },
      },
    });
  }

  async addSecurityQuestion(
    userId: string,
    input: AddSecurityQuestionInput,
  ): Promise<void> {
    await this.prisma.securityQuestion.create({
      data: {
        userId,
        question: input.question,
        answerHash: input.answer,
      },
    });
  }

  async updateSecurityAnswer(
    userId: string,
    questionId: string,
    newAnswerHash: string,
  ): Promise<void> {
    await this.prisma.securityQuestion.update({
      where: {
        id: questionId,
        userId,
      },
      data: {
        answerHash: newAnswerHash,
        attempts: 0,
        lockedAt: null,
      },
    });
  }

  async removeSecurityQuestion(
    userId: string,
    questionId: string,
  ): Promise<void> {
    await this.prisma.securityQuestion.delete({
      where: {
        id: questionId,
        userId,
      },
    });
  }

  async updatePersonalInfo(
    userId: string,
    patch: {
      email?: string;
      firstName?: string;
      lastName?: string;
      birthDate?: Date;
      gender?: GenderType;
      maritalStatus?: MaritalStatusType;
    },
  ): Promise<void> {
    await this.prisma.personalInfo.update({
      where: { id: userId },
      data: {
        email: patch.email ?? undefined,
        firstName: patch.firstName ?? undefined,
        lastName: patch.lastName ?? undefined,
        birthDate: patch.birthDate ?? undefined,
        gender: patch.gender ?? undefined,
        maritalStatus: patch.maritalStatus ?? undefined,
      },
    });
  }

  async updateCustomer(
    userId: string,
    patch: {
      tierLevel?: number;
      subscribed?: boolean;
      maritalStatus?: MaritalStatusType;
      state?: StatusType;
      interests?: any[];
      contactOptions?: any[];
    },
  ): Promise<void> {
    await this.prisma.customer.update({
      where: { id: userId },
      data: {
        tierLevel: patch.tierLevel ?? undefined,
        subscribed: patch.subscribed ?? undefined,
        maritalStatus: patch.maritalStatus ?? undefined,
        state: patch.state ?? undefined,
        interests: patch.interests ?? undefined,
        contactOptions: patch.contactOptions ?? undefined,
      },
    });
  }

  async updateEmployee(
    userId: string,
    patch: {
      department?: string;
      position?: string;
      role?: string;
      salary?: number;
      hireDate?: Date;
      isExternal?: boolean;
    },
  ): Promise<void> {
    await this.prisma.employee.update({
      where: { id: userId },
      data: {
        department: patch.department ?? undefined,
        position: patch.position ?? undefined,
        role: patch.role ?? undefined,
        salary: patch.salary ?? undefined,
        hireDate: patch.hireDate ?? undefined,
        isExternal: patch.isExternal ?? undefined,
      },
    });
  }
}
