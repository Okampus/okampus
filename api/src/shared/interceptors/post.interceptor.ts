import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Post } from '../../posts/schemas/post.schema';

export type PostResponse = Pick<Post,
  | 'author'
  | 'body'
  | 'contentLastEditedAt'
  | 'createdAt'
  | 'downvotes'
  | 'favorites'
  | 'id'
  | 'locked'
  | 'opened'
  | 'tags'
  | 'title'
  | 'type'
  | 'updatedAt'
  | 'upvotes'
  | 'views'
>;

@Injectable()
export class PostInterceptor<T extends Post> implements NestInterceptor<T, PostResponse> {
  public intercept(context: ExecutionContext, next: CallHandler<T>): Observable<PostResponse> {
    return next
      .handle()
      .pipe(
        map(post => ({
          author: post.author,
          body: post.body,
          contentLastEditedAt: post.contentLastEditedAt,
          createdAt: post.createdAt,
          downvotes: post.downvotes,
          favorites: post.favorites,
          id: post.id,
          locked: post.locked,
          opened: post.opened,
          tags: post.tags,
          title: post.title,
          type: post.type,
          updatedAt: post.updatedAt,
          upvotes: post.upvotes,
          views: post.views,
        })),
      );
  }
}
