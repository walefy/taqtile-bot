import axios from 'axios';

export class UserHelper {
  static async createUser(data: Record<string, unknown>) {
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
}
