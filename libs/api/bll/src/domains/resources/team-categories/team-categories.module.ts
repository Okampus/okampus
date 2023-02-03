import { Module } from '@nestjs/common';
import { TeamCategoriesService } from './team-categories.service';
import { TeamCategoriesResolver } from './team-categories.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTeamCategoryHandler } from './commands/create-team-category/create-team-category.handler';
import { GetTeamCategoryByIdHandler } from './queries/get-team-category-by-id/get-team-category-by-id.handler';
import { GetTeamCategoriesHandler } from './queries/get-team-categories/get-team-categories.handler';
import { UpdateTeamCategoryHandler } from './commands/update-team-category/update-team-category.handler';
import { DeleteTeamCategoryHandler } from './commands/delete-team-category/delete-team-category.handler';
import { GetTeamCategoryBySlugHandler } from './queries/get-team-category-by-slug/get-team-category-by-slug.handler';

const commandHandlers = [CreateTeamCategoryHandler, UpdateTeamCategoryHandler, DeleteTeamCategoryHandler];
const queryHandlers = [GetTeamCategoryByIdHandler, GetTeamCategoriesHandler, GetTeamCategoryBySlugHandler];

@Module({
  imports: [CqrsModule],
  providers: [TeamCategoriesResolver, TeamCategoriesService, ...commandHandlers, ...queryHandlers],
  exports: [TeamCategoriesService],
})
export class TeamCategoriesModule {}
