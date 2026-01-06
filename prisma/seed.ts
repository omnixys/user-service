    import { PrismaClient } from '../src/prisma/generated/client.js';
    import { PrismaPg } from '@prisma/adapter-pg';
    import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = [
    {
      id: 'dde8114c-2637-462a-90b9-413924fa3f55',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'Omnixys',
      email: 'admin@omnixys.com',
    },
    {
      id: '694d2e8e-0932-4c8f-a1c4-e300dc235be4',
      username: 'caleb',
      firstName: 'Caleb',
      lastName: 'Gyamfi',
      email: 'caleb.gyamfi@omnixys.com',
    },
    {
      id: 'f9de3f8a-5b79-4f3a-9267-10c1b9ce2a03',
      username: 'rachel',
      firstName: 'Rachel',
      lastName: 'Dwomoh',
      email: 'rachel.dwomoh@omnixys.com',
    },
    {
      id: 'ae489d9b-96ce-4942-bcb1-c2e2a0c92e83',
      username: 'guest',
      firstName: 'Guest',
      lastName: 'Omnixys',
      email: 'guest@omnixys.com',
    },
    {
      id: '20e7e44e-9bcd-4016-bebd-36f8d75357b6',
      username: 'security',
      firstName: 'Security',
      lastName: 'Omnixys',
      email: 'security@omnixys.com',
    },
    {
      id: '9e219f6f-7706-4294-8b5b-a4105999846f',
      username: 'audrey',
      firstName: 'Audrey',
      lastName: 'Omnixys',
      email: 'audrey@omnixys.com',
    },
    {
      id: '18bbde19-7e76-45dc-b204-f5c397e11362',
      username: 'christabelle',
      firstName: 'Christabelle',
      lastName: 'Omnixys',
      email: 'christabel@omnixys.com',
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {
        username: u.username,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
      },
      create: {
        id: u.id,
        username: u.username,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phoneNumbers: {
          create: [],
        },
        ticketIds: [],
        invitationIds: [],
      },
    });
  }

  console.log('✔ Users seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
