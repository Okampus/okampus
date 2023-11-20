import type { TokenType } from '@okampus/shared/enums';

export enum ErrorCode {
  Unauthorized = 'Unauthorized',
  BadRequest = 'BadRequest',
  Forbidden = 'Forbidden',
  NotFound = 'NotFound',
  InternalServerError = 'InternalServerError',
  ServiceUnavailable = 'ServiceUnavailable',
}

export const errors = {
  [ErrorCode.BadRequest]: 400,
  [ErrorCode.Unauthorized]: 401,
  [ErrorCode.Forbidden]: 403,
  [ErrorCode.NotFound]: 404,
  [ErrorCode.InternalServerError]: 500,
  [ErrorCode.ServiceUnavailable]: 503,
};

type ErrorType =
  | UnauthorizedErrorType
  | BadRequestErrorType
  | ForbiddenErrorType
  | NotFoundErrorType
  | InternalErrorType
  | ServiceUnavailableErrorType;

export class ServerError extends Error {
  key: ErrorType;
  error?: ErrorCode;
  context?: { field?: string } & Record<string, unknown>;

  constructor(key: ErrorType, error?: ErrorCode, context?: Record<string, unknown>) {
    super(`${error}: ${key} ${JSON.stringify(context)}`);
    this.key = key;
    this.error = error || ErrorCode.InternalServerError;
    this.context = context;
  }
}

type UnauthorizedErrorType =
  | `INVALID_${TokenType}_TOKEN`
  | `EXPIRED_${TokenType}_TOKEN`
  | 'INVALID_CREDENTIALS'
  | 'INVALID_AUTH_METHOD'
  | 'COMPROMISED_SESSION'
  | 'MISSING_TOKEN';

export class UnauthorizedError extends ServerError {
  constructor(key: UnauthorizedErrorType, context?: Record<string, unknown>) {
    super(key, ErrorCode.Unauthorized, context);
  }
}

type BadRequestErrorType = 'MISSING_FIELD' | 'INVALID_FIELD' | 'MISSING_HEADER' | 'INVALID_HEADER';

export class BadRequestError extends ServerError {
  constructor(key: BadRequestErrorType, context?: Record<string, unknown>) {
    super(key, ErrorCode.BadRequest, context);
  }
}

type ForbiddenErrorType = 'UNAUTHORIZED_TEAM' | 'UNAUTHORIZED_TENANT';

export class ForbiddenError extends ServerError {
  constructor(key: ForbiddenErrorType, context?: Record<string, unknown>) {
    super(key, ErrorCode.Forbidden, context);
  }
}

type NotFoundErrorType = 'NOT_FOUND_TENANT' | 'NOT_FOUND_EVENT' | 'NOT_FOUND_TEAM' | 'NOT_FOUND_USER' | 'NOT_FOUND';

export class NotFoundError extends ServerError {
  constructor(key: NotFoundErrorType, context?: Record<string, unknown>) {
    super(key, ErrorCode.NotFound, context);
  }
}

type InternalErrorType = 'UNEXPECTED_ERROR' | 'UNKNOWN_ERROR';

export class InternalServerError extends ServerError {
  constructor(key: InternalErrorType, context?: Record<string, unknown>) {
    super(key, ErrorCode.InternalServerError, context);
  }
}

type ServiceUnavailableErrorType = 'S3_ERROR';

export class ServiceUnavailableError extends ServerError {
  constructor(key: ServiceUnavailableErrorType, context?: Record<string, unknown>) {
    super(key, ErrorCode.ServiceUnavailable, context);
  }
}

export function getErrorStatus(error: unknown): number {
  if (error instanceof ServerError) return error.error ? errors[error.error] : 500;
  return 500;
}
