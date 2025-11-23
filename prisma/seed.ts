import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      id: '9e16a579-d4c0-4cd3-9fc0-50e82be0adb0',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'Omnixys',
      email: 'admin@omnixys.com',
    },
    {
      id: '70dcd75b-a9c4-4314-b438-3b7fd8f3d204',
      username: 'guest',
      firstName: 'Guest',
      lastName: 'Omnixys',
      email: 'guest@omnixys.com',
    },
    {
      id: '28201cc8-ebfe-4b68-9f47-ba8e669fee2e',
      username: 'security',
      firstName: 'Security',
      lastName: 'Omnixys',
      email: 'security@omnixys.com',
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
