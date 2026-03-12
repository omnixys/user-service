import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { PersonStatus, RealmRole, UserType } from '@omnixys/contracts';

/**
 * Represents a user entity in the GraphQL schema.
 * Mirrors the Prisma model `User` from the user-service.
 */
@ObjectType()
export class UserPayload {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  username!: string;

  @Field(() => UserType)
  userType!: UserType;

  @Field(() => PersonStatus)
  status!: PersonStatus;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => RealmRole, { nullable: true })
  role?: RealmRole;
}
