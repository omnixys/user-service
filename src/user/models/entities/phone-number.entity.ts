import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PhoneNumberType } from '../enums/phone-number-type.enum.js';

/**
 * Represents a phone number linked to a specific user.
 */
@ObjectType()
export class PhoneNumber {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  number!: string;

  @Field(() => PhoneNumberType)
  type!: PhoneNumberType;

  @Field(() => String)
  userId!: string;
}
