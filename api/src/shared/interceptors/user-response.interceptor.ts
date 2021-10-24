import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Comment } from '../../comments/schemas/comment.schema';
import type { Reply } from '../../replies/schemas/reply.schema';

export type UserResponseResponse = Pick<Comment | Reply,
  | 'body'
  | 'contentLastEditedAt'
  | 'createdAt'
  | 'downvotes'
  | 'id'
  | 'updatedAt'
  | 'upvotes'
>;

@Injectable()
export class UserResponseInterceptor<T extends Comment | Reply> implements NestInterceptor<T, UserResponseResponse> {
  public intercept(context: ExecutionContext, next: CallHandler<T>): Observable<UserResponseResponse> {
    return next
      .handle()
      .pipe(
        map(userResponse => ({
          body: userResponse.body,
          downvotes: userResponse.downvotes,
          upvotes: userResponse.upvotes,
          id: userResponse.id,
          createdAt: userResponse.createdAt,
          contentLastEditedAt: userResponse.contentLastEditedAt,
          updatedAt: userResponse.updatedAt,
        })),
      );
  }
}
