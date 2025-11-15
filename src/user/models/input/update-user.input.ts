import { Field, InputType, ID } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

/**
 * Input type for updating user information.
 * Allows updating name, tickets, and invitations.
 */
@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  @IsString()
  id!: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  ticketIds?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  invitationIds?: string[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 64)
  firstName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 64)
  lastName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  @Length(1, 64)
  email?: string;
}

@InputType()
export class UpdateMeInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 64)
  firstName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 64)
  lastName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  @Length(1, 64)
  email?: string;
}
