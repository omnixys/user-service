import { PrismaClient } from '../src/prisma/generated/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

import { ADDRESSES } from '../.extras/data/address.data.js';
import { CONTACTS } from '../.extras/data/contact.data.js';
import { CUSTOMERS } from '../.extras/data/customer.data.js';
import { EMPLOYEES } from '../.extras/data/employee.data.js';
import { PERSONAL_INFOS } from '../.extras/data/personal-info.data.js';
import { PHONE_NUMBERS } from '../.extras/data/phone-number.data.js';
import { seedSecurityQuestionsForAllUsers } from '../.extras/data/security-question.data.js';
import { USERS } from '../.extras/data/user.data.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$transaction(async (tx) => {
    console.log('🌱 Starting locale database seed…');

    /* -------------------------------------------------------------------------- */
    /* USERS                                                                      */
    /* -------------------------------------------------------------------------- */
    console.log('→ Seeding users');
    for (const user of USERS) {
      await tx.user.upsert({
        where: { id: user.id },
        update: user,
        create: user,
      });
    }

    /* -------------------------------------------------------------------------- */
    /* PERSONAL INFOS                                                             */
    /* -------------------------------------------------------------------------- */
    console.log('→ Seeding personal infos');
    for (const info of PERSONAL_INFOS) {
      await tx.personalInfo.upsert({
        where: { id: info.id },
        update: info,
        create: info,
      });
    }

    /* -------------------------------------------------------------------------- */
    /* ADDRESSES                                                                  */
    /* -------------------------------------------------------------------------- */
    console.log('→ Seeding addresses');
    for (const address of ADDRESSES) {
      await tx.address.upsert({
        where: { id: address.id },
        update: address,
        create: address,
      });
    }

    /* -------------------------------------------------------------------------- */
    /* PHONE NUMBERS                                                              */
    /* -------------------------------------------------------------------------- */
    console.log('→ Seeding phone numbers');
    for (const phone of PHONE_NUMBERS) {
      await tx.phoneNumber.upsert({
        where: { id: phone.id },
        update: phone,
        create: phone,
      });
    }

    /* -------------------------------------------------------------------------- */
    /* CUSTOMERS                                                                  */
    /* -------------------------------------------------------------------------- */
    console.log('→ Seeding customers');
    for (const customer of CUSTOMERS) {
      await tx.customer.upsert({
        where: { id: customer.id },
        update: customer,
        create: customer,
      });
    }

    /* -------------------------------------------------------------------------- */
    /* EMPLOYEES                                                                  */
    /* -------------------------------------------------------------------------- */
    console.log('→ Seeding employees');
    for (const employee of EMPLOYEES) {
      await tx.employee.upsert({
        where: { id: employee.id },
        update: employee,
        create: employee,
      });
    }

    /* -------------------------------------------------------------------------- */
    /* CONTACTS                                                                   */
    /* -------------------------------------------------------------------------- */
    console.log('→ Seeding contacts');
    for (const contact of CONTACTS) {
      await tx.contact.upsert({
        where: {
          userId_contactId: {
            userId: contact.userId,
            contactId: contact.contactId,
          },
        },
        update: contact,
        create: contact,
      });
    }

    console.log('✅ Database seed completed successfully');
  });

  /* -------------------------------------------------------------------------- */
  /* SECURITY QUESTIONS (deterministic, rotated)                                */
  /* -------------------------------------------------------------------------- */
  console.log('→ Seeding security questions (deterministic)');
  await seedSecurityQuestionsForAllUsers(prisma);
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
