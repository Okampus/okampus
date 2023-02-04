import { CreateTeamCategoryCommand } from './commands/create-team-category/create-team-category.command';
import { DeleteTeamCategoryCommand } from './commands/delete-team-category/delete-team-category.command';
import { UpdateTeamCategoryCommand } from './commands/update-team-category/update-team-category.command';
import { GetTeamCategoryByIdQuery } from './queries/get-team-category-by-id/get-team-category-by-id.query';
import { GetTeamCategoryBySlugQuery } from './queries/get-team-category-by-slug/get-team-category-by-slug.query';
import { GetTeamCategoriesQuery } from './queries/get-team-categories/get-team-categories.query';
import { RequestContext } from '../../../shards/request-context/request-context';
import { Injectable } from '@nestjs/common';
import type { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { CreateTeamCategoryDto, UpdateTeamCategoryDto } from '@okampus/shared/dtos';
import type { MulterFileType, Snowflake } from '@okampus/shared/types';
import type { PaginationOptions } from '../../../shards/types/pagination-options.type';
import type { PaginatedTeamCategoryModel, TeamCategoryModel } from '../../factories/domains/tags/team-category.model';

const defaultTeamCategoryPopulate = ['actor', 'actor.images', 'actor.socials', 'actor.tags'];

@Injectable()
export class TeamCategoriesService extends RequestContext {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
    super();
  }

  findOneById(id: Snowflake): Promise<TeamCategoryModel> {
    const query = new GetTeamCategoryByIdQuery(id, this.tenant(), this.autoGqlPopulate(defaultTeamCategoryPopulate));
    return this.queryBus.execute(query);
  }

  findOneBySlug(slug: Snowflake): Promise<TeamCategoryModel> {
    const query = new GetTeamCategoryBySlugQuery(
      slug,
      this.tenant(),
      this.autoGqlPopulate(defaultTeamCategoryPopulate)
    );
    return this.queryBus.execute(query);
  }

  find(paginationOptions: PaginationOptions): Promise<PaginatedTeamCategoryModel> {
    const query = new GetTeamCategoriesQuery(
      paginationOptions,
      this.tenant(),
      this.autoGqlPopulate(defaultTeamCategoryPopulate)
    );
    return this.queryBus.execute(query);
  }

  create(createTeamCategory: CreateTeamCategoryDto, iconImage?: MulterFileType): Promise<TeamCategoryModel> {
    const command = new CreateTeamCategoryCommand(createTeamCategory, this.tenant(), this.requester(), iconImage);
    return this.commandBus.execute(command);
  }

  update(updateTeamCategory: UpdateTeamCategoryDto): Promise<TeamCategoryModel> {
    const command = new UpdateTeamCategoryCommand(
      updateTeamCategory,
      this.tenant(),
      this.autoGqlPopulate(defaultTeamCategoryPopulate)
    );
    return this.commandBus.execute(command);
  }

  delete(id: Snowflake) {
    const command = new DeleteTeamCategoryCommand(id, this.tenant());
    return this.commandBus.execute(command);
  }
}
