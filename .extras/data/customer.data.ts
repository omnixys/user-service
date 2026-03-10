import {
  ContactOptionsType,
  InterestType,
  MaritalStatusType,
  Prisma,
  StatusType,
} from '../../src/prisma/generated/client';

type CustomerSeed = {
  id: string;
  subscribed: boolean;
  state: StatusType;
  contactOptions: ContactOptionsType[];
};
/**
 * CUSTOMER TABLE SEED DATA
 * ------------------------------------------------------------
 * 1:1 extension of User
 * Customer.id === User.id
 * Deterministic IDs starting at:
 * 30000000-0000-0000-0000-000000000000
 * ------------------------------------------------------------
 */
export const CUSTOMERS: CustomerSeed[] = [
  // ---------------------------------------------------------------------------
  // CORE USERS
  // ---------------------------------------------------------------------------
  {
    id: '694d2e8e-0932-4c8f-a1c4-e300dc235be4', // caleb
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.PHONE,
      ContactOptionsType.LETTER,
      ContactOptionsType.SMS,
    ],
  },

  {
    id: 'f9de3f8a-5b79-4f3a-9267-10c1b9ce2a03', // rachel
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.LETTER],
  },

  // ---------------------------------------------------------------------------
  // SPECIAL USERS
  // ---------------------------------------------------------------------------
  {
    id: '9e219f6f-7706-4294-8b5b-a4105999846f', // audrey
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL],
  },
  {
    id: '18bbde19-7e76-45dc-b204-f5c397e11362', // christabelle
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL],
  },

  // ---------------------------------------------------------------------------
  // SEEDED USERS (00000000-…)
  // ---------------------------------------------------------------------------
  {
    id: '00000000-0000-0000-0000-000000000000',
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.PHONE,
      ContactOptionsType.LETTER,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000001',
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    subscribed: false,

    state: StatusType.INACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.LETTER,
      ContactOptionsType.SMS,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.LETTER,
      ContactOptionsType.SMS,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    subscribed: true,

    state: StatusType.BLOCKED,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.PHONE,
      ContactOptionsType.LETTER,
      ContactOptionsType.SMS,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000006',
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.PHONE],
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.PHONE,
      ContactOptionsType.LETTER,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000008',

    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
  },
  {
    id: '00000000-0000-0000-0000-000000000009',
    subscribed: true,

    state: StatusType.INACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.LETTER],
  },
  // ---------------------------------------------------------------------------
  // SEEDED USERS (CONTINUED 10 – 28)
  // ---------------------------------------------------------------------------
  {
    id: '00000000-0000-0000-0000-000000000010',
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.PHONE,
      ContactOptionsType.LETTER,
      ContactOptionsType.SMS,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000011',

    subscribed: true,

    state: StatusType.CLOSED,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.PHONE,
      ContactOptionsType.LETTER,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000012',

    subscribed: false,

    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.PHONE],
  },
  {
    id: '00000000-0000-0000-0000-000000000013',
    subscribed: false,

    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.LETTER],
  },
  {
    id: '00000000-0000-0000-0000-000000000014',
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.PHONE,
      ContactOptionsType.LETTER,
      ContactOptionsType.SMS,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000015',
    subscribed: false,

    state: StatusType.BLOCKED,
    contactOptions: [ContactOptionsType.PHONE],
  },
  {
    id: '00000000-0000-0000-0000-000000000016',
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
  },
  {
    id: '00000000-0000-0000-0000-000000000017',
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.LETTER,
      ContactOptionsType.SMS,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000018',
    subscribed: true,

    state: StatusType.INACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
  },
  // ---------------------------------------------------------------------------
  // SEEDED USERS (CONTINUED 19 – 27)
  // ---------------------------------------------------------------------------
  {
    id: '00000000-0000-0000-0000-000000000019',
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
  },
  {
    id: '00000000-0000-0000-0000-000000000020',
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
  },
  {
    id: '00000000-0000-0000-0000-000000000021',
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
  },
  {
    id: '00000000-0000-0000-0000-000000000022',
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
  },
  {
    id: '00000000-0000-0000-0000-000000000023',
    subscribed: true,

    state: StatusType.ACTIVE,
    contactOptions: [
      ContactOptionsType.EMAIL,
      ContactOptionsType.LETTER,
      ContactOptionsType.SMS,
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000024',

    subscribed: true,

    state: StatusType.INACTIVE,
    contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
  },
  // {
  //   id: '00000000-0000-0000-0000-000000000025',
  //   subscribed: true,
  //
  //   state: StatusType.ACTIVE,
  //   contactOptions: [ContactOptionsType.EMAIL, ContactOptionsType.PHONE],
  // },
  // {
  //   id: '00000000-0000-0000-0000-000000000026',
  //   subscribed: true,
  //
  //   state: StatusType.ACTIVE,
  //   contactOptions: [ContactOptionsType.EMAIL],
  // },
  // {
  //   id: '00000000-0000-0000-0000-000000000027',
  //   subscribed: true,
  //
  //   state: StatusType.ACTIVE,
  //   contactOptions: [
  //     ContactOptionsType.EMAIL,
  //     ContactOptionsType.PHONE,
  //     ContactOptionsType.LETTER,
  //     ContactOptionsType.SMS,
  //   ],
  // },
];
