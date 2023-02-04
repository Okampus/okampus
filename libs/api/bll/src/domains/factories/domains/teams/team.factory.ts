import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import type {
  ActorImageUploadProps,
  ActorRepository,
  Form,
  Individual,
  Org,
  ShortcutRepository,
  Tag,
  TeamCategory,
  TeamCategoryRepository,
  TeamMemberRepository,
  TeamOptions,
  TeamRepository,
  TeamRoleRepository,
  TenantCore,
  User,
  UserRepository} from '@okampus/api/dal';
import {
  clubDefaultRoles,
  Shortcut,
  Team,
  teamDefaultRoles,
  TeamMember,
  TeamRole
} from '@okampus/api/dal';
import type { CreateOrgDocumentDto, CreateTeamDto, ITeam } from '@okampus/shared/dtos';
// import { loadTeam } from '../loader.utils';
import { BaseFactory } from '../../base.factory';
import { TeamModel } from './team.model';
import { ActorKind, IndividualKind, ShortcutType, TeamType } from '@okampus/shared/enums';
import { toSlug } from '@okampus/shared/utils';
import { addImagesToActor } from '../../abstract.utils';
import type { UploadService } from '../../../../features/uploads/upload.service';
import type { Snowflake, MulterFileType } from '@okampus/shared/types';
import type { OrgDocumentFactory } from '../documents/org-document.factory';
import type { OrgDocumentModel } from '../documents/org-document.model';

@Injectable()
export class TeamFactory extends BaseFactory<TeamModel, Team, ITeam, TeamOptions> {
  constructor(
    @Inject(EventPublisher) ep: EventPublisher,
    private readonly teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
    private readonly actorRepository: ActorRepository,
    private readonly teamMemberRepository: TeamMemberRepository,
    private readonly shortcutRepository: ShortcutRepository,
    private readonly teamRoleRepository: TeamRoleRepository,
    private readonly teamCategoryRepository: TeamCategoryRepository,
    private readonly orgDocumentFactory: OrgDocumentFactory,
    private readonly uploadService: UploadService
  ) {
    super(ep, teamRepository, TeamModel, Team);
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
    /* Get team owner */
    let user: User;
    if (requester.individualKind === IndividualKind.User) {
      user = requester as User;
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
      /* Add images to team */
      if (images) team.actor = await addImagesToActor(team.actor, ActorKind.Org, images, tenant, this.uploadService);

      /* Add team manage shortcut to team owner */
      const shortcut = new Shortcut({ type: ShortcutType.TeamManage, targetActor: team.actor, user });

      /* Add default roles to team */
      const roles =
        createTeam.type === TeamType.Club || createTeam.type === TeamType.Association
          ? clubDefaultRoles
          : teamDefaultRoles;

      const roleEntities = roles.map((role) => new TeamRole({ ...role, team, tenant: team.tenant }));

      /* Add team owner to team */
      const membership = new TeamMember({ team, user, roles: [roleEntities[0]], tenant: team.tenant });

      this.shortcutRepository.persist(shortcut);
      this.teamRoleRepository.persist(roleEntities);
      this.teamMemberRepository.persist(membership);

      return team;
    });

    return team;
  }

  modelToEntity(model: Required<TeamModel>): Team {
    return new Team({
      ...model,
      ...model.actor,
      parent: model.parent ? ({ id: model.parent.id } as Org) : null,
      joinForm: model.joinForm ? ({ id: model.joinForm.id } as Form) : null,
      tenant: { id: model.tenant.id } as TenantCore,
      tags: model.actor.tags.map((tag) => ({ id: tag.id } as Tag)),
      categories: model.categories.map((category) => ({ id: category.id } as TeamCategory)),
    });
  }
}
