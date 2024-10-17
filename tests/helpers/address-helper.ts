import { Prisma } from '@prisma/client';
import axios from 'axios';
import { prisma } from '../test-setup';

export type AddressCreateInput = Omit<Prisma.AddressCreateInput, 'user'> & { userId: number };

export class AddressHelper {
  public static defaultAddress = {
    city: 'Test city',
    complement: 'test complement',
    neighborhood: 'test neighborhood',
    state: 'test',
    street: 'test',
    streetNumber: 10,
    zipCode: '01153000',
  };

  public static async createAddress(userId: number, token: string) {
    const response = await axios({
      url: 'http://localhost:4000',
      method: 'post',
      headers: { Authorization: `Bearer ${token}` },
      data: {
        query: `
            mutation CreateAddress($data: AddressInput!) {
              createAddress(data: $data) {
                city
                complement
                id
                neighborhood
                state
                street
                streetNumber
                zipCode
                user {
                  name
                  id
                  email
                  birthDate
                }
              }
            }
          `,
        variables: { data: { ...AddressHelper.defaultAddress, userId } },
      },
    });

    return { data: response.data.data?.createAddress, errors: response.data.errors };
  }

  public static async createAddressWithDbCall(data: AddressCreateInput) {
    return prisma.address.create({ data, include: { user: true } });
  }
}
