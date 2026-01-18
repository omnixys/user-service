import type { UserType } from '../enums/user-type.enum.js';
import type { PhoneNumberInput } from '../input/phone-number.input.js';

export interface UserDTO {
  id: string;
  userType: UserType;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumbers?: PhoneNumberInput[];
  invitationId?: string;
}

export interface UserUpdateDTO {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}
