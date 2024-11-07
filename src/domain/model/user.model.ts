import { AddressInputModel, AddressModelWithoutUser } from './address.model';

export interface UserInputModel {
  name: string;
  email: string;
  password: string;
  birthDate: Date;
}

export interface UserInfoInputModel {
  id: number;
}

export interface UsersInfoInputModel {
  pageLimit: number;
  page: number;
}

export interface UserModel {
  id: number;
  name: string;
  email: string;
  birthDate: Date;
}

export interface UserWithPasswordModel extends UserModel {
  password: string;
}

export interface UserWithAddressAndPasswordModel extends UserWithPasswordModel {
  address: AddressModelWithoutUser[];
}

export interface UserWithAddressModel extends UserModel {
  address: AddressModelWithoutUser[];
}

export interface UserReadyToSaveWithAddress {
  user: UserInputModel;
  address: AddressInputModel[];
}
