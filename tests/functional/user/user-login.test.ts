import { afterEach, describe, it } from 'mocha';
import { prisma } from '../../test-setup';
import { expect } from 'chai';
import { TokenHelper } from '../../helpers/token-helper';
import { TokenService } from '../../../src/services/token-service';
import { UserHelper } from '../../helpers/user-helper';

describe('Login user suite (functional)', () => {
  afterEach(async () => {
    prisma.user.deleteMany();
  });

  it('Test if login mutation can login an user', async () => {
    await UserHelper.createUserWithApiCall(UserHelper.defaultUser);
    const loginPayload = { email: UserHelper.defaultUser.email, password: UserHelper.defaultUser.password };
    const { data: response } = await UserHelper.login(loginPayload);

    expect(response).to.have.property('user');
    expect(response).to.have.property('token');

    expect(response.user).to.have.property('id');
    expect(response.user).to.have.property('name');
    expect(response.user).to.have.property('email');
    expect(response.user).to.have.property('birthDate');

    expect(response.user.name).to.be.equal(UserHelper.defaultUser.name);
    expect(response.user.email).to.be.equal(UserHelper.defaultUser.email);
    expect(response.user.birthDate).to.be.equal(UserHelper.defaultUser.birthDate);
  });

  it('Test if login mutation cant login an user with wrong password', async () => {
    await UserHelper.createUserWithApiCall(UserHelper.defaultUser);
    const loginPayload = { email: UserHelper.defaultUser.email, password: 'wrongpassword' };
    const { errors: response } = await UserHelper.login(loginPayload);

    expect(response).to.be.an('array');
    expect(response).to.have.length(1);
    expect(response[0]).to.have.property('message');
    expect(response[0].message).to.be.equal('Login unauthorized!');
  });

  it('Test if login mutation cant login an user with wrong email', async () => {
    await UserHelper.createUserWithApiCall(UserHelper.defaultUser);
    const loginPayload = { email: 'wrongemail@email.com', password: UserHelper.defaultUser.password };
    const { errors: response } = await UserHelper.login(loginPayload);

    expect(response).to.be.an('array');
    expect(response).to.have.length(1);
    expect(response[0]).to.have.property('message');
    expect(response[0].message).to.be.equal('Login unauthorized!');
  });

  it('Test if login mutation can generate a token with 1 day of expiration', async () => {
    await UserHelper.createUserWithApiCall(UserHelper.defaultUser);
    const loginPayload = { email: UserHelper.defaultUser.email, password: UserHelper.defaultUser.password };
    const { data: response } = await UserHelper.login(loginPayload);

    const tokenService = new TokenService();
    const payload = tokenService.verifyToken(response.token) as { exp: number };

    expect(TokenHelper.tokenExpirationInDays(payload.exp)).to.be.equal(1);
  });

  it('Test if login mutation can login an user with rememberMe', async () => {
    await UserHelper.createUserWithApiCall(UserHelper.defaultUser);
    const loginPayload = {
      email: UserHelper.defaultUser.email,
      password: UserHelper.defaultUser.password,
      rememberMe: true,
    };
    const { data: response } = await UserHelper.login(loginPayload);

    expect(response).to.have.property('user');
    expect(response).to.have.property('token');

    expect(response.user).to.have.property('id');
    expect(response.user).to.have.property('name');
    expect(response.user).to.have.property('email');
    expect(response.user).to.have.property('birthDate');

    expect(response.user.name).to.be.equal(UserHelper.defaultUser.name);
    expect(response.user.email).to.be.equal(UserHelper.defaultUser.email);
    expect(response.user.birthDate).to.be.equal(UserHelper.defaultUser.birthDate);

    const tokenService = new TokenService();
    const payload = tokenService.verifyToken(response.token) as { exp: number };

    expect(TokenHelper.tokenExpirationInDays(payload.exp)).to.be.equal(7);
  });
});
