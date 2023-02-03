import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import {
  TenantCore,
  TeamCategory,
  TeamCategoryRepository,
  TeamCategoryOptions,
  Team,
  Individual,
  TeamRepository,
  TagRepository,
} from '@okampus/api/dal';
import { CreateTeamCategoryDto, ITeamCategory } from '@okampus/shared/dtos';
// import { loadTeamCategory } from '../loader.utils';
import { BaseFactory } from '../../base.factory';
import { TeamCategoryModel } from './team-category.model';
import { MulterFileType } from '@okampus/shared/types';
import { UploadService } from '../../../../features/uploads/upload.service';
import { S3Buckets } from '@okampus/shared/enums';
import { asyncCallIfNotNull, toSlug } from '@okampus/shared/utils';

@Injectable()
export class TeamCategoryFactory extends BaseFactory<
  TeamCategoryModel,
  TeamCategory,
  ITeamCategory,
  TeamCategoryOptions
> {
  constructor(
    @Inject(EventPublisher) ep: EventPublisher,
    private readonly teamRepository: TeamRepository,
    private readonly tagRepository: TagRepository,
    private readonly uploadService: UploadService,
    teamCategoryRepository: TeamCategoryRepository
  ) {
    super(ep, teamCategoryRepository, TeamCategoryModel, TeamCategory);
  }

  async createTeamCategory(
    createTeamCategory: CreateTeamCategoryDto,
    requester: Individual,
    tenant: TenantCore,
    iconImageFile?: MulterFileType
  ) {
    /* Ensure that slug is unique the tenant */
    const baseSlug = createTeamCategory.slug ?? toSlug(createTeamCategory.name);
    const slug = await this.tagRepository.ensureUniqueSlug(baseSlug, tenant.id);

    const [teams, iconImage] = await Promise.all([
      this.teamRepository.findByIds(createTeamCategory.teamsIds),
      asyncCallIfNotNull(iconImageFile, (file) =>
        this.uploadService.createImageUpload(tenant, file, S3Buckets.Attachments)
      ),
    ]);

    return this.create({
      ...createTeamCategory,
      slug,
      teams,
      tenant,
      iconImage,
    });
  }

  // entityToModel(entity: TeamCategory): TeamCategoryModel | undefined {
  //   const teamCategory = loadTeamCategory(entity);
  //   if (!teamCategory) return undefined;
  //   return this.createModel(teamCategory);
  // }

  modelToEntity(model: Required<TeamCategoryModel>): TeamCategory {
    return new TeamCategory({
      color: model.color,
      name: model.name,
      slug: model.slug,
      description: model.description,
      teams: model.teams.map((team) => ({ id: team.id } as Team)),
      tenant: { id: model.tenant.id } as TenantCore,
    });
  }
}