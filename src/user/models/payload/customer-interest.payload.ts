import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
export class CustomerInterestPayload {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  customerId!: string;

  @Field(() => ID)
  interestId!: string;

  @Field(() => Int, { nullable: true })
  level?: number;

  @Field(() => Boolean, { nullable: true })
  isPrimary?: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}
