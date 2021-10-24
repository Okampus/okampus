import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Comment } from '../../comments/schemas/comment.schema';

export type CommentResponse = Pick<Comment,
  | 'body'
  | 'contentLastEditedAt'
  | 'createdAt'
  | 'downvotes'
  | 'id'
  | 'updatedAt'
  | 'upvotes'
>;

@Injectable()
export class CommentInterceptor<T extends Comment> implements NestInterceptor<T, CommentResponse> {
  public intercept(context: ExecutionContext, next: CallHandler<T>): Observable<CommentResponse> {
    return next
      .handle()
      .pipe(
        map(comment => ({
          body: comment.body,
          downvotes: comment.downvotes,
          upvotes: comment.upvotes,
          id: comment.id,
          createdAt: comment.createdAt,
          contentLastEditedAt: comment.contentLastEditedAt,
          updatedAt: comment.updatedAt,
        })),
      );
  }
}
