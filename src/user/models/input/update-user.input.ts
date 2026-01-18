import { PersonStatus } from '../enums/person-status.enum.js';
import { UserType } from '../enums/user-type.enum.js';
import { Field, InputType, ID } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { PersonalInfoInput } from './personal-info.input.js';

@InputType()
export class UpdateMeInput {
  @Field(() => PersonalInfoInput, { nullable: true })
  personalInfo?: PersonalInfoInput;
}

/**
 * Input type for updating user information.
 * Allows updating name, tickets, and invitations.
 */
@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  id!: string;

  @Field(() => UserType, { nullable: true })
  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;

  @Field(() => PersonStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PersonStatus)
  status?: PersonStatus;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  ticketIds?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  invitationIds?: string[];
}
