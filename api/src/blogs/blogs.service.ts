import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { ContentsService } from '../contents/contents.service';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { ContentMasterType } from '../shared/lib/types/content-master-type.enum';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { PaginationOptions } from '../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { Tag } from '../tags/tag.entity';
import type { User } from '../users/user.entity';
import { Blog } from './blog.entity';
import type { CreateBlogDto } from './dto/create-blog.dto';
import type { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: BaseRepository<Blog>,
    @InjectRepository(Tag) private readonly tagRepository: BaseRepository<Tag>,
    private readonly contentsService: ContentsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(user: User, createBlogDto: CreateBlogDto): Promise<Blog> {
    const blog = new Blog({
      ...createBlogDto,
      slug: slugify(createBlogDto.slug ?? createBlogDto.title),
      location: createBlogDto?.location?.split(',').map(Number) as [lat: number, lon: number] | undefined,
    });

    const tags = await this.tagRepository.find({ name: { $in: createBlogDto.tags } });
    blog.tags.add(...tags);

    blog.post = await this.contentsService.createPost(user, blog, {
      ...createBlogDto,
      contentMasterType: ContentMasterType.Blog,
    });

    await this.blogRepository.persistAndFlush(blog);
    return blog;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<Blog>> {
    // TODO: Maybe the user won't have access to all blogs. There can be some restrictions
    // (i.e. "personal"/"sensitive" blogs)
    return await this.blogRepository.findWithPagination(paginationOptions, {}, { populate: ['post', 'tags'] });
  }

  public async findOne(contentMasterId: number): Promise<Blog> {
    // TODO: Maybe the user won't have access to this blog. There can be some restrictions
    // (i.e. "personal"/"sensitive" blogs)
    return await this.blogRepository.findOneOrFail(
      { contentMasterId },
      { populate: ['post', 'post.children', 'post.children.children', 'tags', 'participants'] },
    );
  }

  public async update(user: User, contentMasterId: number, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.blogRepository.findOneOrFail({ contentMasterId }, { populate: ['post', 'tags'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, blog, Object.keys(updateBlogDto));

    // If we try to unlock the blog, then it is the only action that we can do.
    if (blog.locked && updateBlogDto?.locked === false)
      updateBlogDto = { locked: false };

    const { tags: wantedTags, ...updatedProps } = updateBlogDto;

    if (wantedTags) {
      if (wantedTags.length === 0) {
        blog.tags.removeAll();
      } else {
        const tags = await this.tagRepository.find({ name: { $in: wantedTags } });
        blog.tags.set(tags);
      }
    }

    if (updatedProps)
      wrap(blog).assign(updatedProps);

    await this.blogRepository.flush();
    return blog;
  }

  public async remove(user: User, contentMasterId: number): Promise<void> {
    const blog = await this.blogRepository.findOneOrFail({ contentMasterId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, blog);

    await this.blogRepository.removeAndFlush(blog);
  }
}
