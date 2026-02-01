import {
  CurrentUser,
  CurrentUserData,
} from '../../auth/decorators/current-user.decorator.js';
import { CookieAuthGuard } from '../../auth/guards/cookie-auth.guard.js';
import { UserAddressInput } from '../models/input/address.input.js';
import { AddContactInput } from '../models/input/contact.input.js';

import { CreateUserInput } from '../models/input/create-user.input.js';
import { PhoneNumberInput } from '../models/input/phone-number.input.js';
import { AddSecurityQuestionInput } from '../models/input/security-question.input.js';
import {
  UpdateMeInput,
  UpdateUserInput,
} from '../models/input/update-user.input.js';
import { userMapper } from '../models/mapper/user.mapper.js';

import { UserPayload } from '../models/payload/user.payload.js';
import { UserWriteService } from '../services/user-write.service.js';

import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';

@Resolver(() => UserPayload)
export class UserMutationResolver {
  constructor(private readonly service: UserWriteService) {}

  /* ------------------------------------------------------------------
   * Create
   * ------------------------------------------------------------------ */

  @Mutation(() => UserPayload, { name: 'createUser' })
  async create(@Args('input') input: CreateUserInput): Promise<UserPayload> {
    const user = await this.service.create(input);
    return userMapper.toPayload(user);
  }

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
   * Addresses
   * ------------------------------------------------------------------ */

  @UseGuards(CookieAuthGuard)
  @Mutation(() => Boolean, { name: 'addAddress' })
  async addAddress(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('address') input: UserAddressInput,
  ): Promise<boolean> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }

    await this.service.addAddress(currentUser.id, input);
    return true;
  }

  @UseGuards(CookieAuthGuard)
  @Mutation(() => Boolean, { name: 'removeAddress' })
  async removeAddress(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('addressId', { type: () => ID }) addressId: string,
  ): Promise<boolean> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }

    await this.service.removeAddress(currentUser.id, addressId);
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

  /* ------------------------------------------------------------------
   * Security Questions
   * ------------------------------------------------------------------ */

  @UseGuards(CookieAuthGuard)
  @Mutation(() => Boolean, { name: 'addSecurityQuestion' })
  async addSecurityQuestion(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('question') input: AddSecurityQuestionInput,
  ): Promise<boolean> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }

    await this.service.addSecurityQuestion(currentUser.id, input);
    return true;
  }

  @UseGuards(CookieAuthGuard)
  @Mutation(() => Boolean, { name: 'updateSecurityAnswer' })
  async updateSecurityAnswer(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('questionId', { type: () => ID }) questionId: string,
    @Args('answerHash') answerHash: string,
  ): Promise<boolean> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }

    await this.service.updateSecurityAnswer(
      currentUser.id,
      questionId,
      answerHash,
    );
    return true;
  }

  @UseGuards(CookieAuthGuard)
  @Mutation(() => Boolean, { name: 'removeSecurityQuestion' })
  async removeSecurityQuestion(
    @CurrentUser() currentUser: CurrentUserData,
    @Args('questionId', { type: () => ID }) questionId: string,
  ): Promise<boolean> {
    if (!currentUser?.id) {
      throw new UnauthorizedException('Not authenticated');
    }

    await this.service.removeSecurityQuestion(currentUser.id, questionId);
    return true;
  }
}
