import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { UserType } from '../enums/user-type.enum.js';
import { PersonStatus } from '../enums/person-status.enum.js';

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

  // Ticket IDs stored as string array (references external Ticket microservice)
  @Field(() => [String], { nullable: 'itemsAndList' })
  ticketIds?: string[];

  // Invitation IDs stored as string array (references external Invitation microservice)
  @Field(() => [String], { nullable: 'itemsAndList' })
  invitationIds?: string[];

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
