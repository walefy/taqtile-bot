import { GraphQLError } from 'graphql';
import { CustomException } from './custom-exception';
import { ApolloError, toApolloError } from 'apollo-server';

type ExceptionAsType = {
  code: number;
  message: string;
};

export function apolloErrorHandling(error: GraphQLError): ExceptionAsType | Error {
  const { originalError } = error;

  if (originalError instanceof CustomException) {
    const { code, message } = originalError;
    return { code, message };
  }

  if (originalError instanceof ApolloError) {
    return originalError;
  }

  return toApolloError(error);
}
