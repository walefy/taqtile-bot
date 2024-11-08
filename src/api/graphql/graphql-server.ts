import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server';
import { Runnable } from '@core/contracts';
import { UserResolver } from '@graphql/modules/user/user.resolver';
import { AddressResolver } from '@graphql/modules/address/address.resolver';
import { apolloErrorHandling } from './apollo-error-handling';
import Container from 'typedi';

export class GraphQLServer implements Runnable<ApolloServer> {
  async run(): Promise<ApolloServer> {
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
}
