import { CreateUserInput } from '@omnixys/graphql';
import { userMapper } from '../models/mapper/user.mapper.js';
import { UserPayload } from '../models/payload/user.payload.js';
import { RegisterService } from '../services/register.service.js';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class RegisterResolver {
  constructor(private readonly service: RegisterService) {}

  /* ------------------------------------------------------------------
   * Create
   * ------------------------------------------------------------------ */
  @Mutation(() => UserPayload, { name: 'createUser' })
  async create(@Args('input') input: CreateUserInput): Promise<UserPayload> {
    const user = await this.service.create(input);
    return userMapper.toPayload(user);
  }

  @Query(() => Boolean)
  async checkUsername(@Args('username') username: string): Promise<boolean> {
    return this.service.checkUsername(username);
  }

  @Query(() => Boolean)
  async checkEmail(@Args('email') email: string): Promise<boolean> {
    return this.service.checkEmail(email);
  }
}
