import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Comment } from '../../comments/comment.schema';
import type { CommentResponse } from './comment.interceptor';

type CommentsResponse = CommentResponse[];

@Injectable()
export class CommentsInterceptor<T extends Comment[]> implements NestInterceptor<T, CommentsResponse> {
  public intercept(context: ExecutionContext, next: CallHandler<T>): Observable<CommentsResponse> {
    return next
      .handle()
      .pipe(
        map(result => result?.map(comment => ({
          body: comment.body,
          downvotes: comment.downvotes,
          upvotes: comment.upvotes,
          id: comment.id,
          createdAt: comment.createdAt,
          contentLastEditedAt: comment.contentLastEditedAt,
          updatedAt: comment.updatedAt,
        })) ?? []),
      );
  }
}
