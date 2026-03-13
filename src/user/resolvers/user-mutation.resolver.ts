import {
  AddContactInput,
  PhoneNumberInput,
  UpdateMeInput,
  UpdateUserInput,
} from '@omnixys/graphql';
import { userMapper } from '../models/mapper/user.mapper.js';

import { UserPayload } from '../models/payload/user.payload.js';
import { UserWriteService } from '../services/user-write.service.js';

import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { CookieAuthGuard, CurrentUser, CurrentUserData } from '@omnixys/auth';

@Resolver(() => UserPayload)
export class UserMutationResolver {
  constructor(private readonly service: UserWriteService) {}

  /* ------------------------------------------------------------------
   * Update (admin / internal)
   * ------------------------------------------------------------------ */

  @Mutation(() => UserPayload, { name: 'updateUser' })
  async update(@Args('input') input: UpdateUserInput): Promise<UserPayload> {
    const user = await this.service.update(input);
    return userMapper.toPayload(user);
  }

  /* ------------------------------------------------------------------
   * Update current user
   * ------------------------------------------------------------------ */
  @UseGuards(CookieAuthGuard)
  @Mutation(() => UserPayload, { name: 'updateMe' })
  async updateMe(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('input') input: UpdateMeInput,
  ): Promise<UserPayload> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }

    const user = await this.service.update({
      ...input,
      id: currentUser.id,
    });
    return userMapper.toPayload(user);
  }

  /* ------------------------------------------------------------------
   * Delete user
   * ------------------------------------------------------------------ */

  @Mutation(() => Boolean, { name: 'deleteUser' })
  async delete(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.service.delete(id);
  }

  /* ------------------------------------------------------------------
   * Phone Numbers
   * ------------------------------------------------------------------ */

  @UseGuards(CookieAuthGuard)
  @Mutation(() => Boolean, { name: 'addPhoneNumbers' })
  async addPhoneNumbers(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('phoneNumbers', { type: () => [PhoneNumberInput] })
    phoneNumbers: PhoneNumberInput[],
  ): Promise<boolean> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }

    await this.service.addPhoneNumber({
      userId: currentUser.id,
      phoneNumbers,
    });

    return true;
  }

  @UseGuards(CookieAuthGuard)
  @Mutation(() => Boolean, { name: 'removePhoneNumbers' })
  async removePhoneNumbers(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('phoneNumberIds', { type: () => [ID] })
    phoneNumberIds: string[],
  ): Promise<boolean> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }

    await this.service.removePhoneNumber({
      userId: currentUser.id,
      ids: phoneNumberIds,
    });

    return true;
  }

  /* ------------------------------------------------------------------
   * Contacts
   * ------------------------------------------------------------------ */

  @UseGuards(CookieAuthGuard)
  @Mutation(() => Boolean, { name: 'addContact' })
  async addContact(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('contact')
    input: AddContactInput,
  ): Promise<boolean> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }

    await this.service.addContact(input);
    return true;
  }

  @UseGuards(CookieAuthGuard)
  @Mutation(() => Boolean, { name: 'removeContact' })
  async removeContact(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('contactId', { type: () => ID }) contactId: string,
  ): Promise<boolean> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }

    await this.service.removeContact(currentUser.id, contactId);
    return true;
  }
}
