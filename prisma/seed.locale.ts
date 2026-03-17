/**
 * prisma/seed.locale.ts
 */

import {
  InterestCategoryKey,
  PrismaClient,
} from '../src/prisma/generated/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

import { ADDRESSES } from '../.extras/data/address.data.js';
import { CONTACTS } from '../.extras/data/contact.data.js';
import { CUSTOMERS } from '../.extras/data/customer.data.js';
import { EMPLOYEES } from '../.extras/data/employee.data.js';
import {
  CATEGORY_ICONS,
  CATEGORY_MAP,
  CUSTOMER_INTERESTS,
  INTEREST_ICONS,
  LABELS,
} from '../.extras/data/interests.data.js';
import { PERSONAL_INFOS } from '../.extras/data/personal-info.data.js';
import { PHONE_NUMBERS } from '../.extras/data/phone-number.data.js';
import { seedSecurityQuestionsForAllUsers } from '../.extras/data/security-question.data.js';
import { USERS } from '../.extras/data/user.data.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting locale database seed…');

  /* -------------------------------------------------------------------------- */
  /* USERS                                                                      */
  /* -------------------------------------------------------------------------- */

  console.log('→ Seeding users');

  await prisma.user.createMany({
    data: [...USERS],
    skipDuplicates: true,
  });

  /* -------------------------------------------------------------------------- */
  /* PERSONAL INFOS                                                             */
  /* -------------------------------------------------------------------------- */

  console.log('→ Seeding personal infos');

  await prisma.personalInfo.createMany({
    data: [...PERSONAL_INFOS],
    skipDuplicates: true,
  });

  /* -------------------------------------------------------------------------- */
  /* PHONE NUMBERS                                                              */
  /* -------------------------------------------------------------------------- */

  console.log('→ Seeding phone numbers');

  await prisma.phoneNumber.createMany({
    data: [...PHONE_NUMBERS],
    skipDuplicates: true,
  });

  /* -------------------------------------------------------------------------- */
  /* CUSTOMERS                                                                  */
  /* -------------------------------------------------------------------------- */

  console.log('→ Seeding customers');

  await prisma.customer.createMany({
    data: CUSTOMERS.filter(Boolean),
    skipDuplicates: true,
  });

  /* -------------------------------------------------------------------------- */
  /* EMPLOYEES                                                                  */
  /* -------------------------------------------------------------------------- */

  console.log('→ Seeding employees');

  await prisma.employee.createMany({
    data: [...EMPLOYEES],
    skipDuplicates: true,
  });

  /* -------------------------------------------------------------------------- */
  /* CONTACTS                                                                   */
  /* -------------------------------------------------------------------------- */

  console.log('→ Seeding contacts');

  await prisma.contact.createMany({
    data: CONTACTS.filter((c) => c?.userId && c?.contactId),
    skipDuplicates: true,
  });

  /* -------------------------------------------------------------------------- */
  /* INTEREST CATEGORIES                                                        */
  /* -------------------------------------------------------------------------- */

  console.log('→ Seeding interest categories');

  const categoryIdByKey = new Map<string, string>();

  for (const categoryKey of Object.values(InterestCategoryKey)) {
    const category = await prisma.interestCategory.upsert({
      where: { key: categoryKey },
      update: {
        icon: CATEGORY_ICONS[categoryKey] ?? null,
      },
      create: {
        key: categoryKey,
        name: categoryKey.replace(/_/g, ' '),
        icon: CATEGORY_ICONS[categoryKey] ?? null,
      },
    });

    categoryIdByKey.set(categoryKey, category.id);
  }

  /* -------------------------------------------------------------------------- */
  /* INTERESTS                                                                  */
  /* -------------------------------------------------------------------------- */

  console.log('→ Seeding interests');

  const interestIdByKey = new Map<string, string>();

  for (const [categoryKey, interestKeys] of Object.entries(CATEGORY_MAP)) {
    const categoryId = categoryIdByKey.get(categoryKey)!;

    for (const key of interestKeys) {
      const interest = await prisma.interest.upsert({
        where: { key },
        update: {
          name: LABELS[key],
          categoryId,
          icon: INTEREST_ICONS[key] ?? null,
        },
        create: {
          key,
          name: LABELS[key] ?? key,
          categoryId,
          icon: INTEREST_ICONS[key] ?? null,
        },
      });

      interestIdByKey.set(key, interest.id);
    }
  }

  /* -------------------------------------------------------------------------- */
  /* CUSTOMER INTEREST LINKS                                                    */
  /* -------------------------------------------------------------------------- */

  console.log('→ Seeding customer interest links');

  const links: { customerId: string; interestId: string }[] = [];

  for (const row of CUSTOMER_INTERESTS) {
    if (!row.interests.length) continue;

    const uniqueKeys = Array.from(new Set(row.interests));

    for (const key of uniqueKeys) {
      const interestId = interestIdByKey.get(key);

      if (!interestId) continue;

      links.push({
        customerId: row.customerId,
        interestId,
      });
    }
  }

  await prisma.customerInterest.createMany({
    data: links,
    skipDuplicates: true,
  });

  console.log('✅ Database seed completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
