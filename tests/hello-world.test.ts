import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import { main } from '../src/server';
import { ApolloServer } from 'apollo-server';
import axios from 'axios';

describe('Hello World suite', () => {
  let server: ApolloServer;

  before(async () => {
    server = await main();
  });

  after(async () => {
    await server.stop();
  });

  it('Test if Hello World query returns a "Hello World string"', async () => {
    const response = await axios({
      url: 'http://localhost:4000',
      method: 'post',
      data: {
        query: `
          query helloWorld {
            helloWorld
          }
        `,
      },
    });

    expect(response.data).to.be.deep.equal({ data: { helloWorld: 'Hello World' } });
  });
});
