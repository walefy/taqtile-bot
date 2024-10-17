import { afterEach, describe, it } from 'mocha';
import { prisma } from '../../test-setup';
import { UserHelper } from '../../helpers/user-helper';
import { expect } from 'chai';
import { AddressHelper } from '../../helpers/address-helper';

describe('Get user info suite (functional)', () => {
  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it('Test if user query returns the correct user', async () => {
    const token = await UserHelper.generateToken();
    const userCreation = await UserHelper.createUserWithDbCall(UserHelper.defaultUser);
    AddressHelper.createAddressWithDbCall({ ...AddressHelper.defaultAddress, userId: userCreation.id });

    const { data: response } = await UserHelper.getUser(token, userCreation.id);

    expect(response).to.have.property('id');
    expect(response).to.have.property('name');
    expect(response).to.have.property('email');
    expect(response).to.have.property('birthDate');
    expect(response).to.have.property('address');
    expect(response).not.to.have.property('password');

    expect(response.id).to.be.equal(userCreation.id);
    expect(response.name).to.be.equal(userCreation.name);
    expect(response.email).to.be.equal(userCreation.email);
    expect(response.birthDate).to.be.equal(userCreation.birthDate.toISOString());
    expect(response.address).to.be.an('array');
    expect(response.address).to.have.length(1);
    expect(response.address[0].city).to.be.equal(AddressHelper.defaultAddress.city);
    expect(response.address[0].complement).to.be.equal(AddressHelper.defaultAddress.complement);
    expect(response.address[0].neighborhood).to.be.equal(AddressHelper.defaultAddress.neighborhood);
    expect(response.address[0].state).to.be.equal(AddressHelper.defaultAddress.state);
    expect(response.address[0].street).to.be.equal(AddressHelper.defaultAddress.street);
    expect(response.address[0].streetNumber).to.be.equal(AddressHelper.defaultAddress.streetNumber);
    expect(response.address[0].zipCode).to.be.equal(AddressHelper.defaultAddress.zipCode);
  });

  it('Test if user query returns the correct user when the user does not have an address', async () => {
    const token = await UserHelper.generateToken();
    const userCreation = await UserHelper.createUserWithDbCall(UserHelper.defaultUser);

    const { data: response } = await UserHelper.getUser(token, userCreation.id);

    expect(response).to.have.property('id');
    expect(response).to.have.property('name');
    expect(response).to.have.property('email');
    expect(response).to.have.property('birthDate');
    expect(response).to.have.property('address');
    expect(response).not.to.have.property('password');

    expect(response.id).to.be.equal(userCreation.id);
    expect(response.name).to.be.equal(userCreation.name);
    expect(response.email).to.be.equal(userCreation.email);
    expect(response.birthDate).to.be.equal(userCreation.birthDate.toISOString());
    expect(response.address).to.be.an('array');
    expect(response.address).to.have.length(0);
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
