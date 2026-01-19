/* eslint-disable no-console */
import { PrismaClient } from '../src/prisma/generated/client.js';
import { withAccelerate } from '@prisma/extension-accelerate';
import 'dotenv/config';

import { ADDRESSES } from '../.extras/data/address.data.js';
import { CUSTOMERS } from '../.extras/data/customer.data.js';
import { EMPLOYEES } from '../.extras/data/employee.data.js';
import { PERSONAL_INFOS } from '../.extras/data/personal-info.data.js';
import { PHONE_NUMBERS } from '../.extras/data/phone-number.data.js';
import { seedSecurityQuestionsForAllUsers } from '../.extras/data/security-question.data.js';
import { USERS } from '../.extras/data/user.data.js';

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

async function main() {
  console.log('🌱 Starting database seed…');

  console.log('→ Seeding users');
  await prisma.user.createMany({
    data: USERS,
    skipDuplicates: true,
  });

  console.log('→ Seeding personal infos');
  await prisma.personalInfo.createMany({
    data: PERSONAL_INFOS,
    skipDuplicates: true,
  });

  console.log('→ Seeding addresses');
  await prisma.address.createMany({
    data: ADDRESSES,
    skipDuplicates: true,
  });

  console.log('→ Seeding phone numbers');
  await prisma.phoneNumber.createMany({
    data: PHONE_NUMBERS,
    skipDuplicates: true,
  });

  console.log('→ Seeding customers');
  await prisma.customer.createMany({
    data: CUSTOMERS,
    skipDuplicates: true,
  });

  console.log('→ Seeding employees');
  await prisma.employee.createMany({
    data: EMPLOYEES,
    skipDuplicates: true,
  });

  console.log('→ Seeding security questions (deterministic)');
  await seedSecurityQuestionsForAllUsers(prisma);

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
