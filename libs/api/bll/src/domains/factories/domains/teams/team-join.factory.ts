import { getTeamJoinPopulate, TeamJoinModel } from './team-join.model';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

import {
  TenantCore,
  Individual,
  User,
  Team,
  TeamRole,
  FormSubmission,
  getTeamJoinDescription,
  TeamMember,
  Shortcut,
} from '@okampus/api/dal';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  TeamJoin,
  TeamJoinOptions,
  TeamJoinRepository,
  TeamRepository,
  FormEditRepository,
  UserRepository,
  TeamRoleRepository,
} from '@okampus/api/dal';

import { IndividualKind, ApprovalState, ShortcutType } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityData, EntityManager } from '@mikro-orm/core';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { asyncCallIfNotNull } from '@okampus/shared/utils';
import type { CreateTeamJoinDto, ITeamJoin, UpdateTeamJoinDto } from '@okampus/shared/dtos';

@Injectable()
export class TeamJoinFactory extends BaseFactory<TeamJoinModel, TeamJoin, ITeamJoin, TeamJoinOptions> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    private readonly teamJoinRepository: TeamJoinRepository,
    uploadService: UploadService,
    private readonly em: EntityManager,
    private readonly formEditRepository: FormEditRepository,
    private readonly teamRepository: TeamRepository,
    private readonly teamRoleRepository: TeamRoleRepository,
    private readonly userRepository: UserRepository
  ) {
    super(eventPublisher, uploadService, teamJoinRepository, TeamJoinModel, TeamJoin);
  }

  async createTeamJoin(
    createTeamJoin: CreateTeamJoinDto,
    requester: Individual,
    tenant: TenantCore,
    populate: string[]
  ): Promise<TeamJoinModel> {
    if (requester.individualKind === IndividualKind.Bot && !createTeamJoin.joinerId)
      throw new BadRequestException('Bot cannot create a TeamJoin without a joiner');

    const teamJoinPopulate = getTeamJoinPopulate(populate);

    const id = createTeamJoin.joinerId;
    const whereExisting = { team: { id: createTeamJoin.teamId }, joiner: { id } };
    if (await this.teamJoinRepository.exists(whereExisting)) throw new BadRequestException('TeamJoin already exists');

    const getJoiner = async () =>
      id
        ? await this.userRepository.findOneOrFail({ id }, { populate: teamJoinPopulate.joiner })
        : (await this.userRepository.populate(requester as User, teamJoinPopulate.joiner)) && (requester as User);

    const [joiner, team, linkedFormEdit, askedRole] = await Promise.all([
      getJoiner(),
      this.teamRepository.findOneOrFail(
        { id: createTeamJoin.teamId },
        { populate: [...teamJoinPopulate.team, 'actor'] }
      ),
      this.formEditRepository.findOneOrFail({ id: createTeamJoin.linkedFormEditId }), // TODO: validate formEdit with formSubmission
      this.teamRoleRepository.findOneOrFail({ id: createTeamJoin.askedRoleId }),
    ]);

    const issuer = id ? requester : null;
    const formSubmission = new FormSubmission({
      description: getTeamJoinDescription(issuer, joiner, askedRole, team),
      linkedFormEdit,
      realAuthor: requester,
      submission: createTeamJoin.submission,
      tenant,
    });

    return this.create({
      ...createTeamJoin,
      askedRole,
      formSubmission,
      issuer,
      joiner,
      team,
      tenant,
    });
  }

  async updateTeamJoin(
    updateTeamJoin: UpdateTeamJoinDto,
    requester: Individual,
    tenant: TenantCore,
    populate: never[]
  ): Promise<TeamJoinModel> {
    const { id, linkedFormEditId, askedRoleId, receivedRoleId, state, submission, ...data } = updateTeamJoin;
    const teamJoin = await this.teamJoinRepository.findOneOrFail({ id }, { populate: [...populate, 'team.actor'] });

    /* TeamJoin is being settled */
    if (state) {
      if (teamJoin.state !== ApprovalState.Pending)
        throw new BadRequestException('Cannot change state of a TeamJoin that is not pending');

      if (state === ApprovalState.Approved && !receivedRoleId)
        throw new BadRequestException('Cannot approve a TeamJoin without a received role');

      const { issuer, joiner } = teamJoin;
      const ownsTeamJoin = (!issuer && joiner.id === requester.id) || (issuer && issuer.id === requester.id);
      if (state !== ApprovalState.Canceled && ownsTeamJoin)
        throw new BadRequestException('Cannot change state of your own TeamJoin');
    }

    const linkedFormEdit = await asyncCallIfNotNull(linkedFormEditId, (id) =>
      this.formEditRepository.findOneOrFail({ id })
    ); // TODO: validate formEdit with formSubmission

    const [askedRole, receivedRole] = await Promise.all([
      asyncCallIfNotNull(askedRoleId, (id) => this.teamRoleRepository.findOneOrFail({ id })),
      asyncCallIfNotNull(receivedRoleId, (id) => this.teamRoleRepository.findOneOrFail({ id })),
    ]);

    // TODO: forbid editing joiner fields if joiner is not requester and vice versa

    const entityData: EntityData<TeamJoin> = {
      ...data,
      ...(askedRole && { askedRole }),
      ...(state && {
        state,
        settledBy: requester,
        settledAt: new Date(),
        settledMessage: updateTeamJoin.settledMessage ?? null,
        receivedRole: receivedRole ?? askedRole ?? teamJoin.askedRole,
      }),
      ...(submission && {
        formSubmission: new FormSubmission({
          // TODO: FormSubmissionEdit instead of FormSubmission
          description: getTeamJoinDescription(
            teamJoin.issuer,
            teamJoin.joiner,
            askedRole ?? teamJoin.askedRole,
            teamJoin.team
          ),
          linkedFormEdit: linkedFormEdit ?? teamJoin.formSubmission.linkedFormEdit,
          realAuthor: requester,
          submission,
          tenant,
        }),
      }),
    };

    const transform = async (teamJoin: TeamJoin) => {
      if (state === ApprovalState.Approved && receivedRole) {
        teamJoin.team.members.add(
          new TeamMember({
            team: teamJoin.team,
            user: teamJoin.joiner,
            roles: [receivedRole],
            tenant,
          })
        );

        const shortcut = new Shortcut({
          type: ShortcutType.Team,
          targetActor: teamJoin.team.actor,
          user: teamJoin.joiner,
        });
        teamJoin.joiner.shortcuts.add(shortcut);
      }

      return teamJoin;
    };

    return await this.update({ id, tenant }, populate, entityData, true, transform);
  }

  modelToEntity(model: Required<TeamJoinModel>): TeamJoin {
    return new TeamJoin({
      ...model,
      team: this.em.getReference(Team, model.team.id),
      askedRole: this.em.getReference(TeamRole, model.askedRole.id),
      formSubmission: this.em.getReference(FormSubmission, model.formSubmission.id),
      issuer: model.issuer ? this.em.getReference(Individual, model.issuer.id) : null,
      joiner: this.em.getReference(User, model.joiner.id),
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
