import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SendPasswordResetInput {
  @Field(() => String)
  email!: string;

  @Field(() => String)
  resetUrl!: string;
}
