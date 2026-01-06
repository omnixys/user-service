import { LoggerPlusService } from '../../logger/logger-plus.service.js';
import { KafkaProducerService } from '../../messaging/kafka-producer.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { withSpan } from '../../trace/utils/span.utils.js';
import { UserDTO } from '../models/dto/user.dto.js';
import { CreateUserInput } from '../models/input/create-user.input.js';
import { PhoneNumberInput } from '../models/input/phone-number.input.js';
import { UpdateUserInput } from '../models/input/update-user.input.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { trace } from '@opentelemetry/api';
import { UserPayload } from '../models/payload/user.payload.js';

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

  async createWithId(input: UserDTO): Promise<void> {
    this.logger.debug('Persisting user from Identity Provider: %o', input);

    await this.prisma.user.create({
      data: {
        id: input.id,
        username: input.username,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        invitationIds: input.invitationId ? [input.invitationId] : [],
        phoneNumbers: input.phoneNumbers
          ? {
              create: input.phoneNumbers.map((p) => ({
                number: p.number,
                type: p.type,
              })),
            }
          : undefined,
      },
      include: {
        phoneNumbers: true,
      },
    });

    if (input.invitationId) {
      this.logger.debug(
        'UserPayload created with invitationId %s, sending event to mark invitation as used',
        input.invitationId,
      );
      void this.kafkaProducerService.addInvitation(
        {
          invitationId: input.invitationId,
          guestId: input.id,
        },
        'user.write-service',
      );
    }
  }

  async create(input: CreateUserInput): Promise<UserPayload> {
    // return withSpan(this.tracer, this.logger, 'user.signUp', async (span) => {
    void this.logger.debug('input=%o', input);

    return this.prisma.user.create({
      data: {
        username: input.username,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,

        phoneNumbers:
          input.phoneNumbers && input.phoneNumbers.length > 0
            ? {
                create: input.phoneNumbers.map((p) => ({
                  number: p.number,
                  type: p.type,
                })),
              }
            : undefined,
      },
    });
    // });
  }

  async update(input: UpdateUserInput): Promise<UserPayload> {
    const { id, ...patch } = input;

    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('UserPayload nicht gefunden');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ticketIds: patch.ticketIds ?? undefined,
        invitationIds: patch.invitationIds ?? undefined,
        firstName: patch.firstName ?? undefined,
        lastName: patch.lastName ?? undefined,
        email: patch.email ?? undefined,
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    return withSpan(this.tracer, this.logger, 'user.delete', async (span) => {
      const exists = await this.prisma.user.findUnique({ where: { id } });
      if (!exists) {
        throw new NotFoundException('UserPayload nicht gefunden');
      }
      const result = await this.prisma.user.delete({ where: { id } });

      const sc = span.spanContext();
      void this.kafkaProducerService.deleteInvitations(
        {
          // TODO optimieren!
          guestId: id,
        },
        'user.write-service',
        { traceId: sc.traceId, spanId: sc.spanId },
      );
      void this.kafkaProducerService.deleteTickets(
        {
          // TODO optimieren!
          guestId: id,
        },
        'user.write-service',
        { traceId: sc.traceId, spanId: sc.spanId },
      );

      return result !== undefined;
    });
  }

  async addPhoneNumber(input: AddPhoneNumbersDTO): Promise<void> {
    const { userId, phoneNumbers } = input;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        phoneNumbers: {
          create: phoneNumbers.map((p) => ({
            number: p.number,
            type: p.type,
          })),
        },
      },
      include: {
        phoneNumbers: true,
      },
    });
  }

  async removePhoneNumber(input: RemovePhoneNumbersDTO): Promise<void> {
    const { userId, ids } = input;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        phoneNumbers: {
          deleteMany: ids.map((id) => ({ id })),
        },
      },
      include: {
        phoneNumbers: true,
      },
    });
  }

  async addTicketId({
    guestId,
    ticketId,
  }: {
    guestId: string;
    ticketId: string;
  }): Promise<void> {
    this.logger.debug('Adding ticketId %s to guestId %s', ticketId, guestId);
    await this.prisma.user.update({
      where: { id: guestId },
      data: {
        ticketIds: {
          push: ticketId,
        },
      },
    });
  }
}
