import { Field, ID, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

/**
 * Input type for removing a phone number from a user.
 */
@InputType()
export class RemovePhoneNumberInput {
  @Field(() => ID)
  @IsString()
  userId!: string;

  @Field(() => ID)
  @IsString()
  phoneNumberId!: string;
}
