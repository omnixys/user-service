import { RelationshipType } from '../../src/prisma/generated/client';

/**
 * CONTACT SEED DATA
 * ------------------------------------------------------------
 * Derived from legacy MongoDB contacts
 * Only contacts referencing existing users are seeded
 * ------------------------------------------------------------
 */

export const CONTACTS = [
  // ---------------------------------------------------------------------------
  // ADMIN → RACHEL
  // ---------------------------------------------------------------------------
  {
    id: '50000000-0000-0000-0000-000000000000',
    userId: '00000000-0000-0000-0000-000000000000', // admin
    contactId: '00000000-0000-0000-0000-000000000002', // rachel
    relationship: RelationshipType.PARTNER,
    withdrawalLimit: 1000,
    emergency: true,
    startDate: new Date('2020-01-01'),
    endDate: null,
  },

  // ---------------------------------------------------------------------------
  // CALEB ↔ RACHEL
  // ---------------------------------------------------------------------------
  {
    id: '50000000-0000-0000-0000-000000000001',
    userId: '00000000-0000-0000-0000-000000000001', // caleb
    contactId: '00000000-0000-0000-0000-000000000002', // rachel
    relationship: RelationshipType.PARTNER,
    withdrawalLimit: 1000,
    emergency: true,
    startDate: new Date('2020-01-01'),
    endDate: null,
  },
  {
    id: '50000000-0000-0000-0000-000000000002',
    userId: '00000000-0000-0000-0000-000000000002', // rachel
    contactId: '00000000-0000-0000-0000-000000000001', // caleb
    relationship: RelationshipType.PARTNER,
    withdrawalLimit: 1000,
    emergency: true,
    startDate: new Date('2020-01-01'),
    endDate: null,
  },

  // ---------------------------------------------------------------------------
  // CALEB → AUDREY
  // ---------------------------------------------------------------------------
  {
    id: '50000000-0000-0000-0000-000000000003',
    userId: '00000000-0000-0000-0000-000000000001', // caleb
    contactId: '00000000-0000-0000-0000-000000000004', // audrey
    relationship: RelationshipType.FRIEND,
    withdrawalLimit: 0,
    emergency: false,
    startDate: null,
    endDate: null,
  },

  // ---------------------------------------------------------------------------
  // CALEB → CHRISTABELLE
  // ---------------------------------------------------------------------------
  {
    id: '50000000-0000-0000-0000-000000000004',
    userId: '00000000-0000-0000-0000-000000000001', // caleb
    contactId: '00000000-0000-0000-0000-000000000005', // christabelle
    relationship: RelationshipType.FRIEND,
    withdrawalLimit: 0,
    emergency: false,
    startDate: null,
    endDate: null,
  },

  // ---------------------------------------------------------------------------
  // SECURITY → ADMIN (COLLEAGUE)
  // ---------------------------------------------------------------------------
  {
    id: '50000000-0000-0000-0000-000000000005',
    userId: '00000000-0000-0000-0000-000000000003', // security
    contactId: '00000000-0000-0000-0000-000000000000', // admin
    relationship: RelationshipType.COLLEAGUE,
    withdrawalLimit: 1000,
    emergency: true,
    startDate: null,
    endDate: null,
  },

  // ---------------------------------------------------------------------------
  // ADMIN → SECURITY
  // ---------------------------------------------------------------------------
  {
    id: '50000000-0000-0000-0000-000000000006',
    userId: '00000000-0000-0000-0000-000000000000', // admin
    contactId: '00000000-0000-0000-0000-000000000003', // security
    relationship: RelationshipType.COLLEAGUE,
    withdrawalLimit: 1000,
    emergency: true,
    startDate: null,
    endDate: null,
  },
  {
    id: '50000000-0000-0000-0000-000000000007',
    userId: '00000000-0000-0000-0000-000000000000',
    contactId: '00000000-0000-0000-0000-000000000010', // jane.doe
    relationship: RelationshipType.COLLEAGUE,
    withdrawalLimit: 1000,
    emergency: false,
    startDate: new Date('2020-01-01'),
    endDate: null,
  },

  // ===========================================================================
  // JULIA MEYER (000…001)
  // ===========================================================================
  {
    id: '50000000-0000-0000-0000-000000000008',
    userId: '00000000-0000-0000-0000-000000000001',
    contactId: '00000000-0000-0000-0000-000000000002', // anna.schmidt
    relationship: RelationshipType.SIBLING,
    withdrawalLimit: null,
    emergency: false,
    startDate: null,
    endDate: null,
  },

  // ===========================================================================
  // ANNA SCHMIDT (000…002)
  // ===========================================================================
  {
    id: '50000000-0000-0000-0000-000000000009',
    userId: '00000000-0000-0000-0000-000000000002',
    contactId: '00000000-0000-0000-0000-000000000003', // erik.schmidt
    relationship: RelationshipType.PARTNER,
    withdrawalLimit: 1000,
    emergency: false,
    startDate: new Date('2020-01-01'),
    endDate: null,
  },

  // ===========================================================================
  // ERIK SCHMIDT (000…003)
  // ===========================================================================
  {
    id: '50000000-0000-0000-0000-000000000010',
    userId: '00000000-0000-0000-0000-000000000003',
    contactId: '00000000-0000-0000-0000-000000000002',
    relationship: RelationshipType.PARTNER,
    withdrawalLimit: 1000,
    emergency: false,
    startDate: new Date('2020-01-01'),
    endDate: null,
  },

  // ===========================================================================
  // JOHN / EMANUEL MÜLLER (000…006)
  // ===========================================================================
  {
    id: '50000000-0000-0000-0000-000000000011',
    userId: '00000000-0000-0000-0000-000000000006',
    contactId: '00000000-0000-0000-0000-000000000007', // linh.nguyen
    relationship: RelationshipType.COLLEAGUE,
    withdrawalLimit: null,
    emergency: false,
    startDate: null,
    endDate: null,
  },

  // ===========================================================================
  // LINH NGUYEN (000…007)
  // ===========================================================================
  {
    id: '50000000-0000-0000-0000-000000000012',
    userId: '00000000-0000-0000-0000-000000000007',
    contactId: '00000000-0000-0000-0000-000000000006', // john.muller
    relationship: RelationshipType.COLLEAGUE,
    withdrawalLimit: null,
    emergency: false,
    startDate: null,
    endDate: null,
  },

  // ===========================================================================
  // MIGUEL GARCIA (000…008)
  // ===========================================================================
  {
    id: '50000000-0000-0000-0000-000000000013',
    userId: '00000000-0000-0000-0000-000000000008',
    contactId: '00000000-0000-0000-0000-000000000014', // yaa.osei
    relationship: RelationshipType.BUSINESS_PARTNER,
    withdrawalLimit: 1000,
    emergency: false,
    startDate: new Date('2020-01-01'),
    endDate: null,
  },

  // ===========================================================================
  // DMITRY IVANOV (000…019)
  // ===========================================================================
  {
    id: '50000000-0000-0000-0000-000000000014',
    userId: '00000000-0000-0000-0000-000000000019',
    contactId: '00000000-0000-0000-0000-000000000020', // elena.ivanova
    relationship: RelationshipType.PARTNER,
    withdrawalLimit: 1000,
    emergency: false,
    startDate: new Date('2020-01-01'),
    endDate: null,
  },

  // ===========================================================================
  // JOHAN ANDERSSON (000…021)
  // ===========================================================================
  {
    id: '50000000-0000-0000-0000-000000000015',
    userId: '00000000-0000-0000-0000-000000000021',
    contactId: '00000000-0000-0000-0000-000000000022', // anna.andersson
    relationship: RelationshipType.PARTNER,
    withdrawalLimit: 1000,
    emergency: false,
    startDate: new Date('2020-01-01'),
    endDate: null,
  },
] as const;
