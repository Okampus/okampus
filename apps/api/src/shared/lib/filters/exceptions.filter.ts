import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import type { ErrorFilterResponse } from '../types/interfaces/error-filter-response.interface';

@Catch(HttpException)
export class ExceptionsFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): ErrorFilterResponse {
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

    if (host.getType() === 'http') {
      host.switchToHttp()
        .getResponse()
        .status(statusCode)
        .json(response);
    }

    return response;
  }
}
