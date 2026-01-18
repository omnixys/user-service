import { LoggerPlus } from '../../logger/logger-plus.js';
import { LoggerPlusService } from '../../logger/logger-plus.service.js';
import {
  Address,
  Contact,
  Customer,
  Employee,
  PersonalInfo,
  PhoneNumber,
  SecurityQuestion,
  User,
} from '../../prisma/generated/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
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

  async findAll(): Promise<User[]> {
    this.logger.debug('findAll: loading all users');

    return this.prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  // Returns a single user by its ID or throws if not found
  async findById(id: string): Promise<User> {
    this.logger.debug('findById: looking up user id=%s', id);

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async findByIds(userIds: string[]): Promise<User[]> {
    if (userIds.length === 0) {
      return [];
    }

    return this.prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      orderBy: {
        username: 'asc',
      },
    });
  }

  /* ------------------------------------------------------------------
   * Personal Info (1:1)
   * ------------------------------------------------------------------ */

  async getPersonalInfo(userId: string): Promise<PersonalInfo | null> {
    return this.prisma.personalInfo.findUnique({
      where: { id: userId },
    });
  }

  /* ------------------------------------------------------------------
   * Phone Numbers (via PersonalInfo)
   * ------------------------------------------------------------------ */

  async getPhoneNumbers(userId: string): Promise<PhoneNumber[]> {
    return this.prisma.phoneNumber.findMany({
      where: {
        infoId: userId,
      },
      orderBy: {
        isPrimary: 'desc',
      },
    });
  }

  /* ------------------------------------------------------------------
   * Security Questions
   * ------------------------------------------------------------------ */

  async getSecurityInfo(userId: string): Promise<SecurityQuestion[]> {
    return this.prisma.securityQuestion.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /* ------------------------------------------------------------------
   * Addresses
   * ------------------------------------------------------------------ */

  async getAddresses(userId: string): Promise<Address[]> {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { city: 'asc' },
    });
  }

  /* ------------------------------------------------------------------
   * Contacts (Person ↔ Person)
   * ------------------------------------------------------------------ */

  async getContacts(userId: string): Promise<Contact[]> {
    return this.prisma.contact.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /* ------------------------------------------------------------------
   * Customer Extension
   * ------------------------------------------------------------------ */

  async getCustomer(userId: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id: userId },
    });
  }

  /* ------------------------------------------------------------------
   * Employee Extension
   * ------------------------------------------------------------------ */

  async getEmployee(userId: string): Promise<Employee | null> {
    return this.prisma.employee.findUnique({
      where: { id: userId },
    });
  }
}
