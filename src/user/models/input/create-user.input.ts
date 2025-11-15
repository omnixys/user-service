import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PhoneNumberInput } from './phone-number.input.js';

/**
 * Input type for creating a new user.
 * Corresponds to fields in the User entity.
 */
@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  @Length(3, 32)
  username!: string;

  @Field(() => String)
  @IsString()
  @Length(1, 64)
  firstName!: string;

  @Field(() => String)
  @IsString()
  @Length(1, 64)
  lastName!: string;

  @Field(() => String)
  @IsEmail()
  email!: string;

  // Optional list of phone numbers (WHATSAPP, PRIVATE, WORK, etc.)
  @Field(() => [PhoneNumberInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PhoneNumberInput)
  phoneNumbers?: PhoneNumberInput[];
}
