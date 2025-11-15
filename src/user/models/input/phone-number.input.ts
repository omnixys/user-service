import { PhoneNumberType } from '../enums/phone-number-type.enum.js';
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsString, Length } from 'class-validator';

/**
 * Nested input for phone number creation inside CreateUserInput.
 */
@InputType()
export class PhoneNumberInput {
  @Field(() => String)
  @IsString()
  @Length(3, 32)
  number!: string;

  @Field(() => PhoneNumberType)
  @IsEnum(PhoneNumberType)
  type!: PhoneNumberType;
}

@InputType()
export class AddPhoneNumberInput {
  @Field(() => ID)
  userId!: string;

  @Field()
  number!: string;

  @Field(() => PhoneNumberType)
  type!: PhoneNumberType;
}

@InputType()
export class RemovePhoneNumberInput {
  @Field(() => ID)
  userId!: string;

  @Field(() => ID)
  phoneNumberId!: string;
}
