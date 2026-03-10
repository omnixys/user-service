/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { CustomerInterestMapper } from '../models/mapper/customer-interest.mapper.js';
import { CustomerInterestPayload } from '../models/payload/customer-interest.payload.js';
import { CustomerPayload } from '../models/payload/customer.payload.js';
import { UserReadService } from '../services/user-read.service.js';
import { Resolver, ResolveField, Parent } from '@nestjs/graphql';

@Resolver(() => CustomerPayload)
export class CustomerFieldsResolver {
  constructor(private readonly readService: UserReadService) {}

  /* ------------------------------------------------------------------
   * Customer Interest (optional)
   * ------------------------------------------------------------------ */
  @ResolveField(() => [CustomerInterestPayload], { nullable: true })
  async customerInterest(@Parent() customer: CustomerPayload) {
    const entities = await this.readService.getCustomerInterest(customer.id);
    return entities.length
      ? CustomerInterestMapper.toPayloadList(entities)
      : [];
  }
}
