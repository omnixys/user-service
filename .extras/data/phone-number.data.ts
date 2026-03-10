import { PhoneNumberType } from '../../src/prisma/generated/client';

/**
 * PHONE_NUMBER TABLE SEED DATA
 * ------------------------------------------------------------
 * One-to-many from PersonalInfo
 * Exactly one primary phone number per person
 * Deterministic UUIDs starting at:
 * 10000000-0000-0000-0000-000000000000
 * ------------------------------------------------------------
 */
export const PHONE_NUMBERS = [
  // ---------------------------------------------------------------------------
  // CORE USERS
  // ---------------------------------------------------------------------------
  {
    id: '10000000-0000-0000-0000-000000000000',
    infoId: 'dde8114c-2637-462a-90b9-413924fa3f55',
    number: '000050000000',
    type: PhoneNumberType.MOBILE,
    label: 'primary',
    isPrimary: true,
    countryCode: 'DE',
  },
  {
    id: '10000000-0000-0000-0000-000000000001',
    infoId: '694d2e8e-0932-4c8f-a1c4-e300dc235be4',
    number: '15111951223',
    type: PhoneNumberType.MOBILE,
    label: 'primary',
    isPrimary: true,
    countryCode: 'DE',
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    infoId: 'f9de3f8a-5b79-4f3a-9267-10c1b9ce2a03',
    number: '00000000002',
    type: PhoneNumberType.MOBILE,
    label: 'primary',
    isPrimary: true,
    countryCode: 'DE',
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    infoId: 'ae489d9b-96ce-4942-bcb1-c2e2a0c92e83',
    number: '00000000000',
    type: PhoneNumberType.OTHER,
    label: 'guest',
    isPrimary: true,
    countryCode: 'DE',
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    infoId: '20e7e44e-9bcd-4016-bebd-36f8d75357b6',
    number: '0000000047000',
    type: PhoneNumberType.WORK,
    label: 'security',
    isPrimary: true,
    countryCode: 'DE',
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    infoId: '9e219f6f-7706-4294-8b5b-a4105999846f',
    number: '000400000000',
    type: PhoneNumberType.MOBILE,
    label: 'primary',
    isPrimary: true,
    countryCode: 'DE',
  },
  {
    id: '10000000-0000-0000-0000-000000000006',
    infoId: '18bbde19-7e76-45dc-b204-f5c397e11362',
    number: '000000004000',
    type: PhoneNumberType.MOBILE,
    label: 'primary',
    isPrimary: true,
    countryCode: 'DE',
  },

  // ---------------------------------------------------------------------------
  // SEEDED USERS (SEQUENTIAL)
  // ---------------------------------------------------------------------------
  {
    id: '10000000-0000-0000-0000-000000000007',
    infoId: '00000000-0000-0000-0000-000000000000',
    number: '3012345676',
    type: PhoneNumberType.WORK,
    label: 'office',
    isPrimary: true,
    countryCode: 'DE',
  },
  {
    id: '10000000-0000-0000-0000-000000000008',
    infoId: '00000000-0000-0000-0000-000000000001',
    number: '123445670',
    type: PhoneNumberType.PRIVATE,
    label: 'home',
    isPrimary: true,
    countryCode: 'DE',
  },
  {
    id: '10000000-0000-0000-0000-000000000009',
    infoId: '00000000-0000-0000-0000-000000000002',
    number: '0301234567',
    type: PhoneNumberType.MOBILE,
    label: 'mobile',
    isPrimary: true,
    countryCode: 'DE',
  },
  {
    id: '10000000-0000-0000-0000-000000000010',
    infoId: '00000000-0000-0000-0000-000000000003',
    number: '03052345678',
    type: PhoneNumberType.MOBILE,
    label: 'mobile',
    isPrimary: true,
    countryCode: 'DE',
  },
  {
    id: '10000000-0000-0000-0000-000000000011',
    infoId: '00000000-0000-0000-0000-000000000004',
    number: '66951234567',
    type: PhoneNumberType.WORK,
    label: 'office',
    isPrimary: true,
    countryCode: 'DE',
  },
  {
    id: '10000000-0000-0000-0000-000000000012',
    infoId: '00000000-0000-0000-0000-000000000005',
    number: '000000000702',
    type: PhoneNumberType.MOBILE,
    label: 'mobile',
    isPrimary: true,
    countryCode: 'DE',
  },
  {
    id: '10000000-0000-0000-0000-000000000013',
    infoId: '00000000-0000-0000-0000-000000000006',
    number: '49717071234567',
    type: PhoneNumberType.MOBILE,
    label: 'mobile',
    isPrimary: true,
    countryCode: 'DE',
  },
  {
    id: '10000000-0000-0000-0000-000000000014',
    infoId: '00000000-0000-0000-0000-000000000007',
    number: '88472871234567',
    type: PhoneNumberType.WORK,
    label: 'office',
    isPrimary: true,
    countryCode: 'DE',
  },
  {
    id: '10000000-0000-0000-0000-000000000015',
    infoId: '00000000-0000-0000-0000-000000000008',
    number: '120211234567',
    type: PhoneNumberType.MOBILE,
    label: 'mobile',
    isPrimary: true,
    countryCode: 'DE',
  },
  {
    id: '10000000-0000-0000-0000-000000000016',
    infoId: '00000000-0000-0000-0000-000000000009',
    number: '82271234567',
    type: PhoneNumberType.WORK,
    label: 'office',
    isPrimary: true,
    countryCode: 'DE',
  },
] as const;
