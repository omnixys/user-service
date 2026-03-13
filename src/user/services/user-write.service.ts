/* eslint-disable @typescript-eslint/no-explicit-any */
import { KafkaProducerService } from '../../kafka/kafka-producer.service.js';
import { LoggerPlusService } from '../../logger/logger-plus.service.js';
import { User, UserType } from '../../prisma/generated/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { withSpan } from '../../trace/utils/span.utils.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GenderType, MaritalStatusType, StatusType } from '@omnixys/contracts';
import {
  AddContactInput,
  PhoneNumberInput,
  UpdateUserInput,
} from '@omnixys/graphql';
import { trace } from '@opentelemetry/api';
import { UserDTO } from '../models/dto/user.dto.js';

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
        userType: UserType.CUSTOMER,
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
                    label: p.label,
                    isPrimary: p.isPrimary ?? false,
                    countryCode: p.countryCode,
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
            countryCode: p.countryCode,
            label: p.label,
            isPrimary: p.isPrimary,
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
        subscribed: patch.subscribed ?? undefined,
        state: patch.state ?? undefined,
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
