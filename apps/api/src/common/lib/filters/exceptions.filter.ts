import { Catch, HttpException } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { GqlContextType } from '@nestjs/graphql';
import type { ErrorFilterResponse } from '@lib/types/interfaces/error-filter-response.interface';

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

    host.switchToHttp()
        .getResponse()
        .code(statusCode)
        .send(response);

    return response;
  }
}
