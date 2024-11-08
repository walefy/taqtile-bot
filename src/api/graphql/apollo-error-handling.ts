import { GraphQLError } from 'graphql';
import { CustomError } from '@domain/error';
import { ApolloError, toApolloError, UserInputError } from 'apollo-server-express';
import { ArgumentValidationError } from 'type-graphql';

type ErrorAsType = {
  code: number;
  message: string;
  additionalInfo?: unknown;
};

export function apolloErrorHandling(error: GraphQLError): ErrorAsType | Error {
  const { originalError } = error;

  if (error instanceof UserInputError) {
    const { message } = error;
    return { code: 400, message };
  }

  if (originalError instanceof CustomError) {
    const { code, message, additionalInfo } = originalError;
    return { code, message, additionalInfo };
  }

  if (originalError instanceof ArgumentValidationError) {
    return {
      code: 400,
      message: originalError.message,
      additionalInfo: originalError.extensions.validationErrors,
    };
  }

  if (originalError instanceof ApolloError) {
    return originalError;
  }

  return toApolloError(error);
}
