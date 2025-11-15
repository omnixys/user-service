import { PhoneNumberInput } from '../input/phone-number.input.js';

export interface UserDTO {
  id: string;
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
