import axios from 'axios';
import { prisma } from '../test-setup';
import { Prisma } from '@prisma/client';
import { TokenService } from '../../src/services/token-service';

export class UserHelper {
  public static defaultUser = {
    email: 'test@test.com',
    name: 'test',
    password: 'test12',
    birthDate: '2024-10-02T18:17:49.314Z',
  };

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
            }
          }
        `,
        variables: { data },
      },
    });

    return { data: response.data.data?.createUser, errors: response.data.errors };
  }

  public static async createUserWithDbCall(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  public static async createUsersWithDbCall(data: Prisma.UserCreateInput[]) {
    return prisma.user.createMany({ data });
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
    const data = { ...UserHelper.defaultUser, email: 'admin@admin.com' };
    const user = await this.createUserWithDbCall(data);

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
            }
          }
        `,
        variables: { data: { id } },
      },
    });

    return { data: response.data.data?.user, errors: response.data.errors };
  }

  public static async getAllUsers(token: string, paginationOptions?: { page?: number; pageLimit?: number }) {
    const queryWithPagination = `
      query Users($data: UsersInfoInput!) {
        users(data: $data) {
          id
          name
          email
          birthDate
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

    return { data: response.data.data?.users, errors: response.data.errors };
  }
}
