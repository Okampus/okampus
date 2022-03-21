import type {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  Type,
} from '@nestjs/common';
import { Catch } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { TypesenseError } from 'typesense/lib/Typesense/Errors';
import type { ErrorFilterResponse } from '../types/interfaces/error-filter-response.interface';

@Catch(TypesenseError)
export class TypesenseFilter implements ExceptionFilter {
  public catch(error: TypesenseError, host: ArgumentsHost): ErrorFilterResponse {
    const isHttpTypesenseError = typeof error.httpStatus !== 'undefined'
      && Object.keys(HttpErrorByCode).includes(error.httpStatus.toString());

    const statusCode = isHttpTypesenseError
      ? error.httpStatus === 404
        ? 400
        : error.httpStatus as keyof typeof HttpErrorByCode
      : 500;

    const Exception = HttpErrorByCode[statusCode] as Type<HttpException>;

    const response = {
      statusCode,
      error: new Exception().message,
      message: error.message.split('Server said: ').pop()!,
    };

    host
      .switchToHttp()
      .getResponse()
      .status(statusCode)
      .json(response);

    return response;
  }
}
