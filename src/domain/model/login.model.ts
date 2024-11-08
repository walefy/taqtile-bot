import { UserModel } from '@domain/model/user.model';

export interface LoginInputModel {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginModel {
  user: UserModel;
  token: string;
}
