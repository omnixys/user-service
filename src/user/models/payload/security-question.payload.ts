import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SecurityQuestionPayload {
  @Field(() => ID)
  id!: string;

  @Field()
  question!: string;
}

@ObjectType()
export class FullSecurityQuestionPayload {
  @Field(() => ID)
  id!: string;

  @Field()
  question!: string;

  @Field(() => String)
  answerHash!: string;

  @Field()
  attempts!: number;

  @Field(() => Date, { nullable: true })
  lockedAt?: Date;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
