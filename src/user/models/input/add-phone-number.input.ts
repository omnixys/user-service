import { Field, InputType, ID } from '@nestjs/graphql';
import { IsEnum, IsString, Length } from 'class-validator';
import { PhoneNumberType } from '../enums/phone-number-type.enum.js';

/**
 * Input type for adding a phone number to a user.
 */
@InputType()
export class AddPhoneNumberInput {
  @Field(() => ID)
  @IsString()
  userId!: string;

  @Field(() => String)
  @IsString()
  @Length(3, 32)
  number!: string;

  @Field(() => PhoneNumberType)
  @IsEnum(PhoneNumberType)
  type!: PhoneNumberType;
}
