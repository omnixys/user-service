import {
  CurrentUser,
  CurrentUserData,
} from '../../auth/decorators/current-user.decorator.js';
import { Public } from '../../auth/decorators/public.decorator.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { CookieAuthGuard } from '../../auth/guards/cookie-auth.guard.js';
import { RoleGuard } from '../../auth/guards/role.guard.js';
import { LoggerPlusService } from '../../logger/logger-plus.service.js';
import { userMapper } from '../models/mapper/user.mapper.js';
import { UserPayload } from '../models/payload/user.payload.js';
import { UserReadService } from '../services/user-read.service.js';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, ID, Query, Resolver } from '@nestjs/graphql';

@Resolver(() => UserPayload)
export class UserQueryResolver {
  private readonly logger;

  constructor(
    private readonly loggerService: LoggerPlusService,
    private readonly service: UserReadService,
  ) {
    this.logger = this.loggerService.getLogger(UserQueryResolver.name);
  }

  /* ------------------------------------------------------------------
   * ADMIN / SERVICE QUERY – all users
   * ------------------------------------------------------------------ */
  @UseGuards(CookieAuthGuard, RoleGuard)
  @Roles('ADMIN')
  @Query(() => [UserPayload], { name: 'users' })
  async getAll(): Promise<UserPayload[]> {
    const users = await this.service.findAll();
    this.logger.debug('getAll: found %d users', users.length);
    return userMapper.toPayloadList(users);
  }

  /* ------------------------------------------------------------------
   * Single user by ID (internal / admin use)
   * ------------------------------------------------------------------ */
  @UseGuards(CookieAuthGuard, RoleGuard)
  @Roles('ADMIN', 'USER')
  @Query(() => UserPayload, { name: 'user' })
  async getById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<UserPayload> {
    this.logger.debug('getById: id=%s', id);
    const user = await this.service.findById(id);
    return userMapper.toPayload(user);
  }

  /* ------------------------------------------------------------------
   * Current authenticated user
   * ------------------------------------------------------------------ */
  @UseGuards(CookieAuthGuard, RoleGuard)
  @Public()
  @Query(() => UserPayload, { name: 'me' })
  async getMe(
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<UserPayload> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }
    const user = await this.service.findById(currentUser.id);
    return userMapper.toPayload(user, currentUser.roles);
  }

  /* ------------------------------------------------------------------
   * Batch user lookup (internal, e.g. Event / Invitation service)
   * ------------------------------------------------------------------ */
  @UseGuards(CookieAuthGuard, RoleGuard)
  @Roles('ADMIN', 'USER')
  @Query(() => [UserPayload], { name: 'getUserList' })
  async getUserList(
    @Args('userIds', { type: () => [ID] }) userIds: string[],
  ): Promise<UserPayload[]> {
    const users = await this.service.findByIds(userIds);
    return userMapper.toPayloadList(users);
  }
}
