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

import { KcSignUpUserDTO } from '@omnixys/contracts';
import {
  KafkaEvent,
  KafkaHandler,
} from '../kafka/decorators/kafka-event.decorator.js';
import {
  type KafkaEventContext,
  KafkaEventHandler,
} from '../kafka/interface/kafka-event.interface.js';
import { getTopic, getTopics } from '../kafka/kafka-topic.properties.js';
import { LoggerPlusService } from '../logger/logger-plus.service.js';
import { UserDTO, UserUpdateDTO } from '../user/models/dto/user.dto.js';
import { RegisterService } from '../user/services/register.service.js';
import { UserWriteService } from '../user/services/user-write.service.js';
import { Injectable } from '@nestjs/common';

/**
 * Kafka event handler responsible for useristrative commands such as
 * shutdown and restart. It listens for specific user-related topics
 * and delegates the actual process control logic to the {@link UserService}.
 *
 * @category Messaging
 * @since 1.0.0
 */
@KafkaHandler('authentication')
@Injectable()
export class AuthenticationHandler implements KafkaEventHandler {
  private readonly logger;

  /**
   * Creates a new instance of {@link UserHandler}.
   *
   * @param loggerService - The central logger service used for structured logging.
   * @param userService - The service responsible for handling system-level user operations.
   */
  constructor(
    private readonly loggerService: LoggerPlusService,
    private readonly registerService: RegisterService,
    private readonly userWriteService: UserWriteService,
  ) {
    this.logger = this.loggerService.getLogger(AuthenticationHandler.name);
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
    ...getTopics('createUser', 'updateUser', 'deleteUser', 'addUserId'),
  )
  async handle(
    topic: string,
    data: { payload: any },
    context: KafkaEventContext,
  ): Promise<void> {
    this.logger.warn(`User command received: ${topic}`);
    this.logger.debug('Kafka context: %o', context);

    switch (topic) {
      case getTopic('createUser'):
        await this.createUserWithId(data as { payload: UserDTO });
        break;

      case getTopic('updateUser'):
        await this.updateUser(data as { payload: UserUpdateDTO });
        break;

      case getTopic('deleteUser'):
        await this.deleteUser(data as { payload: { id: string } });
        break;

      case getTopic('addUserId'):
        await this.addUserId(data as { payload: KcSignUpUserDTO });
        break;

      case getTopic('createProviderUser'):
        await this.createProviderUser(
          data as {
            payload: { userId: string; email?: string; username?: string };
          },
        );
        break;

      default:
        this.logger.warn(`Unknown authentication topic: ${topic}`);
    }
  }

  private async createUserWithId(data: { payload: UserDTO }) {
    await this.userWriteService.createWithId(data.payload);
  }

  private async updateUser(data: { payload: UserUpdateDTO }) {
    await this.userWriteService.update(data.payload);
  }

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
