import type { Post } from '../../posts/entities/post.entity';
import type { Reply } from '../../replies/entities/reply.entity';

export type ContentOptions = { post: Post; reply?: never } | { reply: Reply; post?: never };

export type ContentIdsOptions = { postId: number; replyId?: never } | { replyId: string; postId?: never };
