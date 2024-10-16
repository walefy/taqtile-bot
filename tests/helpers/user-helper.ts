import axios from 'axios';
import { prisma } from '../test-setup';
import { Prisma, User } from '@prisma/client';
import { TokenService } from '../../src/services/token-service';

type GetAllUserOptions = {
  ignoreAdmin?: boolean;
  paginationOptions?: { page: number; pageLimit: number };
};

export class UserHelper {
  public static defaultUser = {
    email: 'test@test.com',
    name: 'test',
    password: 'test12',
    birthDate: '2024-10-02T18:17:49.314Z',
  };

  public static defaultAdmin = { ...UserHelper.defaultUser, email: 'admin@admin.com', name: 'zzzzzzz' };

  public static async createUserWithApiCall(data: Record<string, unknown>, token: string | null, addBearer = true) {
    const tokenString = addBearer ? `Bearer ${token}` : token;

    const response = await axios({
      url: 'http://localhost:4000',
      method: 'post',
      headers: { Authorization: tokenString },
      data: {
        query: `
          mutation CreateUser($data: UserInput!) {
            createUser(data: $data) {
              id
              name
              email
              birthDate
              address {
                id
                zipCode
                city
                complement
                neighborhood
                state
                street
                streetNumber
              }
            }
          }
        `,
        variables: { data },
      },
    });

    return { data: response.data.data?.createUser, errors: response.data.errors };
  }

  public static async createUserWithDbCall(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data, include: { address: true } });
  }

  public static async createUsersWithDbCall(data: Prisma.UserCreateInput[]) {
    const users: User[] = [];
    for (const user of data) {
      const userCreation = await prisma.user.create({ data: user, include: { address: true } });
      users.push(userCreation);
    }

    return users;
  }

  public static async login(data: Record<string, unknown>) {
    const response = await axios({
      url: 'http://localhost:4000',
      method: 'post',
      data: {
        query: `
          mutation Login($data: LoginInput!) {
            login(data: $data) {
              user {
                id
                name
                email
                birthDate
              }
              token
            }
          }
        `,
        variables: { data },
      },
    });

    return { data: response.data.data?.login, errors: response.data.errors };
  }

  public static async generateToken() {
    const user = await this.createUserWithDbCall(UserHelper.defaultAdmin);

    const tokenService = new TokenService();
    return tokenService.generateToken(user.email, { id: user.id }, true);
  }

  public static async getUser(token: string, id: number) {
    const response = await axios({
      url: 'http://localhost:4000',
      method: 'post',
      headers: { Authorization: `Bearer ${token}` },
      data: {
        query: `
          query User($data: UserInfoInput!) {
            user(data: $data) {
              id
              name
              email
              birthDate
              address {
                id
                zipCode
                city
                complement
                neighborhood
                state
                street
                streetNumber
              }
            }
          }
        `,
        variables: { data: { id } },
      },
    });

    return { data: response.data.data?.user, errors: response.data.errors };
  }

  public static async getAllUsers(token: string, options?: GetAllUserOptions) {
    const paginationOptions = options?.paginationOptions;
    const addressParams: string = [
      'id',
      'zipCode',
      'city',
      'complement',
      'neighborhood',
      'state',
      'street',
      'streetNumber',
    ].join(' ');

    const queryWithPagination = `
      query Users($data: UsersInfoInput!) {
        users(data: $data) {
          id
          name
          email
          birthDate
          address { ${addressParams} }
        }
      }
    `;

    const queryWithoutPagination = `
      query Users {
        users {
          id
          name
          email
          birthDate
          address { ${addressParams} }
        }
      }
    `;

    const response = await axios({
      url: 'http://localhost:4000',
      method: 'post',
      headers: { Authorization: `Bearer ${token}` },
      data: {
        query: paginationOptions ? queryWithPagination : queryWithoutPagination,
        variables: { data: paginationOptions },
      },
    });

    if (options?.ignoreAdmin) {
      const adminIndex = response.data.data.users.findIndex(
        (user: { email: string }) => user.email === UserHelper.defaultAdmin.email,
      );

      if (adminIndex >= 0) {
        response.data.data.users.splice(adminIndex, 1);
      }
    }

    return { data: response.data.data?.users, errors: response.data.errors };
  }
}
