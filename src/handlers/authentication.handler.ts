/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * @license GPL-3.0-or-later
 * Copyright (C) 2025 Caleb Gyamfi - Omnixys Technologies
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * For more information, visit <https://www.gnu.org/licenses/>.
 */

import {
  CreateGuestUserDTO,
  RegisterService,
} from '../user/services/register.service.js';
import { UserWriteService } from '../user/services/user-write.service.js';
import { Injectable } from '@nestjs/common';
import { ValkeyKey, ValkeyService } from '@omnixys/cache';
import { CreateUserInput } from '@omnixys/graphql';
import {
  IKafkaEventContext,
  KafkaEvent,
  KafkaEventHandler,
  KafkaTopics,
} from '@omnixys/kafka';
import { OmnixysLogger } from '@omnixys/logger';
import { TraceRunner } from '@omnixys/observability';
import { EncryptionService } from '@omnixys/security';
import {
  CreateGuestDTO,
  CreateUserProviderDTO,
  GuestSignUpTokenPayload,
  GuestUserKey,
  SignUpTokenPayload,
  UserActionDTO,
  UserTokenDTO,
} from '@omnixys/shared';

/**
 * Kafka event handler responsible for useristrative commands such as
 * shutdown and restart. It listens for specific user-related topics
 * and delegates the actual process control logic to the {@link UserService}.
 *
 * @category Messaging
 * @since 1.0.0
 */
@KafkaEventHandler('authentication')
@Injectable()
export class AuthenticationHandler {
  private readonly log;

  /**
   * Creates a new instance of {@link UserHandler}.
   *
   * @param loggerService - The central logger service used for structured logging.
   * @param userService - The service responsible for handling system-level user operations.
   */
  constructor(
    private readonly logger: OmnixysLogger,
    private readonly registerService: RegisterService,
    private readonly userWriteService: UserWriteService,
    private readonly cache: ValkeyService,
    private readonly encryptionService: EncryptionService,
  ) {
    this.log = this.logger.log(this.constructor.name);
  }

  @KafkaEvent(KafkaTopics.user.createGuest)
  async handleCreateGuest(
    payload: CreateGuestDTO,
    _context: IKafkaEventContext,
  ): Promise<void> {
    return TraceRunner.run('[HANDLER] createGuest', async () => {
      const { token, userId, username, email, invitationId } = payload;

      const decrypted = this.encryptionService.decrypt(token, true);
      const { userKey } = JSON.parse(decrypted) as GuestSignUpTokenPayload;

      const raw = await this.cache.get(
        ValkeyKey.guestVerificationUser,
        userKey,
      );
      if (!raw) throw new Error('Token invalid or expired');

      const parsed = JSON.parse(raw) as GuestUserKey;

      /**
       * 🔥 IMPORTANT: find correct invitee
       */
      const invitee = parsed.users.find((u) => u.invitationId === invitationId);

      if (!invitee) {
        throw new Error('Invitee not found for invitationId');
      }

      const finalInput: CreateGuestUserDTO = {
        userId,
        username,
        email,
        firstName: invitee.firstName,
        lastName: invitee.lastName,
        phoneNumbers: invitee.phoneNumbers,
        actorId: parsed.actorId,
      };

      await this.registerService.createGuest(finalInput);

    });
  }

  @KafkaEvent(KafkaTopics.user.deleteUser)
  async handleDeleteUser(
    payload: UserActionDTO,
    _context: IKafkaEventContext,
  ): Promise<void> {
    this.log.warn('DeleteUser event received');
    this.log.debug('Payload: %o', payload);

    await this.userWriteService.delete(payload.userId);
  }

  @KafkaEvent(KafkaTopics.user.createUser)
  async handleCreateUser(
    payload: UserTokenDTO,
    _context: IKafkaEventContext,
  ): Promise<void> {
    this.log.warn('CreateUser event received');
    this.log.debug('Payload: %o', payload);

    return TraceRunner.run('[HANDLER] createUser', async () => {
      const { token, userId } = payload;

      if (!token) {
        throw new Error('TOKEN FEHLT!');
      }

      const decryptedToken = this.encryptionService.decrypt(token, true);
      const { userKey } = JSON.parse(decryptedToken) as SignUpTokenPayload;

      const raw = await this.cache.get(
        ValkeyKey.signupVerificationUser,
        userKey,
      );

      if (!raw) {
        throw new Error('Token invalid or expired');
      }

      const parsed = JSON.parse(raw);
      const input = parsed.userData as CreateUserInput;

      await this.registerService.create(input, userId);
    });
  }

  @KafkaEvent(KafkaTopics.user.createProviderUser)
  async handleCreateProviderUser(
    payload: CreateUserProviderDTO,
    _context: IKafkaEventContext,
  ): Promise<void> {
    this.log.warn('CreateProviderUser event received');
    this.log.debug('Payload: %o', payload);

    await this.registerService.createProviderUser(payload);
  }
}
