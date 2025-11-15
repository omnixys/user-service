import {
  CurrentUser,
  CurrentUserData,
} from '../../auth/decorators/current-user.decorator.js';
import { CookieAuthGuard } from '../../auth/guards/cookie-auth.guard.js';
import { User } from '../models/entities/user.entity.js';
import { CreateUserInput } from '../models/input/create-user.input.js';
import { PhoneNumberInput } from '../models/input/phone-number.input.js';
import { UpdateUserInput } from '../models/input/update-user.input.js';
import { UserWriteService } from '../services/user-write.service.js';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';

@Resolver(() => User)
export class UserMutationResolver {
  constructor(private readonly service: UserWriteService) {}

  @Mutation(() => User, { name: 'createUser' })
  async create(@Args('input') input: CreateUserInput): Promise<User> {
    return this.service.create(input);
  }

  @Mutation(() => User, { name: 'updateUser' })
  update(@Args('input') input: UpdateUserInput): Promise<User> {
    return this.service.update(input);
  }

  @Mutation(() => User, { name: 'addPhoneNumber' })
  @UseGuards(CookieAuthGuard)
  async addPhoneNumber(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('phoneNumbers', { type: () => [PhoneNumberInput] })
    phoneNumbers: PhoneNumberInput[],
  ): Promise<void> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }

    await this.service.addPhoneNumber({
      userId: currentUser.id,
      phoneNumbers,
    });
  }

  @UseGuards(CookieAuthGuard)
  @Mutation(() => User, { name: 'removePhoneNumber' })
  async removePhoneNumber(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('phoneNumberIds', { type: () => [String] })
    phoneNumberIds: string[],
  ): Promise<void> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }
    await this.service.removePhoneNumber({
      userId: currentUser.id,
      ids: phoneNumberIds,
    });
  }

  @Mutation(() => Boolean, { name: 'deleteUser' })
  delete(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.service.remove(id);
  }
}
