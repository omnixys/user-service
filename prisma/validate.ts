import { PrismaClient } from '../src/prisma/generated/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.count();
  const personalInfos = await prisma.personalInfo.count();
  const phoneNumbers = await prisma.phoneNumber.count();
  const customers = await prisma.customer.count();
  const employees = await prisma.employee.count();
  const contacts = await prisma.contact.count();

  const result = {
    service: 'user',
    checks: [
      { name: 'Users', ok: users > 0, count: users },
      { name: 'Personal Infos', ok: personalInfos > 0, count: personalInfos },
      { name: 'Phone Numbers', ok: phoneNumbers > 0, count: phoneNumbers },
      { name: 'Customers', ok: customers > 0, count: customers },
      { name: 'Employees', ok: employees > 0, count: employees },
      { name: 'Contacts', ok: contacts > 0, count: contacts },
    ],
  };

  console.log('VALIDATE_JSON:' + JSON.stringify(result));
}

main()
  .catch((e) => {
    console.error('❌ Validate failed', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
