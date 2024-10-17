import { Address } from './address';

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  birthDate: Date;
};

export type UserWithAddress = User & {
  address: Omit<Address, 'user'>[];
};
