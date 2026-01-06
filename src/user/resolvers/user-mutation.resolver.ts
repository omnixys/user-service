import {
  CurrentUser,
  CurrentUserData,
} from '../../auth/decorators/current-user.decorator.js';
import { CookieAuthGuard } from '../../auth/guards/cookie-auth.guard.js';
import { CreateUserInput } from '../models/input/create-user.input.js';
import { PhoneNumberInput } from '../models/input/phone-number.input.js';
import {
  UpdateMeInput,
  UpdateUserInput,
} from '../models/input/update-user.input.js';
import { UserPayload } from '../models/payload/user.payload.js';
import { UserWriteService } from '../services/user-write.service.js';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';

@Resolver(() => UserPayload)
export class UserMutationResolver {
  constructor(private readonly service: UserWriteService) {}

  @Mutation(() => UserPayload, { name: 'createUser' })
  async create(@Args('input') input: CreateUserInput): Promise<UserPayload> {
    return this.service.create(input);
  }

  @Mutation(() => UserPayload, { name: 'updateUser' })
  update(@Args('input') input: UpdateUserInput): Promise<UserPayload> {
    return this.service.update(input);
  }

  @Mutation(() => Boolean, { name: 'deleteUser' })
  delete(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.service.delete(id);
  }

  @Mutation(() => String, { name: 'addPhoneNumber' })
  @UseGuards(CookieAuthGuard)
  async addPhoneNumber(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('phoneNumbers', { type: () => [PhoneNumberInput] })
    phoneNumbers: PhoneNumberInput[],
  ): Promise<string> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }

    await this.service.addPhoneNumber({
      userId: currentUser.id,
      phoneNumbers,
    });
    return 'ok';
  }

  @UseGuards(CookieAuthGuard)
  @Mutation(() => String, { name: 'removePhoneNumber' })
  async removePhoneNumber(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('phoneNumberIds', { type: () => [String] })
    phoneNumberIds: string[],
  ): Promise<string> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }
    await this.service.removePhoneNumber({
      userId: currentUser.id,
      ids: phoneNumberIds,
    });
    return 'ok';
  }

  @UseGuards(CookieAuthGuard)
  @Mutation(() => UserPayload, { name: 'updateMe' })
  async updateMe(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('input') input: UpdateMeInput,
  ): Promise<UserPayload> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }

    return this.service.update({ ...input, id: currentUser.id });
  }

  @UseGuards(CookieAuthGuard)
  @Mutation(() => UserPayload, { name: 'updateMe' })
  async resetPassword(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('input') input: UpdateMeInput,
  ): Promise<UserPayload> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }

    return this.service.update({ ...input, id: currentUser.id });
  }
}
