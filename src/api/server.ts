import { Runnable } from '@core/contracts';
import { GraphQLServer } from '@graphql';

export class Server implements Runnable<unknown> {
  private server = new GraphQLServer();

  run(): Promise<unknown> {
    return this.server.run();
  }
}
