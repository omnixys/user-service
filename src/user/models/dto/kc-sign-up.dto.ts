import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, Length } from 'class-validator';

/**
 * Input type for creating a new user.
 * Corresponds to fields in the User entity.
 */
@InputType()
export class KCSignUpDTO {
  @Field(() => String)
  @IsString()
  @Length(3, 32)
  username!: string;

  @Field(() => String)
  @IsString()
  @Length(1, 64)
  firstName!: string;

  @Field(() => String)
  @IsString()
  @Length(1, 64)
  lastName!: string;

  @Field(() => String)
  @IsEmail()
  email!: string;
}
