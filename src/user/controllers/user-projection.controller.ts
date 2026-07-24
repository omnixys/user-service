import { UserReadService } from '../services/user-read.service.js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

interface GetUsersByIdsRequest {
  ids: string[];
}

interface UserProjectionReply {
  id: string;
  username: string;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  primaryPhone?: string | null;
  avatarUrl?: string | null;
  locale?: string | null;
}

interface GetUsersByIdsResponse {
  users: UserProjectionReply[];
}

@Controller()
export class UserProjectionController {
  constructor(private readonly userReadService: UserReadService) {}

  @GrpcMethod('UserService', 'GetUsersByIds')
  async getUsersByIds(data: GetUsersByIdsRequest): Promise<GetUsersByIdsResponse> {
    if (!data.ids?.length) {
      return { users: [] };
    }

    const users = await this.userReadService.findByIds(data.ids);

    const projections: UserProjectionReply[] = await Promise.all(
      users.map(async (u) => {
        const personalInfo = await this.userReadService.getPersonalInfo(u.id);
        const phoneNumbers = personalInfo ? await this.userReadService.getPhoneNumbers(u.id) : [];
        const primaryPhone =
          phoneNumbers.find((p) => p.isPrimary)?.number ?? phoneNumbers[0]?.number ?? null;

        return {
          id: u.id,
          username: u.username,
          displayName: personalInfo
            ? [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ') || null
            : null,
          firstName: personalInfo?.firstName ?? null,
          lastName: personalInfo?.lastName ?? null,
          email: personalInfo?.email ?? null,
          primaryPhone,
          avatarUrl: null,
          locale: null,
        };
      }),
    );

    return { users: projections };
  }
}
