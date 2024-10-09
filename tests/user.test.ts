import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { PasswordService } from '../src/services/password-service';
import { prisma } from './test-setup';
import { UserHelper } from './helpers/user-helper';

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
    const { data: response } = await UserHelper.createUserWithApiCall(userPayload);

    expect(response).to.have.property('id');
    expect(response).to.have.property('name');
    expect(response).to.have.property('email');
    expect(response).to.have.property('birthDate');

    const user = await prisma.user.findUnique({ where: { id: response.id } });

    expect(user).to.be.not.equal(null);

    expect(user?.name).to.be.equal(userPayload.name);
    expect(user?.email).to.be.equal(userPayload.email);
    expect(user?.birthDate.toISOString()).to.be.equal(userPayload.birthDate);
    expect(user?.id).to.be.equal(response.id);
    expect(PasswordService.verifyPassword(userPayload.password, user?.password as string)).to.be.equal(true);

    expect(response.name).to.be.equal(userPayload.name);
    expect(response.email).to.be.equal(userPayload.email);
    expect(response.birthDate).to.be.equal(userPayload.birthDate);
  });

  it('Test if createUser mutation cant create an user with the same email', async () => {
    const userPayload = {
      email: 'test@test.com',
      name: 'test',
      password: 'test12',
      birthDate: '2024-10-02T18:17:49.314Z',
    };
    await UserHelper.createUserWithDbCall(userPayload);
    const { errors: response } = await UserHelper.createUserWithApiCall(userPayload);

    expect(response).to.be.not.equal(null);
    expect(response).to.be.an('array');
    expect(response).to.have.length(1);
    expect(response[0]).to.have.property('message');
    expect(response[0].message).to.be.equal('User already exists!');
  });
});
