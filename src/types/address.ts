import { User } from './user';

export type Address = {
  id: number;
  zipCode: string;
  street: string;
  streetNumber: number;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  user: User;
};
