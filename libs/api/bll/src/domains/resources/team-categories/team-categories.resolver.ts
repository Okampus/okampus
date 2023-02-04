import { PaginatedTeamCategoryModel, TeamCategoryModel } from '../../factories/domains/tags/team-category.model';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload-minimal';
import type { TeamCategoriesService } from './team-categories.service';
import type { CreateTeamCategoryDto, UpdateTeamCategoryDto } from '@okampus/shared/dtos';
import type { PaginationOptions } from '../../../shards/types/pagination-options.type';
import type { MulterFileType, Snowflake } from '@okampus/shared/types';

@Resolver(() => TeamCategoryModel)
export class TeamCategoriesResolver {
  constructor(private readonly teamCategoriesService: TeamCategoriesService) {}

  @Query(() => TeamCategoryModel)
  teamCategoryById(@Args('id', { type: () => String }) id: Snowflake) {
    return this.teamCategoriesService.findOneById(id);
  }

  @Query(() => TeamCategoryModel)
  teamCategoryBySlug(@Args('slug') slug: string) {
    return this.teamCategoriesService.findOneBySlug(slug);
  }

  @Query(() => PaginatedTeamCategoryModel)
  teamCategories(@Args('options', { nullable: true }) options: PaginationOptions) {
    return this.teamCategoriesService.find(options);
  }

  @Mutation(() => TeamCategoryModel)
  createTeamCategory(
    @Args('teamCategory') teamCategory: CreateTeamCategoryDto,
    @Args('iconImage', { type: () => GraphQLUpload, nullable: true }) iconImage?: MulterFileType
  ) {
    return this.teamCategoriesService.create(teamCategory, iconImage);
  }

  @Mutation(() => TeamCategoryModel)
  updateTeamCategory(@Args('updateTeamCategory') updateTeamCategory: UpdateTeamCategoryDto) {
    return this.teamCategoriesService.update(updateTeamCategory);
  }

  @Mutation(() => Boolean)
  deleteTeamCategory(@Args('id', { type: () => String }) id: Snowflake) {
    return this.teamCategoriesService.delete(id);
  }
}
