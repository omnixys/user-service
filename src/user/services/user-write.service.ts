import { LoggerPlusService } from '../../logger/logger-plus.service.js';
// import { KafkaProducerService } from '../../messaging/kafka-producer.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UserDTO } from '../models/dto/user.dto.js';
// import { withSpan } from '../../trace/utils/span.utils.js';
import { User } from '../models/entities/user.entity.js';
import { CreateUserInput } from '../models/input/create-user.input.js';
import { PhoneNumberInput } from '../models/input/phone-number.input.js';
import { UpdateUserInput } from '../models/input/update-user.input.js';
import { Injectable, NotFoundException } from '@nestjs/common';
// import { trace } from '@opentelemetry/api';

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
  // private readonly tracer;
  private readonly logger;

  constructor(
    private readonly prisma: PrismaService,
    // private readonly kafkaProducerService: KafkaProducerService,
    private readonly loggerService: LoggerPlusService,
  ) {
    // this.tracer = trace.getTracer(UserWriteService.name);
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
  }

  async create(input: CreateUserInput): Promise<User> {
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
        firstName: patch.firstName ?? undefined,
        lastName: patch.lastName ?? undefined,
        email: patch.email ?? undefined,
      },
    });
  }

  async remove(id: string): Promise<boolean> {
    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('User nicht gefunden');
    }
    const result = await this.prisma.user.delete({ where: { id } });
    return result !== undefined;
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
}
