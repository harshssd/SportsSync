

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  const existingUser = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
  });

  if (!existingUser) {
    const passwordHash = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: passwordHash,
      },
    });
    console.log(`Created user with id: ${user.id}`);
  } else {
    console.log('Test user already exists.');
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    // FIX: Cast process to any to access exit method without @types/node.
    (process as any).exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });