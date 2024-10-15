import { GraphQLError } from 'graphql';
import { CustomException } from './custom-exception';
import { ApolloError, toApolloError } from 'apollo-server';
import { ArgumentValidationError } from 'type-graphql';

type ExceptionAsType = {
  code: number;
  message: string;
  additionalInfo?: unknown;
};

export function apolloErrorHandling(error: GraphQLError): ExceptionAsType | Error {
  const { originalError } = error;

  if (originalError instanceof CustomException) {
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
