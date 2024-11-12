import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { before, after } from 'mocha';
import { GraphQLServer } from '@graphql';
import { Server } from 'node:http';

let server: Server;
export const prisma = new PrismaClient();
const graphqlServer = new GraphQLServer();

before(async () => {
  console.log('Starting server...');
  server = await graphqlServer.run();
  await prisma.user.deleteMany();
});

after(async () => {
  console.log('Stopping server...');
  server.close(async () => {
    await prisma.$disconnect();
  });
});
