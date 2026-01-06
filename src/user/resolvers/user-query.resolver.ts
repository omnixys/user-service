import {
  CurrentUser,
  CurrentUserData,
} from '../../auth/decorators/current-user.decorator.js';
import { CookieAuthGuard } from '../../auth/guards/cookie-auth.guard.js';
import { RoleGuard } from '../../auth/guards/role.guard.js';
import { LoggerPlusService } from '../../logger/logger-plus.service.js';
import { UserReadService } from '../services/user-read.service.js';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { UserPayload } from '../models/payload/user.payload.js';

@Resolver(() => UserPayload)
export class UserQueryResolver {
  private readonly logger;

  constructor(
    private readonly loggerService: LoggerPlusService,
    private readonly service: UserReadService,
  ) {
    this.logger = this.loggerService.getLogger(UserQueryResolver.name);
  }

  @Query(() => [UserPayload], { name: 'users' })
  get(): Promise<UserPayload[]> {
    return this.service.findAll();
  }

  @Query(() => UserPayload, { name: 'user' })
  getById(@Args('id', { type: () => ID }) id: string): Promise<UserPayload> {
    this.logger.debug('getById: id=%s', id);
    return this.service.findOne(id);
  }

  @UseGuards(CookieAuthGuard, RoleGuard)
  @Query(() => UserPayload, { name: 'me' })
  getMe(@CurrentUser() currentUser: CurrentUserData): Promise<UserPayload> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }
    return this.service.findOne(currentUser.id);
  }

  @Query(() => [UserPayload], { name: 'getUserList' })
  async getUserList(
    @Args('userIds', { type: () => [ID] }) userIds: string[],
  ): Promise<UserPayload[]> {
    return this.service.findUserList(userIds);
  }
}
