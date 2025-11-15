import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { UserReadService } from '../services/user-read.service.js';
import { LoggerPlusService } from '../../logger/logger-plus.service.js';
import { User } from '../models/entities/user.entity.js';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { CookieAuthGuard } from '../../auth/guards/cookie-auth.guard.js';
import { RoleGuard } from '../../auth/guards/role.guard.js';
import {
  CurrentUser,
  CurrentUserData,
} from '../../auth/decorators/current-user.decorator.js';

@Resolver(() => User)
export class UserQueryResolver {
  private readonly logger;

  constructor(
    private readonly loggerService: LoggerPlusService,
    private readonly service: UserReadService,
  ) {
    this.logger = this.loggerService.getLogger(UserQueryResolver.name);
  }

  @Query(() => [User], { name: 'users' })
  get(): Promise<User[]> {
    return this.service.findAll();
  }

  @UseGuards(CookieAuthGuard, RoleGuard)
  @Query(() => [User], { name: 'users' })
  getMe(@CurrentUser() currentUser: CurrentUserData): Promise<User> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }
    return this.service.findOne(currentUser.id);
  }

  @Query(() => User, { name: 'user' })
  getById(@Args('id', { type: () => ID }) id: string): Promise<User> {
    this.logger.debug('getById: id=%s', id);
    return this.service.findOne(id);
  }
}
