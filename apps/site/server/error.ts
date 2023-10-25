import type { TokenType } from '@okampus/shared/enums';

export const errors = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  InternalServerError: 500,
  ServiceUnavailable: 503,
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
  error?: keyof typeof errors;
  context?: { field?: string } & Record<string, unknown>;

  constructor(key: ErrorType, error?: keyof typeof errors, context?: Record<string, unknown>) {
    super(`${error}: ${key} ${JSON.stringify(context)}`);
    this.key = key;
    this.error = error || 'InternalServerError';
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
    super(key, 'Unauthorized', context);
  }
}

type BadRequestErrorType = 'MISSING_FIELD' | 'INVALID_FIELD' | 'MISSING_HEADER' | 'INVALID_HEADER';

export class BadRequestError extends ServerError {
  constructor(key: BadRequestErrorType, context?: Record<string, unknown>) {
    super(key, 'BadRequest', context);
  }
}

type ForbiddenErrorType = 'UNAUTHORIZED_TEAM' | 'UNAUTHORIZED_TENANT';

export class ForbiddenError extends ServerError {
  constructor(key: ForbiddenErrorType, context?: Record<string, unknown>) {
    super(key, 'Forbidden', context);
  }
}

type NotFoundErrorType = 'NOT_FOUND_TENANT' | 'NOT_FOUND_TEAM' | 'NOT_FOUND_USER' | 'NOT_FOUND';

export class NotFoundError extends ServerError {
  constructor(key: NotFoundErrorType, context?: Record<string, unknown>) {
    super(key, 'NotFound', context);
  }
}

type InternalErrorType = 'UNEXPECTED_ERROR' | 'UNKNOWN_ERROR';

export class InternalServerError extends ServerError {
  constructor(key: InternalErrorType, context?: Record<string, unknown>) {
    super(key, 'InternalServerError', context);
  }
}

type ServiceUnavailableErrorType = 'S3_ERROR';

export class ServiceUnavailableError extends ServerError {
  constructor(key: ServiceUnavailableErrorType, context?: Record<string, unknown>) {
    super(key, 'ServiceUnavailable', context);
  }
}
