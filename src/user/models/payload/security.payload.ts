import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';

/**
 * Represents a user entity in the GraphQL schema.
 * Mirrors the Prisma model `User` from the user-service.
 */
@ObjectType()
export class SecurityPayload {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  question!: string;

  @Field(() => String)
  answer!: string;

  @Field(() => String)
  answerHash!: string;

  @Field(() => Int)
  attempts!: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  lockedAt?: Date;

  @Field(() => Boolean, { nullable: true })
  locked?: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => String)
  userId!: string;
}
