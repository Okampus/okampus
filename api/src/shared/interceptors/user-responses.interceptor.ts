import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Comment } from '../../comments/schemas/comment.schema';
import type { Reply } from '../../replies/schemas/reply.schema';
import type { UserResponseResponse } from './user-response.interceptor';

type UserResponsesResponse = UserResponseResponse[];

@Injectable()
export class UserResponsesInterceptor<T extends Comment[] | Reply[]>
  implements NestInterceptor<T, UserResponsesResponse> {
  public intercept(context: ExecutionContext, next: CallHandler<T>): Observable<UserResponsesResponse> {
    return next
      .handle()
      .pipe(
        map(result => result?.map(userResponse => ({
          body: userResponse.body,
          downvotes: userResponse.downvotes,
          upvotes: userResponse.upvotes,
          id: userResponse.id,
          createdAt: userResponse.createdAt,
          contentLastEditedAt: userResponse.contentLastEditedAt,
          updatedAt: userResponse.updatedAt,
        })) ?? []),
      );
  }
}
