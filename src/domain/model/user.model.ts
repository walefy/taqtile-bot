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
