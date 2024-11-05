import { UserModel } from './user.model';

export interface AddressInputModel {
  street: string;
  zipCode: string;
  streetNumber: number;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  userId: number;
}

export interface AddressModelWithoutUser {
  id: number;
  zipCode: string;
  street: string;
  streetNumber: number;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
}

export interface AddressModel extends AddressModelWithoutUser {
  user: UserModel;
}
