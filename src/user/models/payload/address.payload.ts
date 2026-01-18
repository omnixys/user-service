import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AddressPayload {
  @Field(() => ID)
  id!: string;

  @Field()
  street!: string;

  @Field()
  houseNumber!: string;

  @Field()
  zipCode!: string;

  @Field()
  city!: string;

  @Field({ nullable: true })
  state?: string;

  @Field()
  country!: string;

  @Field({ nullable: true })
  additionalInfo?: string;
}
