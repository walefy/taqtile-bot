import { afterEach, describe, it } from 'mocha';
import { prisma } from '../../test-setup';
import { UserHelper } from '../../helpers/user-helper';
import { expect } from 'chai';

describe('Get all users info suite (functional)', () => {
  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it('Test if users query returns all users', async () => {
    const token = await UserHelper.generateToken();

    const users = Array.from({ length: 10 }, (_, i) => ({ ...UserHelper.defaultUser, email: `fake${i}@fake.com` }));
    await UserHelper.createUsersWithDbCall(users);

    const { data: response } = await UserHelper.getAllUsers(token);

    expect(response).to.be.an('array');
    expect(response).to.have.length(11);

    for (const user of response) {
      expect(user).to.have.property('id');
      expect(user).to.have.property('name');
      expect(user).to.have.property('email');
      expect(user).to.have.property('birthDate');
      expect(user).not.to.have.property('password');
    }
  });

  it('Test if users query returns all users with limit 5', async () => {
    const token = await UserHelper.generateToken();

    const users = Array.from({ length: 10 }, (_, i) => ({ ...UserHelper.defaultUser, email: `fake${i}@fake.com` }));
    await UserHelper.createUsersWithDbCall(users);

    const { data: response } = await UserHelper.getAllUsers(token, 5);

    expect(response).to.be.an('array');
    expect(response).to.have.length(5);

    for (const user of response) {
      expect(user).to.have.property('id');
      expect(user).to.have.property('name');
      expect(user).to.have.property('email');
      expect(user).to.have.property('birthDate');
      expect(user).not.to.have.property('password');
    }
  });

  it('Test if users query returns an error when the token is invalid', async () => {
    const { errors: response } = await UserHelper.getAllUsers('', 1);

    expect(response).to.be.an('array');
    expect(response[0]).to.have.property('message');
    expect(response[0].message).to.be.equal('Invalid or expired token');
  });
});
