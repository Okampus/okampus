import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { config } from '../../configs/config';
import type { ErrorFilterResponse } from '../types/interfaces/error-filter-response.interface';

@Catch(HttpException)
export class ExceptionsFilter implements ExceptionFilter {
  constructor(
    @InjectSentry() private readonly sentry: SentryService,
  ) {}

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

    if (statusCode >= 500 && config.get('sentry.enabled'))
      this.sentry.instance().captureException(exception);

    host
      .switchToHttp()
      .getResponse()
      .status(statusCode)
      .json(response);

    return response;
  }
}
