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
import { User } from '../users/user.entity';
import type { CreatePostDto } from './dto/create-post.dto';
import type { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostSearchService } from './post-search.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: BaseRepository<Post>,
    @InjectRepository(Tag) private readonly tagRepository: BaseRepository<Tag>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    private readonly postSearchService: PostSearchService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(user: User, createPostDto: CreatePostDto): Promise<Post> {
    const post = new Post({ ...createPostDto, author: user });

    const tags = await this.tagRepository.find({ name: { $in: createPostDto.tags } });
    post.tags.add(...tags);

    const assignees = await this.userRepository.find({ userId: { $in: createPostDto.assignees } });
    post.assignees.add(...assignees);

    await this.postRepository.persistAndFlush(post);
    await this.postSearchService.add(post);
    return post;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<Post>> {
    // TODO: Maybe the user won't have access to all posts. There can be some restrictions
    // (i.e. "personal"/"sensitive" posts)
    return await this.postRepository.findWithPagination(paginationOptions, {}, { populate: ['tags', 'assignees'] });
  }

  public async findOne(postId: number): Promise<Post> {
    // TODO: Maybe the user won't have access to this post. There can be some restrictions
    // (i.e. "personal"/"sensitive" posts)
    return await this.postRepository.findOneOrFail({ postId }, ['tags', 'assignees']);
  }

  public async update(user: User, postId: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOneOrFail({ postId }, ['author', 'tags', 'assignees']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, post, Object.keys(updatePostDto));

    // If we try to unlock the post, then it is the only action that we can do.
    if (post.locked && updatePostDto?.locked === false)
      updatePostDto = { locked: false };

    const { tags: wantedTags, assignees: wantedAssignees, ...updatedProps } = updatePostDto;

    if (wantedTags) {
      if (wantedTags.length === 0) {
        post.tags.removeAll();
      } else {
        const tags = await this.tagRepository.find({ name: { $in: wantedTags } });
        post.tags.set(tags);
      }
    }

    if (wantedAssignees) {
      if (wantedAssignees.length === 0) {
        post.assignees.removeAll();
      } else {
        const assignees = await this.userRepository.find({ userId: { $in: wantedAssignees } });
        post.assignees.set(assignees);
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
    await this.postSearchService.remove(post.postId.toString());
  }

  public async addTags(postId: number, newTags: string[]): Promise<Post> {
    const post = await this.postRepository.findOneOrFail({ postId }, ['author', 'tags', 'assignees']);

    const tags = await this.tagRepository.find({ name: { $in: newTags } });
    post.tags.add(...tags);
    await this.postRepository.flush();
    await this.postSearchService.update(post);
    return post;
  }

  public async removeTags(postId: number, droppedTags: string[]): Promise<void> {
    const post = await this.postRepository.findOneOrFail({ postId }, ['tags']);

    const tags = await this.tagRepository.find({ name: { $in: droppedTags } });
    post.tags.remove(...tags);
    await this.postRepository.flush();
    await this.postSearchService.update(post);
  }

  public async addAssignees(postId: number, assignees: string[]): Promise<Post> {
    const post = await this.postRepository.findOneOrFail({ postId }, ['author', 'tags', 'assignees']);

    const users = await this.userRepository.find({ userId: { $in: assignees } });
    post.assignees.add(...users.filter(user => !post.assignees.contains(user)));
    await this.postRepository.flush();
    return post;
  }

  public async removeAssignees(postId: number, assignees: string[]): Promise<void> {
    const post = await this.postRepository.findOneOrFail({ postId }, ['assignees']);

    const users = await this.userRepository.find({ userId: { $in: assignees } });
    post.assignees.remove(...users);
    await this.postRepository.flush();
  }
}
