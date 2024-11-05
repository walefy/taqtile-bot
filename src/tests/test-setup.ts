import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { before, after } from 'mocha';
import { ApolloServer } from 'apollo-server';
import { GraphQLServer } from '@graphql';

let server: ApolloServer;
export const prisma = new PrismaClient();
const graphqlServer = new GraphQLServer();

before(async () => {
  console.log('Starting server...');
  server = await graphqlServer.run();
  await prisma.user.deleteMany();
});

after(async () => {
  console.log('Stopping server...');
  await server.stop();
  await prisma.$disconnect();
});
