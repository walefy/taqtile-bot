import { afterEach, describe, it } from 'mocha';
import { prisma } from '../../test-setup';
import { UserHelper } from '../../helpers/user-helper';
import { AddressHelper } from '../../helpers/address-helper';
import { expect } from 'chai';

describe('Create address suite (functional)', () => {
  afterEach(async () => {
    await prisma.address.deleteMany();
    await prisma.user.deleteMany();
  });

  it('Test if createAddress mutation can create an address', async () => {
    const token = await UserHelper.generateToken();
    const user = await UserHelper.createUserWithDbCall(UserHelper.defaultUser);

    const { data: response } = await AddressHelper.createAddress(user.id, token);
    const address = await prisma.address.findUnique({ where: { id: response.id } });

    expect(address).to.be.not.equal(null);

    expect(response).to.have.property('id');
    expect(response).to.have.property('city');
    expect(response).to.have.property('complement');
    expect(response).to.have.property('neighborhood');
    expect(response).to.have.property('state');
    expect(response).to.have.property('street');
    expect(response).to.have.property('streetNumber');
    expect(response).to.have.property('zipCode');
    expect(response).to.have.property('user');

    expect(response.city).to.be.equal(AddressHelper.defaultAddress.city);
    expect(response.complement).to.be.equal(AddressHelper.defaultAddress.complement);
    expect(response.neighborhood).to.be.equal(AddressHelper.defaultAddress.neighborhood);
    expect(response.state).to.be.equal(AddressHelper.defaultAddress.state);
    expect(response.street).to.be.equal(AddressHelper.defaultAddress.street);
    expect(response.streetNumber).to.be.equal(AddressHelper.defaultAddress.streetNumber);
    expect(response.zipCode).to.be.equal(AddressHelper.defaultAddress.zipCode);
    expect(response.user.id).to.be.equal(user.id);

    expect(address!.id).to.be.equal(response.id);
    expect(address!.city).to.be.equal(response.city);
    expect(address!.complement).to.be.equal(response.complement);
    expect(address!.neighborhood).to.be.equal(response.neighborhood);
    expect(address!.state).to.be.equal(response.state);
    expect(address!.street).to.be.equal(response.street);
    expect(address!.streetNumber).to.be.equal(response.streetNumber);
    expect(address!.zipCode).to.be.equal(response.zipCode);
    expect(address!.userId).to.be.equal(response.user.id);
  });

  it('Test if createAddress mutation can create two address for the same user', async () => {
    const token = await UserHelper.generateToken();
    const user = await UserHelper.createUserWithDbCall(UserHelper.defaultUser);

    const response = await AddressHelper.createAddressWithDbCall({ ...AddressHelper.defaultAddress, userId: user.id });
    const { data: response2 } = await AddressHelper.createAddress(user.id, token);
    const userInDb = await prisma.user.findUnique({ where: { id: user.id }, include: { address: true } });

    expect(userInDb!.address).to.have.length(2);

    expect(response).to.have.property('id');
    expect(response2).to.have.property('id');

    expect(response.id).to.be.not.equal(response2.id);
    expect(response.userId).to.be.equal(response2.user.id);
    expect(response.userId).to.be.equal(user.id);

    expect(response2).to.have.property('city');
    expect(response2).to.have.property('complement');
    expect(response2).to.have.property('neighborhood');
    expect(response2).to.have.property('state');
    expect(response2).to.have.property('street');
    expect(response2).to.have.property('streetNumber');
    expect(response2).to.have.property('zipCode');
    expect(response2).to.have.property('user');
    expect(response2.user).not.to.have.property('password');

    expect(response2.city).to.be.equal(AddressHelper.defaultAddress.city);
    expect(response2.complement).to.be.equal(AddressHelper.defaultAddress.complement);
    expect(response2.neighborhood).to.be.equal(AddressHelper.defaultAddress.neighborhood);
    expect(response2.state).to.be.equal(AddressHelper.defaultAddress.state);
    expect(response2.street).to.be.equal(AddressHelper.defaultAddress.street);
    expect(response2.streetNumber).to.be.equal(AddressHelper.defaultAddress.streetNumber);
    expect(response2.zipCode).to.be.equal(AddressHelper.defaultAddress.zipCode);

    for (const address of userInDb!.address) {
      expect(address).to.have.property('id');
      expect(address).to.have.property('city');
      expect(address).to.have.property('complement');
      expect(address).to.have.property('neighborhood');
      expect(address).to.have.property('state');
      expect(address).to.have.property('street');
      expect(address).to.have.property('streetNumber');
      expect(address).to.have.property('zipCode');
      expect(address).to.have.property('userId');

      expect(address.city).to.be.equal(AddressHelper.defaultAddress.city);
      expect(address.complement).to.be.equal(AddressHelper.defaultAddress.complement);
      expect(address.neighborhood).to.be.equal(AddressHelper.defaultAddress.neighborhood);
      expect(address.state).to.be.equal(AddressHelper.defaultAddress.state);
      expect(address.street).to.be.equal(AddressHelper.defaultAddress.street);
      expect(address.streetNumber).to.be.equal(AddressHelper.defaultAddress.streetNumber);
      expect(address.zipCode).to.be.equal(AddressHelper.defaultAddress.zipCode);
      expect(address.userId).to.be.equal(user.id);
    }
  });

  it('Test if createAddress mutation cant create an address with a invalid token', async () => {
    const { errors: response } = await AddressHelper.createAddress(1, '');

    expect(response).to.be.an('array');
    expect(response).to.have.length(1);
    expect(response[0]).to.have.property('message');
    expect(response[0].message).to.be.equal('Invalid or expired token');
  });

  it('Test if createAddress mutation cant create an address with a invalid user', async () => {
    const token = await UserHelper.generateToken();
    const { errors: response } = await AddressHelper.createAddress(9999, token);

    expect(response).to.be.an('array');
    expect(response).to.have.length(1);
    expect(response[0]).to.have.property('message');
    expect(response[0].message).to.be.equal('User not found!');
  });
});
