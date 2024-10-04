import { describe, it, before, after, beforeEach } from 'mocha';
import { expect } from 'chai';
import { main } from '../src/server';
import { ApolloServer } from 'apollo-server';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

describe('User suite', () => {
  let server: ApolloServer;
  const prisma = new PrismaClient();

  before(async () => {
    server = await main();
  });

  after(async () => {
    await server.stop();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('Test if createUser mutation can create an user', async () => {
    const response = await axios({
      url: 'http://localhost:4000',
      method: 'post',
      data: {
        query: `
          mutation CreateUser {
            createUser(
              data: {
                email: "test@test.com"
                name: "test"
                password: "test12"
                birthDate: "2024-10-02T18:17:49.314Z"
              }
            ) {
              id
              name
              email
              birthDate
            }
          }
        `,
      },
    });

    expect(response.data.data.createUser).to.have.property('id');
    expect(response.data.data.createUser).to.have.property('name');
    expect(response.data.data.createUser).to.have.property('email');
    expect(response.data.data.createUser).to.have.property('birthDate');

    const user = await prisma.user.findUnique({ where: { id: response.data.data.createUser.id } });

    expect(user).to.be.not.equal(null);

    expect(response.data.data.createUser.name).to.be.equal('test');
    expect(response.data.data.createUser.email).to.be.equal('test@test.com');
    expect(response.data.data.createUser.birthDate).to.be.equal('2024-10-02T18:17:49.314Z');
  });
});
