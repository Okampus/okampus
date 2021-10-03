import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { User } from '../../users/user.schema';

type UserResponse = Pick<User, 'createdAt' | 'email' | 'username'>;

@Injectable()
export class UserInterceptor<T extends User> implements NestInterceptor<T, UserResponse> {
  public intercept(context: ExecutionContext, next: CallHandler<T>): Observable<UserResponse> {
    return next
      .handle()
      .pipe(
        map(user => ({
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
        })),
      );
  }
}
