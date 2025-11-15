import { PrismaService } from '../../prisma/prisma.service.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../models/entities/user.entity.js';

/**
 * userReadService
 * -------------------------------------------------------------
 * Provides read-only access to user entities from the database.
 * Uses Prisma for typed data retrieval.
 */
@Injectable()
export class UserReadService {
  constructor(private readonly prisma: PrismaService) {}

  // Returns all users, ordered by start date
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // Returns a single user by its ID or throws if not found
  async findOne(id: string): Promise<User> {
    const found = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!found) {
      throw new NotFoundException(`user with ID "${id}" not found`);
    }

    return found;
  }
}
