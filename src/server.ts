import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { HelloWorldResolver } from './resolvers/hello-world-resolver';
import { UserResolver } from './resolvers/user-resolver';
import { apolloErrorHandling } from './exceptions/apollo-error-handling';
import Container from 'typedi';
import { PrismaClient } from '@prisma/client';

export async function main() {
  const prisma = new PrismaClient();
  Container.set(PrismaClient, prisma);

  const schema = await buildSchema({
    resolvers: [HelloWorldResolver, UserResolver],
    validate: true,
    container: Container,
  });

  const server = new ApolloServer({
    schema,
    formatError: apolloErrorHandling,
  });

  const { url } = await server.listen();

  console.log(`Server ready at ${url}`);
  return server;
}
