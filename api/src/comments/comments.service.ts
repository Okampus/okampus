import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Post } from '../posts/entities/post.entity';
import { Reply } from '../replies/entities/reply.entity';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { assertPermissions } from '../shared/lib/utils/assertPermission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { PaginationOptions } from '../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import type { User } from '../users/user.entity';
import type { CreateCommentDto } from './dto/create-comment.dto';
import type { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: BaseRepository<Post>,
    @InjectRepository(Reply) private readonly replyRepository: BaseRepository<Reply>,
    @InjectRepository(Comment) private readonly commentRepository: BaseRepository<Comment>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async createUnderReply(user: User, replyId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
    const reply = await this.replyRepository.findOneOrFail({ replyId }, ['author', 'post']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, reply);

    const comment = new Comment({
      body: createCommentDto.body,
      reply,
      post: reply.post,
      author: user,
    });
    await this.commentRepository.persistAndFlush(comment);
    return comment;
  }

  public async createUnderPost(user: User, postId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const post = await this.postRepository.findOneOrFail({ postId }, ['author', 'tags']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, post);

    const comment = new Comment({
      body: createCommentDto.body,
      post,
      author: user,
    });
    await this.commentRepository.persistAndFlush(comment);
    return comment;
  }

  public async findAllUnderReply(replyId: string): Promise<Comment[]> {
    // TODO: Maybe the user won't have access to all comments. There can be some restrictions
    // (i.e. "personal"/"sensitive" posts)
    // TODO: Add pagination
    return await this.commentRepository.find({ reply: { replyId } }, ['author', 'post', 'reply']);
  }

  public async findAllUnderPost(
    postId: number,
    paginationOptions?: PaginationOptions,
  ): Promise<PaginatedResult<Comment>> {
    // TODO: Maybe the user won't have access to all comments. There can be some restrictions
    // (i.e. "personal"/"sensitive" posts)
    // TODO: Add pagination
    return await this.commentRepository.findWithPagination(
      paginationOptions,
      { post: { postId } },
      { populate: ['author', 'post', 'reply'] },
    );
  }

  public async findOne(commentId: string): Promise<Comment | null> {
    // TODO: Maybe the user won't have access to all comments. There can be some restrictions
    // (i.e. "personal"/"sensitive" posts)
    return await this.commentRepository.findOneOrFail({ commentId }, ['author', 'post', 'reply']);
  }

  public async update(user: User, commentId: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepository.findOneOrFail({ commentId }, ['author', 'post', 'reply']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, comment);

    wrap(comment).assign(updateCommentDto);
    await this.commentRepository.flush();
    return comment;
  }

  public async remove(user: User, commentId: string): Promise<void> {
    const comment = await this.commentRepository.findOneOrFail({ commentId }, ['author', 'post', 'reply']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, comment);

    await this.commentRepository.removeAndFlush(comment);
  }
}
