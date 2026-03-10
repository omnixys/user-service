/**
 * prisma/seed/data/interest.data.ts
 *
 * Maps customerId (== userId) to interest keys.
 * Keep this file independent from Customer seed data.
 */

import { InterestKey } from '../../src/prisma/generated/client';

export const CATEGORY_MAP: Record<string, ReadonlyArray<InterestKey>> = {
  FINANCE: [
    'INVESTMENTS',
    'SAVING_AND_FINANCE',
    'CREDIT_AND_DEBT',
    'BANK_PRODUCTS_AND_SERVICES',
    'FINANCIAL_EDUCATION_AND_COUNSELING',
    'INSURANCE',
    'SUSTAINABLE_FINANCE',
  ],

  REAL_ASSETS: ['REAL_ESTATE'],

  TECHNOLOGY: ['TECHNOLOGY_AND_INNOVATION'],

  LIFESTYLE: ['TRAVEL'],

  MUSIC: ['CLASSIC', 'ROCK', 'HIPHOP', 'RAP'],

  SPORTS: ['FOOTBALL', 'SOCCER', 'RUGBY', 'BASKETBALL'],
};

export const LABELS: Record<InterestKey, string> = {
  BANK_PRODUCTS_AND_SERVICES: 'Bank Products & Services',
  TECHNOLOGY_AND_INNOVATION: 'Technology & Innovation',
  FINANCIAL_EDUCATION_AND_COUNSELING: 'Financial Education & Counseling',
  SUSTAINABLE_FINANCE: 'Sustainable Finance',
  INVESTMENTS: 'Investments',
  SAVING_AND_FINANCE: 'Saving & Finance',
  CREDIT_AND_DEBT: 'Credit & Debt',
  REAL_ESTATE: 'Real Estate',
  INSURANCE: 'Insurance',
  TRAVEL: 'Travel',

  CLASSIC: 'Classical Music',
  ROCK: 'Rock',
  HIPHOP: 'Hip Hop',
  RAP: 'Rap',

  FOOTBALL: 'Football',
  SOCCER: 'Soccer',
  RUGBY: 'Rugby',
  BASKETBALL: 'Basketball',
};

export const CATEGORY_ICONS: Record<string, string> = {
  FINANCE: 'wallet',
  REAL_ASSETS: 'building',
  TECHNOLOGY: 'cpu',
  LIFESTYLE: 'sparkles',
  MUSIC: 'music',
  SPORTS: 'trophy',
};

export const INTEREST_ICONS: Record<InterestKey, string> = {
  BANK_PRODUCTS_AND_SERVICES: 'landmark',
  TECHNOLOGY_AND_INNOVATION: 'chip',
  FINANCIAL_EDUCATION_AND_COUNSELING: 'graduation-cap',
  SUSTAINABLE_FINANCE: 'leaf',
  INVESTMENTS: 'trending-up',
  SAVING_AND_FINANCE: 'piggy-bank',
  CREDIT_AND_DEBT: 'credit-card',
  REAL_ESTATE: 'home',
  INSURANCE: 'shield',
  TRAVEL: 'plane',

  CLASSIC: 'music-2',
  ROCK: 'guitar',
  HIPHOP: 'mic',
  RAP: 'radio',

  FOOTBALL: 'shield-check',
  SOCCER: 'circle',
  RUGBY: 'target',
  BASKETBALL: 'dribbble',
};

