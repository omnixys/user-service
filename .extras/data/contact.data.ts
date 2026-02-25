import { RelationshipType } from '../../src/prisma/generated/client';

/* -------------------------------------------------------------------------- */
/* CORE USER IDS                                                               */
/* -------------------------------------------------------------------------- */

const ADMIN = 'dde8114c-2637-462a-90b9-413924fa3f55';
const CALEB = '694d2e8e-0932-4c8f-a1c4-e300dc235be4';
const RACHEL = 'f9de3f8a-5b79-4f3a-9267-10c1b9ce2a03';
const SECURITY = '20e7e44e-9bcd-4016-bebd-36f8d75357b6';
const AUDREY = '9e219f6f-7706-4294-8b5b-a4105999846f';
const CHRISTABELLE = '18bbde19-7e76-45dc-b204-f5c397e11362';

/* -------------------------------------------------------------------------- */
/* SEEDED USER IDS (SEQUENTIAL)                                                */
/* -------------------------------------------------------------------------- */

const USERS = [
  '00000000-0000-0000-0000-000000000000', // mark.williams2
  '00000000-0000-0000-0000-000000000001', // julia
  '00000000-0000-0000-0000-000000000002', // anna.schmidt
  '00000000-0000-0000-0000-000000000003', // erik
  '00000000-0000-0000-0000-000000000004', // laura.brown
  '00000000-0000-0000-0000-000000000005', // shamaar
  '00000000-0000-0000-0000-000000000006', // john.muller
  '00000000-0000-0000-0000-000000000007', // linh.nguyen
  '00000000-0000-0000-0000-000000000008', // miguel.garcia
  '00000000-0000-0000-0000-000000000009', // soojin.lee
  '00000000-0000-0000-0000-000000000010', // jane.doe
  '00000000-0000-0000-0000-000000000011', // mark.williams
  '00000000-0000-0000-0000-000000000012', // luca.rossi
  '00000000-0000-0000-0000-000000000013', // kwame.owusu
  '00000000-0000-0000-0000-000000000014', // yaa.osei
  '00000000-0000-0000-0000-000000000015', // lisa.peterson
  '00000000-0000-0000-0000-000000000016', // hiroshi.tanaka
  '00000000-0000-0000-0000-000000000017', // emily.smith
  '00000000-0000-0000-0000-000000000018', // david.jones
  '00000000-0000-0000-0000-000000000019', // dmitry.ivanov
  '00000000-0000-0000-0000-000000000020', // elena.ivanova
  '00000000-0000-0000-0000-000000000021', // johan.andersson
  '00000000-0000-0000-0000-000000000022', // anna.andersson
];

/* -------------------------------------------------------------------------- */
/* CONTACTS                                                                   */
/* -------------------------------------------------------------------------- */

export const CONTACTS = [
  /* ------------------------------------------------------------------------ */
  /* CALEB – EXACTLY 5 CONTACTS (REQUIRED)                                     */
  /* ------------------------------------------------------------------------ */
  {
    id: 'contact-caleb-01',
    userId: CALEB,
    contactId: RACHEL,
    relationship: RelationshipType.PARTNER,
    withdrawalLimit: 5000,
    emergency: true,
    startDate: new Date('2022-06-01'),
  },
  {
    id: 'contact-caleb-02',
    userId: CALEB,
    contactId: AUDREY,
    relationship: RelationshipType.FRIEND,
    withdrawalLimit: 1500,
    emergency: false,
  },
  {
    id: 'contact-caleb-03',
    userId: CALEB,
    contactId: CHRISTABELLE,
    relationship: RelationshipType.COLLEAGUE,
    withdrawalLimit: 1000,
    emergency: false,
  },
  {
    id: 'contact-caleb-04',
    userId: CALEB,
    contactId: USERS[13], // kwame
    relationship: RelationshipType.RELATIVE,
    withdrawalLimit: 2000,
    emergency: true,
  },
  {
    id: 'contact-caleb-05',
    userId: CALEB,
    contactId: USERS[14], // yaa
    relationship: RelationshipType.COUSIN,
    withdrawalLimit: 1200,
    emergency: false,
  },

  /* ------------------------------------------------------------------------ */
  /* CORE STAFF RELATIONSHIPS                                                  */
  /* ------------------------------------------------------------------------ */
  {
    id: 'contact-admin-security',
    userId: ADMIN,
    contactId: SECURITY,
    relationship: RelationshipType.COLLEAGUE,
    withdrawalLimit: 1000,
    emergency: true,
  },
  {
    id: 'contact-security-admin',
    userId: SECURITY,
    contactId: ADMIN,
    relationship: RelationshipType.COLLEAGUE,
    withdrawalLimit: 1000,
    emergency: true,
  },

  /* ------------------------------------------------------------------------ */
  /* GENERAL USER NETWORK (DETERMINISTIC, SAFE)                                */
  /* ------------------------------------------------------------------------ */

  ...USERS.slice(0, 15).map((userId, index) => {
    const contactId = USERS[index + 1];
    if (!contactId) return null;

    return {
      id: `contact-auto-${index}`,
      userId,
      contactId,
      relationship:
        index % 4 === 0
          ? RelationshipType.FAMILY
          : index % 4 === 1
            ? RelationshipType.FRIEND
            : index % 4 === 2
              ? RelationshipType.COLLEAGUE
              : RelationshipType.BUSINESS_PARTNER,
      withdrawalLimit: (index % 5) * 500,
      emergency: index % 7 === 0,
    };
  }),
].filter(Boolean);
