import { PhoneNumberPayload } from '../models/payload/phone-number.payload.js';
import { SecurityPayload } from '../models/payload/security.payload.js';
import { UserPayload } from '../models/payload/user.payload.js';

import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { UserReadService } from '../services/user-read.service.js';

@Resolver(() => UserPayload)
export class UserFieldsResolver {
  constructor(private readonly readService: UserReadService) {}

  @ResolveField(() => [PhoneNumberPayload], { nullable: true })
  async phoneNumbers(@Parent() user: UserPayload) {
    return this.readService.getPhoneNumbers(user.id);
  }

  @ResolveField(() => [SecurityPayload], { nullable: true })
  async securityInfo(@Parent() user: UserPayload) {
    return this.readService.getSecurityInfo(user.id);
  }
}
