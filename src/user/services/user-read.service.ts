/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// TODO resolve eslint

import { LoggerPlus } from '../../logger/logger-plus.js';
import { LoggerPlusService } from '../../logger/logger-plus.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PhoneNumberType } from '../models/enums/phone-number-type.enum.js';
import { PhoneNumberMapper } from '../models/mapper/phone-number.mapper.js';
import { SecurityMapper } from '../models/mapper/security.mapper.js';
import { UserPayload } from '../models/payload/user.payload.js';
import { Injectable, NotFoundException } from '@nestjs/common';

/**
 * userReadService
 * -------------------------------------------------------------
 * Provides read-only access to user entities from the database.
 * Uses Prisma for typed data retrieval.
 */
@Injectable()
export class UserReadService {
  private readonly logger: LoggerPlus;

  constructor(
    private readonly prisma: PrismaService,
    private readonly loggerService: LoggerPlusService,
  ) {
    this.logger = this.loggerService.getLogger(UserReadService.name);
  }

  // Returns all users, ordered by start date
  async findAll(): Promise<UserPayload[]> {
    return this.prisma.user.findMany();
  }

  // Returns a single user by its ID or throws if not found
  async findOne(id: string): Promise<UserPayload> {
    this.logger.debug('findOne: looking up user id=%s', id);

    const found = await this.prisma.user.findUnique({
      where: { id },
      include: {
        phoneNumbers: true,
      },
    });

    if (!found) {
      throw new NotFoundException(`UserPayload with ID "${id}" not found`);
    }

    // map Prisma PhoneType → GraphQL PhoneNumberType
    const mapped = {
      ...found,
      phoneNumbers: found.phoneNumbers.map((p) => ({
        ...p,
        type: p.type as unknown as PhoneNumberType,
      })),
    };

    return mapped;
  }

  async findUserList(userIds: string[]): Promise<UserPayload[]> {
    if (userIds.length === 0) {
      return [];
    }

    return this.prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
  }

  async getSecurityInfo(userId: string) {
    const entity = await this.prisma.security.findMany({
      where: { userId },
    });
    return entity ? SecurityMapper.toPayloadList(entity) : undefined;
  }

  async getPhoneNumbers(userId: string) {
    const entity = await this.prisma.phoneNumber.findMany({
      where: { userId },
    });
    return entity ? PhoneNumberMapper.toPayloadList(entity) : undefined;
  }
}
