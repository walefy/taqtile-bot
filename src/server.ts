import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { PrismaClient } from '@prisma/client';
import { UserResolver } from '@graphql/modules/user/user.resolver';
import { AddressResolver } from '@graphql/modules/address/address.resolver';
import { apolloErrorHandling } from '@graphql/apollo-error-handling';

export async function main(): Promise<ApolloServer> {
  const prisma = new PrismaClient();
  Container.set(PrismaClient, prisma);

  const schema = await buildSchema({
    resolvers: [UserResolver, AddressResolver],
    validate: true,
    container: Container,
  });

  const server = new ApolloServer({
    schema,
    formatError: apolloErrorHandling,
    context: ({ req }) => ({ req }),
  });

  const { url } = await server.listen();

  console.log(`Server ready at ${url}`);
  return server;
}
