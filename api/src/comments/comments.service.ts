import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Reply } from '../replies/entities/reply.entity';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { assertPermissions } from '../shared/lib/utils/assertPermission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { User } from '../users/user.entity';
import type { CreateCommentDto } from './dto/create-comment.dto';
import type { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Reply) private readonly replyRepository: BaseRepository<Reply>,
    @InjectRepository(Comment) private readonly commentRepository: BaseRepository<Comment>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(user: User, replyId: string, createCommentDto: CreateCommentDto): Promise<Comment> {
    const reply = await this.replyRepository.findOne({ replyId }, ['author', 'post']);
    if (!reply)
      throw new NotFoundException('Reply not found');

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Create, reply);

    const comment = new Comment({
      body: createCommentDto.body,
      reply,
      post: reply.post,
      author: user,
    });
    await this.commentRepository.persistAndFlush(comment);
    return comment;
  }

  public async findAll(replyId: string): Promise<Comment[]> {
    // TODO: Maybe the user won't have access to all comments. There can be some restrictions
    // (i.e. "personal"/"sensitive" posts)
    // TODO: Add pagination
    return await this.commentRepository.find({ reply: { replyId } }, ['author', 'post', 'reply']);
  }

  public async findOne(commentId: string): Promise<Comment | null> {
    // TODO: Maybe the user won't have access to all comments. There can be some restrictions
    // (i.e. "personal"/"sensitive" posts)
    const comment = await this.commentRepository.findOne({ commentId }, ['author', 'post', 'reply']);
    if (!comment)
      throw new NotFoundException('Comment not found');
    return comment;
  }

  public async update(user: User, commentId: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ commentId }, ['author', 'post', 'reply']);
    if (!comment)
      throw new NotFoundException('Comment not found');

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, comment);

    wrap(comment).assign(updateCommentDto);
    await this.commentRepository.flush();
    return comment;
  }

  public async remove(user: User, commentId: string): Promise<void> {
    const comment = await this.commentRepository.findOne({ commentId }, ['author', 'post', 'reply']);
    if (!comment)
      throw new NotFoundException('Comment not found');

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, comment);

    await this.commentRepository.removeAndFlush(comment);
  }
}
