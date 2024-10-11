import axios from 'axios';
import { prisma } from '../test-setup';
import { Prisma } from '@prisma/client';

export class UserHelper {
  static async createUserWithApiCall(data: Record<string, unknown>) {
    const response = await axios({
      url: 'http://localhost:4000',
      method: 'post',
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

  static async createUserWithDbCall(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }
}
