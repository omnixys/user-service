import {
  ContactOptionsType,
  InterestType,
  MaritalStatusType,
  StatusType,
} from '../../src/prisma/generated/client';

/**
 * CUSTOMER TABLE SEED DATA
 * ------------------------------------------------------------
 * 1:1 extension of User
 * Customer.id === User.id
 * Deterministic IDs starting at:
 * 30000000-0000-0000-0000-000000000000
 * ------------------------------------------------------------
 */
export const CUSTOMERS = [
  // ---------------------------------------------------------------------------
  // CORE USERS
  // ---------------------------------------------------------------------------
  {
    id: '694d2e8e-0932-4c8f-a1c4-e300dc235be4', // caleb
    tierLevel: 3,
    subscribed: true,
    maritalStatus: MaritalStatusType.MARRIED,
    state: StatusType.ACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.PHONE,
      ContactOptionsType.LETTER,
      ContactOptionsType.SMS,
    ],
    interests: [
      InterestType.BANK_PRODUCTS_AND_SERVICES,
      InterestType.TECHNOLOGY_AND_INNOVATION,
    ],
  },

  {
    id: 'f9de3f8a-5b79-4f3a-9267-10c1b9ce2a03', // rachel
    tierLevel: 3,
    subscribed: true,
    maritalStatus: MaritalStatusType.MARRIED,
    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.LETTER],
    interests: [],
  },

  // ---------------------------------------------------------------------------
  // SPECIAL USERS
  // ---------------------------------------------------------------------------
  {
    id: '9e219f6f-7706-4294-8b5b-a4105999846f', // audrey
    tierLevel: 2,
    subscribed: true,
    maritalStatus: MaritalStatusType.SINGLE,
    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL],
    interests: [InterestType.TECHNOLOGY_AND_INNOVATION],
  },
  {
    id: '18bbde19-7e76-45dc-b204-f5c397e11362', // christabelle
    tierLevel: 1,
    subscribed: true,
    maritalStatus: MaritalStatusType.SINGLE,
    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL],
    interests: [],
  },

  // ---------------------------------------------------------------------------
  // SEEDED USERS (00000000-…)
  // ---------------------------------------------------------------------------
  {
    id: '00000000-0000-0000-0000-000000000000',
    tierLevel: 1,
    subscribed: true,
    maritalStatus: MaritalStatusType.DIVORCED,
    state: StatusType.ACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.PHONE,
      ContactOptionsType.LETTER,
    ],
    interests: [
      InterestType.BANK_PRODUCTS_AND_SERVICES,
      InterestType.TECHNOLOGY_AND_INNOVATION,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000001',
    tierLevel: 1,
    subscribed: true,
    maritalStatus: MaritalStatusType.SINGLE,
    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
    interests: [InterestType.TECHNOLOGY_AND_INNOVATION],
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    tierLevel: 2,
    subscribed: true,
    maritalStatus: MaritalStatusType.MARRIED,
    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
    interests: [InterestType.TECHNOLOGY_AND_INNOVATION, InterestType.TRAVEL],
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    tierLevel: 1,
    subscribed: false,
    maritalStatus: MaritalStatusType.MARRIED,
    state: StatusType.INACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.LETTER,
      ContactOptionsType.SMS,
    ],
    interests: [
      InterestType.BANK_PRODUCTS_AND_SERVICES,
      InterestType.FINANCIAL_EDUCATION_AND_COUNSELING,
      InterestType.SUSTAINABLE_FINANCE,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    tierLevel: 3,
    subscribed: true,
    maritalStatus: MaritalStatusType.MARRIED,
    state: StatusType.ACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.LETTER,
      ContactOptionsType.SMS,
    ],
    interests: [
      InterestType.REAL_ESTATE,
      InterestType.INVESTMENTS,
      InterestType.CREDIT_AND_DEBT,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    tierLevel: 2,
    subscribed: true,
    maritalStatus: MaritalStatusType.SINGLE,
    state: StatusType.BLOCKED,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.PHONE,
      ContactOptionsType.LETTER,
      ContactOptionsType.SMS,
    ],
    interests: [],
  },
  {
    id: '00000000-0000-0000-0000-000000000006',
    tierLevel: 1,
    subscribed: true,
    maritalStatus: MaritalStatusType.SINGLE,
    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.PHONE],
    interests: [],
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    tierLevel: 1,
    subscribed: true,
    maritalStatus: MaritalStatusType.MARRIED,
    state: StatusType.ACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.PHONE,
      ContactOptionsType.LETTER,
    ],
    interests: [
      InterestType.SUSTAINABLE_FINANCE,
      InterestType.TECHNOLOGY_AND_INNOVATION,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000008',
    tierLevel: 2,
    subscribed: true,
    maritalStatus: MaritalStatusType.DIVORCED,
    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
    interests: [InterestType.REAL_ESTATE],
  },
  {
    id: '00000000-0000-0000-0000-000000000009',
    tierLevel: 3,
    subscribed: true,
    maritalStatus: MaritalStatusType.SINGLE,
    state: StatusType.INACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.LETTER],
    interests: [
      InterestType.INVESTMENTS,
      InterestType.TECHNOLOGY_AND_INNOVATION,
    ],
  },
  // ---------------------------------------------------------------------------
  // SEEDED USERS (CONTINUED 10 – 28)
  // ---------------------------------------------------------------------------
  {
    id: '00000000-0000-0000-0000-000000000010',
    tierLevel: 3,
    subscribed: true,
    maritalStatus: MaritalStatusType.DIVORCED,
    state: StatusType.ACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.PHONE,
      ContactOptionsType.LETTER,
      ContactOptionsType.SMS,
    ],
    interests: [
      InterestType.INVESTMENTS,
      InterestType.SAVING_AND_FINANCE,
      InterestType.CREDIT_AND_DEBT,
      InterestType.INSURANCE,
      InterestType.TECHNOLOGY_AND_INNOVATION,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000011',
    tierLevel: 2,
    subscribed: true,
    maritalStatus: MaritalStatusType.WIDOWED,
    state: StatusType.CLOSED,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.PHONE,
      ContactOptionsType.LETTER,
    ],
    interests: [
      InterestType.BANK_PRODUCTS_AND_SERVICES,
      InterestType.TECHNOLOGY_AND_INNOVATION,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000012',
    tierLevel: 2,
    subscribed: false,
    maritalStatus: MaritalStatusType.MARRIED,
    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.PHONE],
    interests: [InterestType.SAVING_AND_FINANCE],
  },
  {
    id: '00000000-0000-0000-0000-000000000013',
    tierLevel: 3,
    subscribed: false,
    maritalStatus: MaritalStatusType.SINGLE,
    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.LETTER],
    interests: [InterestType.REAL_ESTATE],
  },
  {
    id: '00000000-0000-0000-0000-000000000014',
    tierLevel: 3,
    subscribed: true,
    maritalStatus: MaritalStatusType.SINGLE,
    state: StatusType.ACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.PHONE,
      ContactOptionsType.LETTER,
      ContactOptionsType.SMS,
    ],
    interests: [
      InterestType.TECHNOLOGY_AND_INNOVATION,
      InterestType.INVESTMENTS,
      InterestType.SAVING_AND_FINANCE,
      InterestType.REAL_ESTATE,
      InterestType.CREDIT_AND_DEBT,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000015',
    tierLevel: 1,
    subscribed: false,
    maritalStatus: MaritalStatusType.WIDOWED,
    state: StatusType.BLOCKED,
    contactOptions: [ContactOptionsType.PHONE],
    interests: [],
  },
  {
    id: '00000000-0000-0000-0000-000000000016',
    tierLevel: 1,
    subscribed: true,
    maritalStatus: MaritalStatusType.MARRIED,
    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
    interests: [InterestType.TECHNOLOGY_AND_INNOVATION],
  },
  {
    id: '00000000-0000-0000-0000-000000000017',
    tierLevel: 3,
    subscribed: true,
    maritalStatus: MaritalStatusType.MARRIED,
    state: StatusType.ACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.LETTER,
      ContactOptionsType.SMS,
    ],
    interests: [
      InterestType.TECHNOLOGY_AND_INNOVATION,
      InterestType.INVESTMENTS,
      InterestType.REAL_ESTATE,
      InterestType.CREDIT_AND_DEBT,
      InterestType.INSURANCE,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000018',
    tierLevel: 2,
    subscribed: true,
    maritalStatus: MaritalStatusType.MARRIED,
    state: StatusType.INACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
    interests: [
      InterestType.SUSTAINABLE_FINANCE,
      InterestType.BANK_PRODUCTS_AND_SERVICES,
    ],
  },
  // ---------------------------------------------------------------------------
  // SEEDED USERS (CONTINUED 19 – 27)
  // ---------------------------------------------------------------------------
  {
    id: '00000000-0000-0000-0000-000000000019',
    tierLevel: 1,
    subscribed: true,
    maritalStatus: MaritalStatusType.MARRIED,
    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
    interests: [
      InterestType.TECHNOLOGY_AND_INNOVATION,
      InterestType.REAL_ESTATE,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000020',
    tierLevel: 1,
    subscribed: true,
    maritalStatus: MaritalStatusType.MARRIED,
    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
    interests: [InterestType.TRAVEL, InterestType.TECHNOLOGY_AND_INNOVATION],
  },
  {
    id: '00000000-0000-0000-0000-000000000021',
    tierLevel: 2,
    subscribed: true,
    maritalStatus: MaritalStatusType.MARRIED,
    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
    interests: [InterestType.TRAVEL, InterestType.TECHNOLOGY_AND_INNOVATION],
  },
  {
    id: '00000000-0000-0000-0000-000000000022',
    tierLevel: 2,
    subscribed: true,
    maritalStatus: MaritalStatusType.MARRIED,
    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
    interests: [InterestType.TRAVEL, InterestType.TECHNOLOGY_AND_INNOVATION],
  },
  {
    id: '00000000-0000-0000-0000-000000000023',
    tierLevel: 3,
    subscribed: true,
    maritalStatus: MaritalStatusType.MARRIED,
    state: StatusType.ACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.LETTER,
      ContactOptionsType.SMS,
    ],
    interests: [
      InterestType.TECHNOLOGY_AND_INNOVATION,
      InterestType.INVESTMENTS,
      InterestType.REAL_ESTATE,
      InterestType.CREDIT_AND_DEBT,
      InterestType.INSURANCE,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000024',
    tierLevel: 2,
    subscribed: true,
    maritalStatus: MaritalStatusType.MARRIED,
    state: StatusType.INACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
    interests: [
      InterestType.SUSTAINABLE_FINANCE,
      InterestType.BANK_PRODUCTS_AND_SERVICES,
    ],
  },
  // {
  //   id: '00000000-0000-0000-0000-000000000025',
  //   tierLevel: 1,
  //   subscribed: true,
  //   maritalStatus: MaritalStatusType.MARRIED,
  //   state: StatusType.ACTIVE,
  //   contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
  //   interests: [
  //     InterestType.TECHNOLOGY_AND_INNOVATION,
  //     InterestType.REAL_ESTATE,
  //   ],
  // },
  // {
  //   id: '00000000-0000-0000-0000-000000000026',
  //   tierLevel: 2,
  //   subscribed: true,
  //   maritalStatus: MaritalStatusType.SINGLE,
  //   state: StatusType.ACTIVE,
  //   contactOptions: [ContactOptionsType.EMAIL],
  //   interests: [
  //     InterestType.INVESTMENTS,
  //     InterestType.SAVING_AND_FINANCE,
  //     InterestType.CREDIT_AND_DEBT,
  //     InterestType.BANK_PRODUCTS_AND_SERVICES,
  //     InterestType.FINANCIAL_EDUCATION_AND_COUNSELING,
  //     InterestType.REAL_ESTATE,
  //     InterestType.INSURANCE,
  //     InterestType.SUSTAINABLE_FINANCE,
  //     InterestType.TECHNOLOGY_AND_INNOVATION,
  //     InterestType.TRAVEL,
  //   ],
  // },
  // {
  //   id: '00000000-0000-0000-0000-000000000027',
  //   tierLevel: 3,
  //   subscribed: true,
  //   maritalStatus: MaritalStatusType.SINGLE,
  //   state: StatusType.ACTIVE,
  //   contactOptions: [
  //     ContactOptionsType.EMAIL,
  //     ContactOptionsType.PHONE,
  //     ContactOptionsType.LETTER,
  //     ContactOptionsType.SMS,
  //   ],
  //   interests: [InterestType.TECHNOLOGY_AND_INNOVATION],
  // },
] as const;