export const CUSTOMER_INTERESTS: ReadonlyArray<{
  customerId: string;
  interests: ReadonlyArray<InterestKey>;
}> = [
  {
    customerId: '694d2e8e-0932-4c8f-a1c4-e300dc235be4', // caleb
    interests: [
      'BANK_PRODUCTS_AND_SERVICES',
      'TECHNOLOGY_AND_INNOVATION',
      'FINANCIAL_EDUCATION_AND_COUNSELING',
      'SUSTAINABLE_FINANCE',
      'INVESTMENTS',
      'SAVING_AND_FINANCE',
      'CREDIT_AND_DEBT',
      'REAL_ESTATE',
      'INSURANCE',
      'SUSTAINABLE_FINANCE', // duplicate in source; will be de-duped in seed
      'TRAVEL',
    ],
  },
  {
    customerId: 'f9de3f8a-5b79-4f3a-9267-10c1b9ce2a03', // rachel
    interests: [],
  },
  {
    customerId: '9e219f6f-7706-4294-8b5b-a4105999846f', // audrey
    interests: ['TECHNOLOGY_AND_INNOVATION'],
  },
  {
    customerId: '18bbde19-7e76-45dc-b204-f5c397e11362', // christabelle
    interests: [],
  },

  // SEEDED USERS (00000000-…)
  {
    customerId: '00000000-0000-0000-0000-000000000000',
    interests: ['BANK_PRODUCTS_AND_SERVICES', 'TECHNOLOGY_AND_INNOVATION'],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000001',
    interests: ['TECHNOLOGY_AND_INNOVATION'],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000002',
    interests: ['TECHNOLOGY_AND_INNOVATION', 'TRAVEL'],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000003',
    interests: [
      'BANK_PRODUCTS_AND_SERVICES',
      'FINANCIAL_EDUCATION_AND_COUNSELING',
      'SUSTAINABLE_FINANCE',
    ],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000004',
    interests: ['REAL_ESTATE', 'INVESTMENTS', 'CREDIT_AND_DEBT'],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000005',
    interests: [],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000006',
    interests: [],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000007',
    interests: ['SUSTAINABLE_FINANCE', 'TECHNOLOGY_AND_INNOVATION'],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000008',
    interests: ['REAL_ESTATE'],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000009',
    interests: ['INVESTMENTS', 'TECHNOLOGY_AND_INNOVATION'],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000010',
    interests: [
      'INVESTMENTS',
      'SAVING_AND_FINANCE',
      'CREDIT_AND_DEBT',
      'INSURANCE',
      'TECHNOLOGY_AND_INNOVATION',
    ],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000011',
    interests: ['BANK_PRODUCTS_AND_SERVICES', 'TECHNOLOGY_AND_INNOVATION'],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000012',
    interests: ['SAVING_AND_FINANCE'],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000013',
    interests: ['REAL_ESTATE'],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000014',
    interests: [
      'TECHNOLOGY_AND_INNOVATION',
      'INVESTMENTS',
      'SAVING_AND_FINANCE',
      'REAL_ESTATE',
      'CREDIT_AND_DEBT',
    ],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000015',
    interests: [],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000016',
    interests: ['TECHNOLOGY_AND_INNOVATION'],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000017',
    interests: [
      'TECHNOLOGY_AND_INNOVATION',
      'INVESTMENTS',
      'REAL_ESTATE',
      'CREDIT_AND_DEBT',
      'INSURANCE',
    ],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000018',
    interests: ['SUSTAINABLE_FINANCE', 'BANK_PRODUCTS_AND_SERVICES'],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000019',
    interests: ['TECHNOLOGY_AND_INNOVATION', 'REAL_ESTATE'],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000020',
    interests: ['TRAVEL', 'TECHNOLOGY_AND_INNOVATION'],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000021',
    interests: ['TRAVEL', 'TECHNOLOGY_AND_INNOVATION'],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000022',
    interests: ['TRAVEL', 'TECHNOLOGY_AND_INNOVATION'],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000023',
    interests: [
      'TECHNOLOGY_AND_INNOVATION',
      'INVESTMENTS',
      'REAL_ESTATE',
      'CREDIT_AND_DEBT',
      'INSURANCE',
    ],
  },
  {
    customerId: '00000000-0000-0000-0000-000000000024',
    interests: ['SUSTAINABLE_FINANCE', 'BANK_PRODUCTS_AND_SERVICES'],
  },
] as const;
