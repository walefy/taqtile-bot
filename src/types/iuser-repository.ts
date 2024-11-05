import { UserInputModel } from '@domain/model';
import { User } from './user';

export type findAllArgs = {
  page?: number;
  pageLimit?: number;
};

export interface IUserRepository {
  create(data: UserInputModel): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  findAll(config: findAllArgs): Promise<User[]>;
}
