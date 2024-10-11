import { describe, it } from 'mocha';
import { expect } from 'chai';
import axios from 'axios';

describe('Hello World suite', () => {
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
