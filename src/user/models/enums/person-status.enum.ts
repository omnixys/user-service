import { registerEnumType } from '@nestjs/graphql';

/**
 * Represents the lifecycle status of a user.
 * Mirrors the Prisma enum `PersonStatus`.
 */
export enum PersonStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  DELETED = 'DELETED',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
  CLOSED = 'CLOSED',
}

registerEnumType(PersonStatus, {
  name: 'PersonStatus',
  description: 'Represents the current lifecycle state of a user.',
});
