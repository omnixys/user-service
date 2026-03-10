/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { InterestMapper } from '../models/mapper/interest.mapper.js';
import { CustomerInterestPayload } from '../models/payload/customer-interest.payload.js';
import { InterestPayload } from '../models/payload/interest.payload.js';
import { UserReadService } from '../services/user-read.service.js';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver(() => CustomerInterestPayload)
export class CustomerInterestFieldsResolver {
  constructor(private readonly readService: UserReadService) {}

  /* ------------------------------------------------------------------
   * Interest (optional)
   * ------------------------------------------------------------------ */
  @ResolveField(() => InterestPayload, { nullable: true })
  async interest(@Parent() customerInterest: CustomerInterestPayload) {
    const entity = await this.readService.getInterestById(
      customerInterest.interestId,
    );
    return entity ? InterestMapper.toPayload(entity) : null;
  }
}
