import { describe, it, afterEach } from 'mocha';
import { expect } from 'chai';
import { prisma } from '../../test-setup';
import { UserHelper } from '../../helpers/user-helper';
import { PasswordService } from '@core/security';

describe('Create user suite (functional)', () => {
  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should create a user with createUser mutation', async () => {
    const token = await UserHelper.generateToken();
    const { data: response } = await UserHelper.createUserWithApiCall(UserHelper.defaultUser, token);
    const user = await prisma.user.findUnique({ where: { id: response.id }, include: { address: true } });

    expect(response).to.have.property('id');
    expect(response).to.have.property('name');
    expect(response).to.have.property('email');
    expect(response).to.have.property('birthDate');
    expect(response).to.have.property('address');
    expect(response).not.to.have.property('password');

    expect(user).to.be.not.equal(null);

    expect(user?.name).to.be.equal(UserHelper.defaultUser.name);
    expect(user?.email).to.be.equal(UserHelper.defaultUser.email);
    expect(user?.birthDate.toISOString()).to.be.equal(UserHelper.defaultUser.birthDate);
    expect(user?.id).to.be.equal(response.id);
    expect(PasswordService.verifyPassword(UserHelper.defaultUser.password, user?.password as string)).to.be.equal(true);

    expect(response.name).to.be.equal(UserHelper.defaultUser.name);
    expect(response.email).to.be.equal(UserHelper.defaultUser.email);
    expect(response.birthDate).to.be.equal(UserHelper.defaultUser.birthDate);
  });

  it('should create a user without address with createUser mutation', async () => {
    const token = await UserHelper.generateToken();
    const { data: response } = await UserHelper.createUserWithApiCall(UserHelper.defaultUser, token);

    expect(response).to.have.property('id');
    expect(response).to.have.property('name');
    expect(response).to.have.property('email');
    expect(response).to.have.property('birthDate');
    expect(response).not.to.have.property('password');
    expect(response).to.have.property('address');
    expect(response.address).to.have.length(0);

    const user = await prisma.user.findUnique({ where: { id: response.id }, include: { address: true } });

    expect(user).to.be.not.equal(null);

    expect(user?.name).to.be.equal(UserHelper.defaultUser.name);
    expect(user?.email).to.be.equal(UserHelper.defaultUser.email);
    expect(user?.birthDate.toISOString()).to.be.equal(UserHelper.defaultUser.birthDate);
    expect(user?.id).to.be.equal(response.id);
    expect(PasswordService.verifyPassword(UserHelper.defaultUser.password, user?.password as string)).to.be.equal(true);

    expect(user?.address).to.have.length(0);

    expect(response.name).to.be.equal(UserHelper.defaultUser.name);
    expect(response.email).to.be.equal(UserHelper.defaultUser.email);
    expect(response.birthDate).to.be.equal(UserHelper.defaultUser.birthDate);
  });

  it('should not create a user with the same email with createUser mutation', async () => {
    const token = await UserHelper.generateToken();

    await UserHelper.createUserWithDbCall(UserHelper.defaultUser);
    const { errors: response } = await UserHelper.createUserWithApiCall(UserHelper.defaultUser, token);

    expect(response).to.be.an('array');
    expect(response).to.have.length(1);
    expect(response[0]).to.have.property('message');
    expect(response[0].message).to.be.equal('User already exists!');
  });

  it('should not create a user with an invalid token with createUser mutation', async () => {
    const { errors: response } = await UserHelper.createUserWithApiCall(UserHelper.defaultUser, '');

    expect(response).to.be.an('array');
    expect(response).to.have.length(1);
    expect(response[0]).to.have.property('message');
    expect(response[0].message).to.be.equal('Invalid or expired token');
  });

  it('should not create a user without a token with createUser mutation', async () => {
    const { errors: response } = await UserHelper.createUserWithApiCall(UserHelper.defaultUser, null, false);

    expect(response).to.be.an('array');
    expect(response).to.have.length(1);
    expect(response[0]).to.have.property('message');
    expect(response[0].message).to.be.equal('Token not provided');
  });
});
