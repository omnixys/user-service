import { InterestCategoryEnum } from '../enums/interest-category.enum.js';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InterestCategoryPayload {
  @Field(() => ID)
  id!: string;

  @Field(() => InterestCategoryEnum)
  key!: InterestCategoryEnum;

  @Field()
  name!: string;

  @Field({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
