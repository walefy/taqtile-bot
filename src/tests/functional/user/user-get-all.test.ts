import { afterEach, describe, it } from 'mocha';
import { prisma } from '../../test-setup';
import { UserHelper } from '../../helpers/user-helper';
import { expect } from 'chai';
import { AddressHelper } from '../../helpers/address-helper';

describe('Get all users info suite (functional)', () => {
  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it('Test if users query returns all users', async () => {
    const token = await UserHelper.generateToken();

    const users = Array.from({ length: 10 }, (_, i) => ({
      ...UserHelper.defaultUser,
      email: `fake${i}@fake.com`,
      name: i.toString(),
      address: { create: AddressHelper.defaultAddress },
    }));

    await UserHelper.createUsersWithDbCall(users);

    const { data: response } = await UserHelper.getAllUsers(token, { ignoreAdmin: true });

    expect(response).to.be.an('array');
    expect(response).to.have.length(10);

    for (let i = 0; i < 10; i++) {
      const user = response[i];

      expect(user).to.have.property('id');
      expect(user).to.have.property('name');
      expect(user).to.have.property('email');
      expect(user).to.have.property('birthDate');
      expect(user).to.have.property('address');
      expect(user).not.to.have.property('password');

      expect(user.name).to.be.equal(i.toString());
      expect(user.email).to.be.equal(`fake${i}@fake.com`);
      expect(user.birthDate).to.be.equal(UserHelper.defaultUser.birthDate);

      expect(user.address).to.have.length(1);
      expect(user.address[0]).to.have.property('id');
      expect(user.address[0]).to.have.property('zipCode');
      expect(user.address[0]).to.have.property('street');
      expect(user.address[0]).to.have.property('streetNumber');
      expect(user.address[0]).to.have.property('complement');
      expect(user.address[0]).to.have.property('neighborhood');
      expect(user.address[0]).to.have.property('city');
    }
  });

  it('Test if users query returns all users with limit 5', async () => {
    const token = await UserHelper.generateToken();

    const users = Array.from({ length: 10 }, (_, i) => ({
      ...UserHelper.defaultUser,
      email: `fake${i}@fake.com`,
      address: { create: AddressHelper.defaultAddress },
    }));
    await UserHelper.createUsersWithDbCall(users);

    const paginationOptions = { page: 1, pageLimit: 5 };
    const { data: response } = await UserHelper.getAllUsers(token, { paginationOptions, ignoreAdmin: true });

    expect(response).to.be.an('array');
    expect(response).to.have.length(5);

    for (const user of response) {
      expect(user).to.have.property('id');
      expect(user).to.have.property('name');
      expect(user).to.have.property('email');
      expect(user).to.have.property('birthDate');
      expect(user).to.have.property('address');
      expect(user).not.to.have.property('password');
    }
  });

  it('Test if users query returns an error when the token is invalid', async () => {
    const { errors: response } = await UserHelper.getAllUsers('');

    expect(response).to.be.an('array');
    expect(response[0]).to.have.property('message');
    expect(response[0].message).to.be.equal('Invalid or expired token');
  });

  it('Test if pagination is working correctly', async () => {
    const token = await UserHelper.generateToken();

    const users = Array.from({ length: 6 }, (_, i) => ({
      ...UserHelper.defaultUser,
      email: `fake${i}@fake.com`,
      name: i.toString(),
    }));

    await UserHelper.createUsersWithDbCall(users);

    const { data: pageOneResponse } = await UserHelper.getAllUsers(token, {
      paginationOptions: { page: 1, pageLimit: 3 },
      ignoreAdmin: true,
    });

    const { data: pageTwoResponse } = await UserHelper.getAllUsers(token, {
      paginationOptions: { page: 2, pageLimit: 3 },
      ignoreAdmin: true,
    });

    expect(pageOneResponse).to.be.an('array');
    expect(pageOneResponse).to.have.length(3);

    expect(pageTwoResponse).to.be.an('array');
    expect(pageTwoResponse).to.have.length(3);

    for (const user of pageOneResponse) {
      expect(user.name).to.be.oneOf(['0', '1', '2']);
    }

    for (const user of pageTwoResponse) {
      expect(user.name).to.be.oneOf(['3', '4', '5']);
    }
  });

  it('Test if users query returns an error when pageLimit is negative', async () => {
    const token = await UserHelper.generateToken();
    const paginationOptions = { page: 1, pageLimit: -1 };
    const { errors: response } = await UserHelper.getAllUsers(token, { paginationOptions });

    expect(response).to.be.an('array');
    expect(response[0]).to.have.property('message');
    expect(response[0]).to.have.property('code');
    expect(response[0]).to.have.property('additionalInfo');
    expect(response[0].code).to.be.equal(400);
    expect(response[0].message).to.be.equal('Argument Validation Error');

    expect(response[0].additionalInfo).to.be.an('array');
    expect(response[0].additionalInfo).to.have.length(1);
    expect(response[0].additionalInfo[0].property).to.be.equal('pageLimit');
    expect(response[0].additionalInfo[0].constraints).to.have.property('min');
    expect(response[0].additionalInfo[0].constraints.min).to.be.equal('Page limit must be greater than 0');
  });

  it('Test if users query returns an error when page is negative', async () => {
    const token = await UserHelper.generateToken();
    const paginationOptions = { page: -1, pageLimit: 1 };
    const { errors: response } = await UserHelper.getAllUsers(token, { paginationOptions });

    expect(response).to.be.an('array');
    expect(response[0]).to.have.property('message');
    expect(response[0]).to.have.property('code');
    expect(response[0]).to.have.property('additionalInfo');
    expect(response[0].code).to.be.equal(400);
    expect(response[0].message).to.be.equal('Argument Validation Error');

    expect(response[0].additionalInfo).to.be.an('array');
    expect(response[0].additionalInfo).to.have.length(1);
    expect(response[0].additionalInfo[0].property).to.be.equal('page');
    expect(response[0].additionalInfo[0].constraints).to.have.property('min');
    expect(response[0].additionalInfo[0].constraints.min).to.be.equal('Page must be greater than 0');
  });

  it('Test if users query returns an empty array when page is greater than the number of pages', async () => {
    const token = await UserHelper.generateToken();

    const users = Array.from({ length: 6 }, (_, i) => ({
      ...UserHelper.defaultUser,
      email: `fake${i}@fake.com`,
      name: i.toString(),
    }));

    await UserHelper.createUsersWithDbCall(users);

    const paginationOptions = { page: 2, pageLimit: 7 };
    const { data: response } = await UserHelper.getAllUsers(token, { paginationOptions });

    expect(response).to.be.an('array');
    expect(response).to.have.length(0);
  });

  it('Test if users query returns all users when pageLimit is greater than the number of users', async () => {
    const token = await UserHelper.generateToken();

    const users = Array.from({ length: 5 }, (_, i) => ({
      ...UserHelper.defaultUser,
      email: `fake${i}@fake.com`,
      name: i.toString(),
    }));

    await UserHelper.createUsersWithDbCall(users);

    const paginationOptions = { page: 1, pageLimit: 500 };
    const { data: response } = await UserHelper.getAllUsers(token, { paginationOptions });

    expect(response).to.be.an('array');
    expect(response).to.have.length(6);
  });

  it('Test if users query returns an empty array when there are no users', async () => {
    const token = await UserHelper.generateToken();
    const { data: response } = await UserHelper.getAllUsers(token, { ignoreAdmin: true });

    expect(response).to.be.an('array');
    expect(response).to.have.length(0);
  });

  it('Test if users query returns an empty array when there are no users with pageLimit 5 and page 1 ', async () => {
    const token = await UserHelper.generateToken();
    const paginationOptions = { page: 1, pageLimit: 5 };
    const { data: response } = await UserHelper.getAllUsers(token, { paginationOptions, ignoreAdmin: true });

    expect(response).to.be.an('array');
    expect(response).to.have.length(0);
  });
});
