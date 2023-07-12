import { Injectable } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { addRequestDataToEvent } from '@sentry/node';

import Sentry from '@sentry/node';

import type { Scope } from '@sentry/node';
import type { CallHandler, ExecutionContext, HttpException, NestInterceptor } from '@nestjs/common';
import type { HttpArgumentsHost, WsArgumentsHost, RpcArgumentsHost, ContextType } from '@nestjs/common/interfaces';
import type { Observable } from 'rxjs';

export interface SentryInterceptorOptionsFilter {
  type: unknown;
  filter?: (exception: unknown) => boolean;
}

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const error = (exception: HttpException) =>
      this.shouldReport(exception) && Sentry.withScope((scope) => this.captureException(context, scope, exception));

    return next.handle().pipe(tap({ error }));
  }

  protected captureException(context: ExecutionContext, scope: Scope, exception: HttpException) {
    switch (context.getType<ContextType>()) {
      case 'http': {
        return this.captureHttpException(scope, context.switchToHttp(), exception);
      }
      case 'rpc': {
        return this.captureRpcException(scope, context.switchToRpc(), exception);
      }
      case 'ws': {
        return this.captureWsException(scope, context.switchToWs(), exception);
      }
    }
  }

  private captureHttpException(scope: Scope, http: HttpArgumentsHost, exception: HttpException): void {
    const data = addRequestDataToEvent({}, http.getRequest(), {});

    scope.setExtra('req', data.request);

    if (data.extra) scope.setExtras(data.extra);
    if (data.user) scope.setUser(data.user);

    Sentry.captureException(exception);
  }

  private captureRpcException(scope: Scope, rpc: RpcArgumentsHost, exception: unknown): void {
    scope.setExtra('rpc_data', rpc.getData());
    Sentry.captureException(exception);
  }

  private captureWsException(scope: Scope, ws: WsArgumentsHost, exception: unknown): void {
    scope.setExtra('ws_client', ws.getClient());
    scope.setExtra('ws_data', ws.getData());
    Sentry.captureException(exception);
  }

  private shouldReport(_exception: unknown) {
    return true;
  }
}
