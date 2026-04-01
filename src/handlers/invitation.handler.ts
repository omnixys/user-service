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

import { Injectable } from '@nestjs/common';
import {
  KafkaEvent,
  IKafkaEventContext,
  KafkaEventHandler,
  KafkaTopics,
  IKafkaEventHandler,
} from '@omnixys/kafka';
import { OmnixysLogger } from '@omnixys/logger';
import { KcSignUpUserDTO } from '@omnixys/shared';
import { RegisterService } from '../user/services/register.service.js';
import { UserWriteService } from '../user/services/user-write.service.js';

/**
 * Kafka event handler responsible for useristrative commands such as
 * shutdown and restart. It listens for specific user-related topics
 * and delegates the actual process control logic to the {@link UserService}.
 *
 * @category Messaging
 * @since 1.0.0
 */
@KafkaEventHandler('invitation')
@Injectable()
export class InvitationHandler implements IKafkaEventHandler {
  private readonly log;

  constructor(
    private readonly logger: OmnixysLogger,
    private readonly registerService: RegisterService,
    private readonly userWriteService: UserWriteService,
  ) {
    this.log = this.logger.log(this.constructor.name);
  }

  /**
   * Handles incoming Kafka user events and executes the appropriate useristrative command.
   *
   * @param topic - The Kafka topic representing the user command (e.g. shutdown, restart).
   * @param data - The payload associated with the Kafka message.
   * @param context - The Kafka context metadata containing headers and partition info.
   *
   * @returns A Promise that resolves once the command has been processed.
   */
  @KafkaEvent(
    KafkaTopics.user.addId,
    KafkaTopics.user.createProviderUser,
    KafkaTopics.user.deleteUser,
  )
  async handle(
    topic: string,
    data: { payload: any },
    context: IKafkaEventContext,
  ): Promise<void> {
    this.log.warn(`User command received: ${topic}`);
    this.log.debug('Kafka context: %o', context);

    switch (topic) {
      case KafkaTopics.user.deleteUser:
        await this.deleteUser(data as { payload: { id: string } });
        break;

      case KafkaTopics.user.addId:
        await this.addUserId(data as { payload: KcSignUpUserDTO });
        break;

      case KafkaTopics.user.createProviderUser:
        await this.createProviderUser(
          data as {
            payload: { userId: string; email?: string; username?: string };
          },
        );
        break;

      default:
        this.log.warn(`Unknown authentication topic: ${topic}`);
    }
  }
  // private async updateUser(data: { payload: UserUpdateDTO }) {
  //   await this.userWriteService.update(data.payload);
  // }

  private async deleteUser(data: { payload: { id: string } }) {
    await this.userWriteService.delete(data.payload.id);
  }

  private async addUserId(data: { payload: KcSignUpUserDTO }) {
    await this.registerService.addUserId(data.payload);
  }

  private async createProviderUser(data: {
    payload: { userId: string; email?: string; username?: string };
  }) {
    await this.registerService.createProviderUser(data.payload);
  }
}
