import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';

interface ExceptionFilterResponse {
  statusCode: number;
  error: string;
  message: string;
}

@Catch(HttpException)
export class ExceptionsFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): ExceptionFilterResponse {
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

    host
      .switchToHttp()
      .getResponse()
      .status(statusCode)
      .json(response);

    return response;
  }
}
