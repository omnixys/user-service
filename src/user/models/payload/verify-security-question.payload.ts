// verify-security-question.payload.ts
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VerifySecurityQuestionPayload {
  @Field()
  success!: boolean;

  @Field({ nullable: true })
  lockedUntil?: Date;

  @Field(() => ID, { nullable: true })
  userId?: string;
}
