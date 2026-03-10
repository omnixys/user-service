import { InterestMapper } from '../models/mapper/interest.mapper.js';
import { InterestCategoryPayload } from '../models/payload/interest-category.payload.js';
import { InterestPayload } from '../models/payload/interest.payload.js';
import { UserReadService } from '../services/user-read.service.js';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver(() => InterestCategoryPayload)
export class InteresCategoryFieldsResolver {
  constructor(private readonly readService: UserReadService) {}

  /* ------------------------------------------------------------------
   * Interest (optional)
   * ------------------------------------------------------------------ */
  @ResolveField(() => [InterestPayload], { nullable: true, name: 'interests' })
  async interest(
    @Parent() categoryInterest: InterestCategoryPayload,
  ): Promise<InterestPayload[]> {
    const entity = await this.readService.getInterestByCategoryId(
      categoryInterest.id,
    );
    return entity ? InterestMapper.toPayloadList(entity) : [];
  }
}
