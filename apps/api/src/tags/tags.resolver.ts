import { Args, Query, Resolver } from '@nestjs/graphql';
import { Tag } from './tag.entity';
import { TagsService } from './tags.service';

@Resolver(() => Tag)
export class TagsResolver {
  constructor(
    private readonly tagsService: TagsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => [Tag])
  public async tags(): Promise<Tag[]> {
    const paginatedTags = await this.tagsService.findAll();
    return paginatedTags.items;
  }

  @Query(() => Tag)
  public async tagById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Tag> {
    return await this.tagsService.findOne(id);
  }
}
