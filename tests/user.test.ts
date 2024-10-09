import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { PasswordService } from '../src/services/password-service';
import { prisma } from './test-setup';
import { UserHelper } from './helpers/user-helper';
import { TokenService } from '../src/services/token-service';
import { TokenHelper } from './helpers/token-helper';

describe('User suite', () => {
  const defaultUser = {
    email: 'test@test.com',
    name: 'test',
    password: 'test12',
    birthDate: '2024-10-02T18:17:49.314Z',
  };

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('Test if createUser mutation can create an user', async () => {
    const { data: response } = await UserHelper.createUserWithApiCall(defaultUser);

    expect(response).to.have.property('id');
    expect(response).to.have.property('name');
    expect(response).to.have.property('email');
    expect(response).to.have.property('birthDate');

    const user = await prisma.user.findUnique({ where: { id: response.id } });

    expect(user).to.be.not.equal(null);

    expect(user?.name).to.be.equal(defaultUser.name);
    expect(user?.email).to.be.equal(defaultUser.email);
    expect(user?.birthDate.toISOString()).to.be.equal(defaultUser.birthDate);
    expect(user?.id).to.be.equal(response.id);
    expect(PasswordService.verifyPassword(defaultUser.password, user?.password as string)).to.be.equal(true);

    expect(response.name).to.be.equal(defaultUser.name);
    expect(response.email).to.be.equal(defaultUser.email);
    expect(response.birthDate).to.be.equal(defaultUser.birthDate);
  });

  it('Test if createUser mutation cant create an user with the same email', async () => {
    await UserHelper.createUserWithDbCall(defaultUser);
    const { errors: response } = await UserHelper.createUserWithApiCall(defaultUser);

    expect(response).to.be.not.equal(null);
    expect(response).to.be.an('array');
    expect(response).to.have.length(1);
    expect(response[0]).to.have.property('message');
    expect(response[0].message).to.be.equal('User already exists!');
  });

  it('Test if login mutation can login an user', async () => {
    await UserHelper.createUserWithApiCall(defaultUser);
    const loginPayload = { email: defaultUser.email, password: defaultUser.password };
    const { data: response } = await UserHelper.login(loginPayload);

    expect(response).to.have.property('user');
    expect(response).to.have.property('token');

    expect(response.user).to.have.property('id');
    expect(response.user).to.have.property('name');
    expect(response.user).to.have.property('email');
    expect(response.user).to.have.property('birthDate');

    expect(response.user.name).to.be.equal(defaultUser.name);
    expect(response.user.email).to.be.equal(defaultUser.email);
    expect(response.user.birthDate).to.be.equal(defaultUser.birthDate);
  });

  it('Test if login mutation cant login an user with wrong password', async () => {
    await UserHelper.createUserWithApiCall(defaultUser);
    const loginPayload = { email: defaultUser.email, password: 'wrongpassword' };
    const { errors: response } = await UserHelper.login(loginPayload);

    expect(response).to.be.not.equal(null);
    expect(response).to.be.an('array');
    expect(response).to.have.length(1);
    expect(response[0]).to.have.property('message');
    expect(response[0].message).to.be.equal('Login unauthorized!');
  });

  it('Test if login mutation cant login an user with wrong email', async () => {
    await UserHelper.createUserWithApiCall(defaultUser);
    const loginPayload = { email: 'wrongemail@email.com', password: defaultUser.password };
    const { errors: response } = await UserHelper.login(loginPayload);

    expect(response).to.be.not.equal(null);
    expect(response).to.be.an('array');
    expect(response).to.have.length(1);
    expect(response[0]).to.have.property('message');
    expect(response[0].message).to.be.equal('Login unauthorized!');
  });

  it('Test if login mutation can login an user with rememberMe', async () => {
    await UserHelper.createUser(defaultUser);
    const loginPayload = { email: defaultUser.email, password: defaultUser.password, rememberMe: true };
    const { data: response } = await UserHelper.login(loginPayload);

    expect(response).to.have.property('user');
    expect(response).to.have.property('token');

    expect(response.user).to.have.property('id');
    expect(response.user).to.have.property('name');
    expect(response.user).to.have.property('email');
    expect(response.user).to.have.property('birthDate');

    expect(response.user.name).to.be.equal(defaultUser.name);
    expect(response.user.email).to.be.equal(defaultUser.email);
    expect(response.user.birthDate).to.be.equal(defaultUser.birthDate);

    const tokenService = new TokenService();
    const payload = tokenService.verifyToken(response.token) as { exp: number };

    expect(TokenHelper.tokenExpirationInDays(payload.exp)).to.be.equal(7);
  });
});
