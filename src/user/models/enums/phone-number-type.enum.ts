import { registerEnumType } from '@nestjs/graphql';

/**
 * Enum for different phone number categories.
 * Mirrors the Prisma enum `PhoneType`.
 */
export enum PhoneNumberType {
  WHATSAPP = 'WHATSAPP',
  PRIVATE = 'PRIVATE',
  WORK = 'WORK',
  OTHER = 'OTHER',
}

// Register enum for GraphQL usage
registerEnumType(PhoneNumberType, {
  name: 'PhoneNumberType',
  description: 'Specifies the type/category of a phone number.',
});
