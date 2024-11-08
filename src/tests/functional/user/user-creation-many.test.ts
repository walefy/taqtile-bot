import { describe, it, afterEach } from 'mocha';
import { expect } from 'chai';
import { prisma } from '../../test-setup';
import { UserHelper } from '../../helpers/user-helper';
import fs from 'node:fs';

describe('Create users with csv suite (functional)', () => {
  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it('Test if createUsersWithCsv mutation can create many users', async () => {
    const token = await UserHelper.generateToken();
    const csvUsers = fs.createReadStream('src/tests/fixtures/user/users-csv.csv', 'utf-8');

    const { data: response } = await UserHelper.createUsersWithCsvApiCall(csvUsers, token);

    expect(response).to.be.equal('Users created');
  });

  it('Test whether the createUsersWithCsv mutation cannot create existing users', async () => {
    const token = await UserHelper.generateToken();
    const csvUsers = fs.createReadStream('src/tests/fixtures/user/users-csv.csv', 'utf-8');

    await UserHelper.createUserWithDbCall({ ...UserHelper.defaultUser, email: 'pedro.souza@email.com' });
    const { errors: response } = await UserHelper.createUsersWithCsvApiCall(csvUsers, token);

    expect(response).to.have.length(1);

    expect(response[0].code).to.be.equal(409);
    expect(response[0].message).to.be.equal('User(s) pedro.souza@email.com already exists');

    const users = await prisma.user.findMany();
    expect(users).to.have.length(2);
  });

  it('Test whether the createUsersWithCsv mutation cannot create users without csv', async () => {
    const token = await UserHelper.generateToken();
    const { errors: response } = await UserHelper.createUsersWithCsvApiCall(null, token);

    expect(response).to.have.length(1);

    expect(response[0].code).to.be.equal(400);
    expect(response[0].message).to.be.equal('Variable "$file" of non-null type "Upload!" must not be null.');
  });

  it('Test whether the createUsersWithCsv mutation cannot create users with invalid file format ', async () => {
    const token = await UserHelper.generateToken();
    const csvUsers = fs.createReadStream('src/tests/fixtures/user/users-invalid-format.txt', 'utf-8');

    const { errors: response } = await UserHelper.createUsersWithCsvApiCall(csvUsers, token);

    expect(response).to.have.length(1);
    expect(response[0].code).to.be.equal(400);
    expect(response[0].message).to.be.equal('File uploaded with invalid format! Expect csv file.');
  });

  it('Test whether the createUsersWithCsv mutation cannot create users with invalid file format ', async () => {
    const token = await UserHelper.generateToken();
    const csvUsers = fs.createReadStream('src/tests/fixtures/user/users-csv-invalid-user.csv', 'utf-8');

    const { errors: response } = await UserHelper.createUsersWithCsvApiCall(csvUsers, token);

    expect(response).to.have.length(1);
    expect(response[0].code).to.be.equal(400);
    expect(response[0].message).to.be.equal('Validation failed!');
    expect(response[0]).to.have.property('additionalInfo');

    const { additionalInfo } = response[0];

    expect(additionalInfo).to.have.length(1);
    expect(additionalInfo[0].field).to.be.equal('email');
    expect(additionalInfo[0].value).to.be.equal('');
    expect(additionalInfo[0].constraints).to.be.deep.equal({
      isEmail: 'email must be an email',
      isNotEmpty: 'email should not be empty',
    });

    const users = await prisma.user.findMany();
    expect(users).to.have.length(1);
  });
});
