import { Args, Query, Resolver } from '@nestjs/graphql';
import { PaginationOptions } from '@common/modules/pagination';
import { PaginatedTags, Tag } from './tag.entity';
import { TagsService } from './tags.service';

@Resolver(() => Tag)
export class TagsResolver {
  constructor(
    private readonly tagsService: TagsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => PaginatedTags)
  public async tags(
    @Args('query', { nullable: true }) query: PaginationOptions,
  ): Promise<PaginatedTags> {
    return await this.tagsService.findAll(query);
  }

  @Query(() => Tag)
  public async tagById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Tag> {
    return await this.tagsService.findOne(id);
  }
}
