import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Post } from '../../posts/schemas/post.schema';

export type PostResponse = Pick<Post,
  | 'body'
  | 'contentLastEditedAt'
  | 'createdAt'
  | 'downvotes'
  | 'id'
  | 'locked'
  | 'opened'
  | 'title'
  | 'updatedAt'
  | 'upvotes'
>;

@Injectable()
export class PostInterceptor<T extends Post> implements NestInterceptor<T, PostResponse> {
  public intercept(context: ExecutionContext, next: CallHandler<T>): Observable<PostResponse> {
    return next
      .handle()
      .pipe(
        map(post => ({
          title: post.title,
          body: post.body,
          downvotes: post.downvotes,
          upvotes: post.upvotes,
          opened: post.opened,
          locked: post.locked,
          id: post.id,
          createdAt: post.createdAt,
          contentLastEditedAt: post.contentLastEditedAt,
          updatedAt: post.updatedAt,
        })),
      );
  }
}
