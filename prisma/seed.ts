import process from 'process';
import { PrismaClient } from '@prisma/client';
import { PasswordService } from '../src/services/password-service';

const prisma = new PrismaClient();

const randomPastDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 365 * 100));
  return date;
};

const randomUser = (position: number) => ({
  name: `fakeUser ${position}`,
  email: `fake${position}@fake.com`,
  password: PasswordService.hashPassword('samePassword123'),
  birthDate: randomPastDate(),
});

const seedDb = async () => {
  console.log('Seeding started');

  const users = Array.from({ length: 10 }, (_, i) => randomUser(i));

  await prisma.user.createMany({ data: users });
};

seedDb()
  .then(async () => {
    console.log('Seeding finished');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
