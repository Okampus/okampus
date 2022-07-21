import { Catch, HttpException } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { GqlContextType } from '@nestjs/graphql';
import {
  ApolloError, AuthenticationError, ForbiddenError, UserInputError,
} from 'apollo-server-express';
import { NotFoundError } from '../errors/not-found.error';
import type { ErrorFilterResponse } from '../types/interfaces/error-filter-response.interface';

@Catch(HttpException)
export class ExceptionsFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): ErrorFilterResponse {
    if (host.getType<GqlContextType>() === 'graphql')
      throw exception;

    const statusCode = exception.getStatus();
    const error = exception.getResponse();

    const response = {
      statusCode,
      error: 'Error',
      message: exception.message,
    };

    if (typeof error === 'string')
      response.message = error;
    else
      Object.assign(response, error);

    if (host.getType() !== 'http') {
      switch (statusCode) {
        case 400: throw new UserInputError(response.message);
        case 401: throw new AuthenticationError(response.message);
        case 403: throw new ForbiddenError(response.message);
        case 404: throw new NotFoundError(response.message);
        default: throw new ApolloError(response.message);
      }
    }

    host.switchToHttp()
        .getResponse()
        .status(statusCode)
        .json(response);

    return response;
  }
}
