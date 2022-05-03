import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { ContentsService } from '../contents/contents.service';
import { Content } from '../contents/entities/content.entity';
import type { ContentListOptionsDto } from '../shared/lib/dto/list-options.dto';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { ContentMasterType } from '../shared/lib/types/enums/content-master-type.enum';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { PaginatedResult } from '../shared/modules/pagination';
import { serializeOrder } from '../shared/modules/sorting';
import { Tag } from '../tags/tag.entity';
import type { User } from '../users/user.entity';
import { BlogSearchService } from './blog-search.service';
import { Blog } from './blog.entity';
import type { CreateBlogDto } from './dto/create-blog.dto';
import type { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: BaseRepository<Blog>,
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(Tag) private readonly tagRepository: BaseRepository<Tag>,
    private readonly contentsService: ContentsService,
    private readonly blogSearchService: BlogSearchService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(user: User, createBlogDto: CreateBlogDto): Promise<Blog> {
    const blog = new Blog({
      ...createBlogDto,
      slug: slugify(createBlogDto.slug ?? createBlogDto.title),
      location: createBlogDto?.location?.split(',').map(Number) as [lat: number, lon: number] | undefined,
    });

    // TODO: Keep the original order
    const tags = await this.tagRepository.find({ name: { $in: createBlogDto.tags } });
    blog.tags.add(...tags);

    blog.post = await this.contentsService.createPost(user, blog, {
      ...createBlogDto,
      contentMasterType: ContentMasterType.Blog,
    });

    await this.blogRepository.persistAndFlush(blog);
    await this.blogSearchService.add(blog);
    return blog;
  }

  public async findAll(user: User, options?: Required<ContentListOptionsDto>): Promise<PaginatedResult<Blog>> {
    const canSeeHiddenContent = this.caslAbilityFactory.canSeeHiddenContent(user);
    const visibilityQuery = canSeeHiddenContent ? {} : { post: { isVisible: true } };
    return await this.blogRepository.findWithPagination(
      options,
      visibilityQuery,
      { populate: ['post', 'tags'], orderBy: { post: serializeOrder(options?.sortBy) } },
    );
  }

  public async findOne(user: User, contentMasterId: number): Promise<Blog> {
    const blog: Blog & { contents?: Content[] } = await this.blogRepository.findOneOrFail(
      { contentMasterId },
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
        // TODO: Keep the original order
        const tags = await this.tagRepository.find({ name: { $in: wantedTags } });
        blog.tags.set(tags);
      }
    }

    if (updatedProps)
      wrap(blog).assign(updatedProps);

    await this.blogRepository.flush();
    await this.blogSearchService.update(blog);
    return blog;
  }

  public async remove(user: User, contentMasterId: number): Promise<void> {
    const blog = await this.blogRepository.findOneOrFail({ contentMasterId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, blog);

    await this.blogRepository.removeAndFlush(blog);
    await this.blogSearchService.remove(blog.contentMasterId.toString());
  }
}
