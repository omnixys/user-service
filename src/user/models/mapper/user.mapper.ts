import type { User } from '../../../prisma/generated/client.js';
import { UserPayload } from '../payload/user.payload.js';

export class userMapper {
  static toPayload(user: User): UserPayload {
    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
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
