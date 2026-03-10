import { InterestEnum } from '../enums/interest.enum.js';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InterestPayload {
  @Field(() => ID)
  id!: string;

  @Field(() => InterestEnum)
  key!: InterestEnum;

  @Field(() => String)
  name!: string;

  @Field(() => ID)
  categoryId!: string;

  @Field({ nullable: true })
  icon?: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
