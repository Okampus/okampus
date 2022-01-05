import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { assertPermissions } from '../shared/lib/utils/assertPermission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { PaginationOptions } from '../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { Tag } from '../tags/tag.entity';
import type { User } from '../users/user.entity';
import type { CreatePostDto } from './dto/create-post.dto';
import type { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostSearchService } from './post-search.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: BaseRepository<Post>,
    @InjectRepository(Tag) private readonly tagRepository: BaseRepository<Tag>,
    private readonly postSearchService: PostSearchService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(user: User, createPostDto: CreatePostDto): Promise<Post> {
    const post = new Post({ ...createPostDto, author: user });
    const tags = await this.tagRepository.find({ name: { $in: createPostDto.tags } });
    post.tags.add(...tags);
    await this.postRepository.persistAndFlush(post);
    // Await this.postIndexerService.add(post);
    return post;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<Post>> {
    // TODO: Maybe the user won't have access to all posts. There can be some restrictions
    // (i.e. "personal"/"sensitive" posts)
    return await this.postRepository.findWithPagination(paginationOptions, {}, { populate: ['tags'] });
  }

  public async findOne(postId: number): Promise<Post> {
    // TODO: Maybe the user won't have access to this post. There can be some restrictions
    // (i.e. "personal"/"sensitive" posts)
    return await this.postRepository.findOneOrFail({ postId }, ['tags']);
  }

  public async update(user: User, postId: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOneOrFail({ postId }, ['author', 'tags']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, post, Object.keys(updatePostDto));

    // If we try to unlock the post, then it is the only action that we can do.
    if (post.locked && updatePostDto?.locked === false)
      updatePostDto = { locked: false };

    const { tags: wantedTags, ...updatedProps } = updatePostDto;

    if (wantedTags) {
      if (wantedTags.length === 0) {
        post.tags.removeAll();
      } else {
        const tags = await this.tagRepository.find({ name: { $in: wantedTags } });
        post.tags.set(tags);
      }
    }

    if (updatedProps)
      wrap(post).assign(updatedProps);

    await this.postRepository.flush();
    await this.postSearchService.update(post);
    return post;
  }

  public async remove(user: User, postId: number): Promise<void> {
    const post = await this.postRepository.findOneOrFail({ postId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, post);

    await this.postRepository.removeAndFlush(post);
    // Await this.postIndexerService.remove(post.postId.toString());
  }
}
