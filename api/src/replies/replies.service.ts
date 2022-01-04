import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Post } from '../posts/entities/post.entity';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { assertPermissions } from '../shared/lib/utils/assertPermission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { PaginationOptions } from '../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import type { User } from '../users/user.entity';
import type { CreateReplyDto } from './dto/create-reply.dto';
import type { UpdateReplyDto } from './dto/update-reply.dto';
import { Reply } from './entities/reply.entity';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: BaseRepository<Post>,
    @InjectRepository(Reply) private readonly replyRepository: BaseRepository<Reply>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(user: User, postId: number, createReplyDto: CreateReplyDto): Promise<Reply> {
    const post = await this.postRepository.findOneOrFail({ postId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, post);

    const reply = new Reply({ post, body: createReplyDto.body, author: user });
    await this.replyRepository.persistAndFlush(reply);
    return reply;
  }

  public async findAll(postId: number, paginationOptions?: PaginationOptions): Promise<PaginatedResult<Reply>> {
    // TODO: Maybe the user won't have access to all replies. There can be some restrictions
    // (i.e. "personal"/"sensitive" posts)
    // TODO: Add pagination
    return await this.replyRepository.findWithPagination(
      paginationOptions,
      { post: { postId } },
      { populate: ['author', 'post'] },
    );
  }

  public async findOne(replyId: string): Promise<Reply | null> {
    // TODO: Maybe the user won't have access to all replies. There can be some restrictions
    // (i.e. "personal"/"sensitive" posts)
    return await this.replyRepository.findOneOrFail({ replyId }, ['author', 'post']);
  }

  public async update(user: User, replyId: string, updateReplyDto: UpdateReplyDto): Promise<Reply> {
    const reply = await this.replyRepository.findOneOrFail({ replyId }, ['author', 'post']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, reply);

    wrap(reply).assign(updateReplyDto);
    await this.replyRepository.flush();
    return reply;
  }

  public async remove(user: User, replyId: string): Promise<void> {
    const reply = await this.replyRepository.findOneOrFail({ replyId }, ['author', 'post']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, reply);

    await this.replyRepository.removeAndFlush(reply);
  }
}
