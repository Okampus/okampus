import { TeamModel } from './team.model';
import { BaseFactory } from '../../base.factory';
import { addImagesToActor } from '../../factory.utils';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorImageFactory } from '../images/actor-image.factory';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { OrgDocumentFactory } from '../documents/org-document.factory';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager, FilterQuery } from '@mikro-orm/core';

import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import {
  clubDefaultRoles,
  Shortcut,
  Team,
  teamDefaultRoles,
  TeamMember,
  TeamRole,
  Form,
  Org,
  Tag,
  TeamCategory,
  TenantCore,
} from '@okampus/api/dal';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  ActorRepository,
  ActorImageRepository,
  ShortcutRepository,
  TeamCategoryRepository,
  TeamMemberRepository,
  TeamRepository,
  TeamRoleRepository,
  UserRepository,
} from '@okampus/api/dal';

import {
  ActorKind,
  ControlType,
  FormType,
  IndividualKind,
  ShortcutType,
  TeamPermissions,
  TeamType,
} from '@okampus/shared/enums';
import { toSlug } from '@okampus/shared/utils';

import type { OrgDocumentModel } from '../documents/org-document.model';
import type { ActorImageUploadProps, Individual, TeamOptions, User } from '@okampus/api/dal';
import type { CreateOrgDocumentDto, CreateTeamDto, ITeam } from '@okampus/shared/dtos';
import type { Snowflake, MulterFileType } from '@okampus/shared/types';

@Injectable()
export class TeamFactory extends BaseFactory<TeamModel, Team, ITeam, TeamOptions> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    uploadService: UploadService,
    private readonly em: EntityManager,
    private readonly actorImageFactory: ActorImageFactory,
    private readonly teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
    private readonly actorRepository: ActorRepository,
    private readonly actorImageRepository: ActorImageRepository,
    private readonly teamMemberRepository: TeamMemberRepository,
    private readonly shortcutRepository: ShortcutRepository,
    private readonly teamRoleRepository: TeamRoleRepository,
    private readonly teamCategoryRepository: TeamCategoryRepository,
    private readonly orgDocumentFactory: OrgDocumentFactory
  ) {
    super(eventPublisher, uploadService, teamRepository, TeamModel, Team);
  }

  async teamAddDocument(
    teamId: Snowflake,
    createOrgDocument: CreateOrgDocumentDto,
    documentFile: MulterFileType,
    tenant: TenantCore
  ): Promise<OrgDocumentModel> {
    // const teamOrg = await this.teamRepository.findOneOrFail(teamId, { populate });
    // TODO: enforce certain unique document types (constitution, etc.)
    return await this.orgDocumentFactory.createOrgDocument(teamId, createOrgDocument, documentFile, tenant);
    // this.teamRepository.flush();

    // const teamModel = this.entityToModel(teamOrg);
    // if (!teamModel) throw new BadRequestException(`Tenant with id ${teamId} not found`);
    // return teamModel;
  }

  // TODO: add teamEditDocument
  async createTeam(
    createTeam: CreateTeamDto,
    tenant: TenantCore,
    requester: Individual,
    images?: ActorImageUploadProps
  ) {
    const isUser = (user: Individual): user is User => user.individualKind === IndividualKind.User;

    /* Get team owner */
    let user: User;
    if (isUser(requester)) {
      user = requester;
    } else if (createTeam.ownerId) {
      user = await this.userRepository.findOneOrFail({ id: createTeam.ownerId });
    } else {
      throw new ForbiddenException('Must be a user to create a team');
    }

    /* Ensure that slug is unique the tenant */
    const slug = await this.actorRepository.ensureUniqueSlug(createTeam.slug ?? toSlug(createTeam.name), tenant.id);

    const categories = await this.teamCategoryRepository.findByIds(createTeam.categoriesIds);

    /* Create team */
    const team = await this.create({ ...createTeam, categories, slug, tenant }, async (team) => {
      /* Add default team join form */
      team.joinForm = new Form({
        isTemplate: false,
        name: `Formulaire d'adhésion de ${team.actor.name}`,
        realAuthor: null,
        schema: [
          {
            fieldName: 'title',
            inputType: ControlType.Text,
            label: "Raison de l'adhésion",
            placeholder: "Raison de l'adhésion",
          },
        ],
        description: `Formulaire d'adhésion officiel de ${team.actor.name}`,
        type: FormType.TeamJoin,
        undeletable: true,
        tenant,
      });

      /* Add images to team */
      if (images) team.actor = await addImagesToActor(team.actor, ActorKind.Org, images, tenant, this.uploadService);

      /* Add team manage shortcut to team owner */
      const shortcut = new Shortcut({ type: ShortcutType.TeamManage, targetActor: team.actor, user });

      /* Add default roles to team */
      const roles =
        createTeam.type === TeamType.Club || createTeam.type === TeamType.Association
          ? clubDefaultRoles
          : teamDefaultRoles;

      const roleEntities = roles.map((role) => new TeamRole({ ...role, team, tenant }));

      /* Add team owner to team */
      const membership = new TeamMember({ team, user, roles: [roleEntities[0]], tenant });

      this.shortcutRepository.persist(shortcut);
      team.roles.add(roleEntities);
      team.members.add(membership);

      return team;
    });

    return team;
  }

  async hasTeamRole(teamId: Snowflake, individualId: Snowflake, where: FilterQuery<TeamRole>): Promise<boolean> {
    return !!(await this.teamRepository.count({
      id: teamId,
      members: { user: { id: individualId }, roles: where, endDate: null },
    }));
  }

  async canEditTeam(teamId: Snowflake, individualId: Snowflake): Promise<boolean> {
    return this.hasTeamRole(teamId, individualId, {
      permissions: { $overlap: [TeamPermissions.ManageTeam, TeamPermissions.Admin] },
    });
  }

  modelToEntity(model: Required<TeamModel>): Team {
    return new Team({
      ...model,
      ...model.actor,
      parent: model.parent ? this.em.getReference(Org, model.parent.id) : null,
      joinForm: model.joinForm ? this.em.getReference(Form, model.joinForm.id) : null,
      tags: model.actor.tags.map((tag) => this.em.getReference(Tag, tag.id)),
      categories: model.categories.map((category) => this.em.getReference(TeamCategory, category.id)),
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
