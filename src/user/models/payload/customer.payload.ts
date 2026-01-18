import { Field, ID, ObjectType } from '@nestjs/graphql';
import { StatusType } from '../enums/status-type.enum.js';
import { InterestType } from '../enums/interest-type.enum.js';
import { ContactOptionsType } from '../enums/contact-options-type.enum.js';

@ObjectType()
export class CustomerPayload {
  @Field(() => ID)
  id!: string;

  @Field()
  tierLevel!: number;

  @Field()
  subscribed!: boolean;

  @Field(() => StatusType)
  state!: StatusType;

  @Field(() => [InterestType])
  interests!: InterestType[];

  @Field(() => [ContactOptionsType])
  contactOptions!: ContactOptionsType[];
}
