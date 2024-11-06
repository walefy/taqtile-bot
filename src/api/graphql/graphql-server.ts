import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { Runnable } from '@core/contracts';
import { UserResolver } from '@graphql/modules/user/user.resolver';
import { AddressResolver } from '@graphql/modules/address/address.resolver';
import { apolloErrorHandling } from './apollo-error-handling';
import { createServer, Server } from 'node:http';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import Container from 'typedi';
import express from 'express';
import process from 'node:process';

export class GraphQLServer implements Runnable<Server> {
  async run(): Promise<Server> {
    const schema = await buildSchema({
      resolvers: [UserResolver, AddressResolver],
      validate: true,
      container: Container,
    });

    const app = express();
    const httpServer = createServer(app);

    app.use(express.json());

    const apolloServer = new ApolloServer({
      schema,
      formatError: apolloErrorHandling,
      context: ({ req }) => ({ req }),
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    app.use(graphqlUploadExpress());

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/' });

    const port = 4000;
    const server = app.listen({ port }, () => {
      console.log(`Server ready on port ${port}`);
    });

    process.on('SIGTERM', () => {
      server.close(() => {
        console.log('Closed server');
      });
    });

    return server;
  }
}
