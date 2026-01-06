import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SecurityQuestionPayload {
  @Field(() => ID)
  id!: string;

  @Field()
  question!: string;
}
