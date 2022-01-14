import type { Article } from '../../articles/entities/article.entity';
import type { Post } from '../../posts/entities/post.entity';
import type { Reply } from '../../replies/entities/reply.entity';

export type ContentOptions =
  | { post: Post; reply?: never; article?: never }
  | { post?: never; reply: Reply; article?: never }
  | { post?: never; reply?: never; article: Article };

export type ContentIdsOptions =
  | { postId: number; replyId?: never; articleId?: never }
  | { postId?: never; replyId: string; articleId?: never }
  | { postId?: never; replyId?: never; articleId: number };
