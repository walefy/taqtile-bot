import { PrismaClient } from '@prisma/client';
import { main } from '../src/server';
import { before, after } from 'mocha';
import { ApolloServer } from 'apollo-server';

let server: ApolloServer;
export const prisma = new PrismaClient();

before(async () => {
  console.log('Starting server...');
  server = await main();
  await prisma.user.deleteMany();
});

after(async () => {
  console.log('Stopping server...');
  await server.stop();
  await prisma.$disconnect();
});
