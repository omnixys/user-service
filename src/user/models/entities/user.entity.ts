import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { PhoneNumber } from './phone-number.entity.js';

/**
 * Represents a user entity in the GraphQL schema.
 * Mirrors the Prisma model `User` from the user-service.
 */
@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  username!: string;

  @Field(() => String)
  firstName!: string;

  @Field(() => String)
  lastName!: string;

  @Field(() => String)
  email!: string;

  // List of phone numbers associated with this user
  @Field(() => [PhoneNumber], { nullable: 'itemsAndList' })
  phoneNumbers?: PhoneNumber[];

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
