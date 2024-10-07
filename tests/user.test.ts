import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import axios from 'axios';
import { PasswordService } from '../src/services/password-service';
import { prisma } from './test-setup';

describe('User suite', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('Test if createUser mutation can create an user', async () => {
    const userPayload = {
      email: 'test@test.com',
      name: 'test',
      password: 'test12',
      birthDate: '2024-10-02T18:17:49.314Z',
    };
    const response = await axios({
      url: 'http://localhost:4000',
      method: 'post',
      data: {
        query: `
          mutation CreateUser($data: UserInput!) {
            createUser(data: $data) {
              id
              name
              email
              birthDate
            }
          }
        `,
        variables: { data: userPayload },
      },
    });

    expect(response.data.data.createUser).to.have.property('id');
    expect(response.data.data.createUser).to.have.property('name');
    expect(response.data.data.createUser).to.have.property('email');
    expect(response.data.data.createUser).to.have.property('birthDate');

    const user = await prisma.user.findUnique({ where: { id: response.data.data.createUser.id } });

    expect(user).to.be.not.equal(null);

    expect(user?.name).to.be.equal('test');
    expect(user?.email).to.be.equal('test@test.com');
    expect(user?.birthDate).to.be.eql(new Date('2024-10-02T18:17:49.314Z'));
    expect(user?.id).to.be.equal(response.data.data.createUser.id);
    expect(PasswordService.verifyPassword('test12', user?.password as string)).to.be.equal(true);

    expect(response.data.data.createUser.name).to.be.equal('test');
    expect(response.data.data.createUser.email).to.be.equal('test@test.com');
    expect(response.data.data.createUser.birthDate).to.be.equal('2024-10-02T18:17:49.314Z');
  });
});
