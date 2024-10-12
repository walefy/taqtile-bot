import { afterEach, describe, it } from 'mocha';
import { prisma } from '../../test-setup';
import { UserHelper } from '../../helpers/user-helper';
import { expect } from 'chai';

describe('Get user info suite (functional)', () => {
  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it('Test if user query returns the correct user', async () => {
    const token = await UserHelper.generateToken();
    const { data: userCreation } = await UserHelper.createUserWithApiCall(UserHelper.defaultUser, token);

    const { data: response } = await UserHelper.getUser(token, userCreation.id);

    expect(response).to.have.property('id');
    expect(response).to.have.property('name');
    expect(response).to.have.property('email');
    expect(response).to.have.property('birthDate');
    expect(response).not.to.have.property('password');

    expect(response.id).to.be.equal(userCreation.id);
    expect(response.name).to.be.equal(userCreation.name);
    expect(response.email).to.be.equal(userCreation.email);
    expect(response.birthDate).to.be.equal(userCreation.birthDate);
  });

  it('Test if user query returns an error when the user does not exist', async () => {
    const token = await UserHelper.generateToken();
    const { errors: response } = await UserHelper.getUser(token, 1);

    expect(response).to.be.an('array');
    expect(response[0]).to.have.property('message');
    expect(response[0].message).to.be.equal('User not found!');
  });

  it('Test if user query returns an error when the token is invalid', async () => {
    const { errors: response } = await UserHelper.getUser('', 1);

    expect(response).to.be.an('array');
    expect(response[0]).to.have.property('message');
    expect(response[0].message).to.be.equal('Invalid or expired token');
  });
});
