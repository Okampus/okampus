import { Args, Query, Resolver } from '@nestjs/graphql';
import { App } from './app.entity';
import { AppsService } from './apps.service';

@Resolver(() => App)
export class AppsResolver {
  constructor(
    private readonly appsService: AppsService,
  ) {}

  @Query(() => [App])
  public async apps(): Promise<App[]> {
    const paginatedTags = await this.appsService.findAll();
    return paginatedTags.items;
  }

  @Query(() => App)
  public async appById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<App> {
    return await this.appsService.findOne(id);
  }
}
