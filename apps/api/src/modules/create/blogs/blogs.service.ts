import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import type { ContentListOptionsDto } from '@common/lib/dto/list-options.dto';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { assertPermissions } from '@common/lib/utils/assert-permission';
import { Action } from '@common/modules/authorization';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import type { PaginatedNodes } from '@common/modules/pagination';
import { Tag } from '@modules/catalog/tags/tag.entity';
import type { CreateBlogDto } from '@modules/create/blogs/dto/create-blog.dto';
import type { User } from '@modules/uaa/users/user.entity';
import { ContentsService } from '../contents/contents.service';
import { Content } from '../contents/entities/content.entity';
import { Blog } from './blog.entity';
import type { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: BaseRepository<Blog>,
    @InjectRepository(Content)
    private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(Tag) private readonly tagRepository: BaseRepository<Tag>,
    private readonly contentsService: ContentsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(user: User, createBlogDto: CreateBlogDto): Promise<Blog> {
    const post = await this.contentsService.createPost(user, createBlogDto);
    const blog = new Blog({
      ...createBlogDto,
      post,
      slug: slugify(createBlogDto.slug ?? createBlogDto.title),
      location: createBlogDto?.location?.split(',').map(Number) as
        | [lat: number, lon: number]
        | undefined,
    });
    post.contentMaster = blog;

    // TODO: Keep the original order
    const tags = await this.tagRepository.find({
      name: { $in: createBlogDto.tags },
    });
    blog.tags.add(...tags);

    await this.contentRepository.flush();
    await this.blogRepository.persistAndFlush(blog);

    return blog;
  }

  public async findAll(
    user: User,
    options?: Required<ContentListOptionsDto>,
  ): Promise<PaginatedNodes<Blog>> {
    const canSeeHiddenContent = this.caslAbilityFactory.isModOrAdmin(user);
    const visibilityQuery = canSeeHiddenContent
      ? {}
      : { post: { isVisible: true } };
    return await this.blogRepository.findWithPagination(
      options,
      visibilityQuery,
      {
        populate: ['post', 'tags'],
        // FIXME: Enable orderBy with pagination
        // orderBy: { post: serializeOrder(options?.sortBy) },
      },
    );
  }

  public async findOne(user: User, id: number): Promise<Blog> {
    const blog: Blog & { contents?: Content[] } = await this.blogRepository.findOneOrFail(
        { id },
        { populate: ['tags', 'participants'] },
      );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, blog);

    const contents = await this.contentRepository.find(
      { contentMaster: blog },
      { populate: ['author', 'lastEdit'] },
    );
    blog.contents = contents;

    return blog;
  }

  public async update(
    user: User,
    id: number,
    updateBlogDto: UpdateBlogDto,
  ): Promise<Blog> {
    const blog = await this.blogRepository.findOneOrFail(
      { id },
      { populate: ['post', 'tags'] },
    );

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
        // TODO: Keep the original order
        const tags = await this.tagRepository.find({
          name: { $in: wantedTags },
        });
        blog.tags.set(tags);
      }
    }

    if (updatedProps)
wrap(blog).assign(updatedProps);

    await this.blogRepository.flush();
    return blog;
  }

  public async remove(user: User, id: number): Promise<void> {
    const blog = await this.blogRepository.findOneOrFail({ id });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, blog);

    await this.blogRepository.removeAndFlush(blog);
  }
}
