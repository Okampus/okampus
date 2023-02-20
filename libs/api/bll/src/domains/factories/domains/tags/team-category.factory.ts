import { TeamCategoryModel } from './team-category.model';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamCategoryRepository, TeamRepository, TagRepository } from '@okampus/api/dal';
import { Team, TeamCategory, TenantCore } from '@okampus/api/dal';
import { S3Buckets } from '@okampus/shared/enums';
import { asyncCallIfNotNull, toSlug } from '@okampus/shared/utils';

import type { TeamCategoryOptions, Individual } from '@okampus/api/dal';
import type { CreateTeamCategoryDto, ITeamCategory } from '@okampus/shared/dtos';
import type { MulterFileType } from '@okampus/shared/types';

@Injectable()
export class TeamCategoryFactory extends BaseFactory<
  TeamCategoryModel,
  TeamCategory,
  ITeamCategory,
  TeamCategoryOptions
> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    teamCategoryRepository: TeamCategoryRepository,
    private readonly em: EntityManager,
    private readonly teamRepository: TeamRepository,
    private readonly tagRepository: TagRepository,
    private readonly uploadService: UploadService
  ) {
    super(eventPublisher, teamCategoryRepository, TeamCategoryModel, TeamCategory);
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

  modelToEntity(model: Required<TeamCategoryModel>): TeamCategory {
    return new TeamCategory({
      color: model.color,
      name: model.name,
      slug: model.slug,
      description: model.description,
      teams: model.teams.map((team) => this.em.getReference(Team, team.id)),
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
