import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
async function main() {
    const users = [
        {
            id: '23b51749-e8d1-4222-8f3f-d4097c3e55ec',
            username: 'admin',
            firstName: 'Admin',
            lastName: 'Omnixys',
            email: 'admin@omnixys.com',
        },
        {
            id: 'b4d4c3f7-f7cd-4304-ad74-d8ea70fdea1b',
            username: 'caleb',
            firstName: 'Caleb',
            lastName: 'Gyamfi',
            email: 'caleb.gyamfi@omnixys.com',
        },
        {
            id: 'ad923615-15c6-46f8-bdc0-71f9880b6a09',
            username: 'rachel',
            firstName: 'Rachel',
            lastName: 'Dwomoh',
            email: 'rachel.dwomoh@omnixys.com',
        },
        {
            id: '3a709c62-9148-4029-8180-943fcb1ded39',
            username: 'guest',
            firstName: 'Guest',
            lastName: 'Omnixys',
            email: 'guest@omnixys.com',
        },
        {
            id: 'a3b50666-e26c-44b4-934f-be61bbacac0d',
            username: 'security',
            firstName: 'Security',
            lastName: 'Omnixys',
            email: 'security@omnixys.com',
        },
        {
            id: 'ebab68d5-1e88-48d0-b7b3-de76e159e75f',
            username: 'audrey',
            firstName: 'Audrey',
            lastName: 'Omnixys',
            email: 'audrey@omnixys.com',
        },
        {
            id: '18824eb8-b909-4de7-8637-eaa73be69b17',
            username: 'christabel',
            firstName: 'Christabel',
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
//# sourceMappingURL=seed.js.map