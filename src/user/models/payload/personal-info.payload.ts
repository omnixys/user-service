import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GenderType } from '../enums/gender-type.enum.js';
import { MaritalStatusType } from '../enums/marital-status-type.enum.js';

@ObjectType()
export class PersonalInfoPayload {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field(() => Date, { nullable: true })
  birthDate?: Date;

  @Field(() => GenderType, { nullable: true })
  gender?: GenderType;

  @Field(() => MaritalStatusType, { nullable: true })
  maritalStatus?: MaritalStatusType;
}
