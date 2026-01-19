import type { User } from '../../../prisma/generated/client.js';
import type { PersonStatus } from '../enums/person-status.enum.js';
import type { UserType } from '../enums/user-type.enum.js';
import type { UserPayload } from '../payload/user.payload.js';

export class userMapper {
  static toPayload(user: User): UserPayload {
    return {
      id: user.id,
      username: user.username,
      userType: user.userType as UserType,
      status: user.status as PersonStatus,
      ticketIds: user.ticketIds,
      invitationIds: user.invitationIds,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toPayloadList(list: User[]): UserPayload[] {
    return list.map((user) => this.toPayload(user));
  }
}
