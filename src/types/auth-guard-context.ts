import { Request } from 'express';

export type AuthContext = {
  user: {
    email: string;
  };
};

export type AuthGuardContext = {
  req: Request;
  auth: AuthContext;
};
