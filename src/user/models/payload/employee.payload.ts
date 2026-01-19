import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EmployeePayload {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  department?: string;

  @Field({ nullable: true })
  position?: string;

  @Field({ nullable: true })
  role?: string;

  @Field(() => Number, { nullable: true })
  salary?: number;

  @Field(() => Date, { nullable: true })
  hireDate?: Date;

  @Field()
  isExternal!: boolean;
}
