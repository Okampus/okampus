import { Args, Query, Resolver } from '@nestjs/graphql';
import { App, PaginatedApp } from './app.entity';
import { AppsService } from './apps.service';

@Resolver(() => App)
export class AppsResolver {
  constructor(
    private readonly appsService: AppsService,
  ) {}

  @Query(() => PaginatedApp)
  public async apps(): Promise<PaginatedApp> {
    return await this.appsService.findAll();
  }

  @Query(() => App)
  public async appById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<App> {
    return await this.appsService.findOne(id);
  }
}
