// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { NotificationsService } from '../../../global/notifications/notifications.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';

import { RequestContext } from '../../../shards/abstract/request-context';

import { BadRequestException, Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ChangeRole, TeamJoinRepository, TeamMember } from '@okampus/api/dal';
import { ApprovalState } from '@okampus/shared/enums';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class TeamJoinsService extends RequestContext {
  constructor(
    private readonly teamJoinRepository: TeamJoinRepository,
    private readonly hasuraService: HasuraService,
    private readonly notificationsService: NotificationsService
  ) {
    super();
  }

  validateProps(props: ValueTypes['TeamJoinInsertInput']) {
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async insertTeamJoin(
    selectionSet: string[],
    objects: Array<ValueTypes['TeamJoinInsertInput']>,
    onConflict?: ValueTypes['TeamJoinOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await objects.every((object) => this.validateProps(object));
    if (!arePropsValid) throw new BadRequestException('Cannot insert TeamJoin with invalid props.');

    const data = await this.hasuraService.insert('insertTeamJoin', selectionSet, objects, onConflict, insertOne);
    // Custom logic
    return data.insertTeamJoin;
  }

  async updateTeamJoin(
    selectionSet: string[],
    where: ValueTypes['TeamJoinBoolExp'],
    _set: ValueTypes['TeamJoinSetInput']
  ) {
    const arePropsValid = this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update TeamJoin with invalid props.');

    const data = await this.hasuraService.update('updateTeamJoin', selectionSet, where, _set);
    return data.updateTeamJoin;
  }

  async findTeamJoin(
    selectionSet: string[],
    where: ValueTypes['TeamJoinBoolExp'],
    orderBy?: Array<ValueTypes['TeamJoinOrderBy']>,
    distinctOn?: Array<ValueTypes['TeamJoinSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('teamJoin', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.teamJoin;
  }

  async findTeamJoinByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('teamJoinByPk', selectionSet, { id });
    return data.teamJoinByPk;
  }

  async updateTeamJoinByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['TeamJoinPkColumnsInput'],
    _set: ValueTypes['TeamJoinSetInput']
  ) {
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update TeamJoin with invalid props.');

    const data = await this.hasuraService.updateByPk('updateTeamJoinByPk', selectionSet, pkColumns, _set);
    const update = data.updateTeamJoinByPk;

    if (update) {
      const teamJoin = await this.teamJoinRepository.findOne(
        { id: update.id },
        { populate: ['team', 'team.actor', 'askedRole', 'joiner', 'joiner.individual', 'joiner.individual.actor'] }
      );

      if (!teamJoin) throw new BadRequestException('Cannot find TeamJoin to update notifications.');

      const createdBy = this.requester();

      const teamChangeRole = new ChangeRole({
        team: teamJoin.team,
        user: teamJoin.joiner,
        createdBy,
        tenant: this.tenant(),
        receivedRole: teamJoin.askedRole, // TODO: get role from request? or use changeRole?
        teamJoin,
      });
      this.teamJoinRepository.getEntityManager().persistAndFlush(teamChangeRole);

      if (this.notificationsService.novu) {
        const membership = await this.teamJoinRepository.getEntityManager().findOne(
          TeamMember,
          {
            team: teamJoin.team,
            user: createdBy.user,
          },
          { populate: ['roles'] }
        );

        console.log(
          'membership',
          membership,
          teamJoin?.joiner.individual.id,
          teamJoin?.joiner.individual.actor.primaryEmail
        );
        await this.notificationsService.novu.trigger('teamjoin', {
          payload: {
            state: teamJoin?.state === ApprovalState.Rejected ? 'refusée' : 'acceptée',
            teamName: teamJoin?.team.actor.name,
            roleName: teamJoin?.askedRole.name,
            firstName: teamJoin?.joiner.firstName,
            resolverName: createdBy.actor.name,
            resolverRole: membership?.roles[0].name ?? "Hors de l'équipe",
          },
          to: {
            subscriberId: teamJoin?.joiner.individual.id,
            email: teamJoin?.joiner.individual.actor.primaryEmail || undefined,
          },
        });
      }
    }

    // Custom logic
    return update;
  }

  async aggregateTeamJoin(
    selectionSet: string[],
    where: ValueTypes['TeamJoinBoolExp'],
    orderBy?: Array<ValueTypes['TeamJoinOrderBy']>,
    distinctOn?: Array<ValueTypes['TeamJoinSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'teamJoinAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.teamJoinAggregate;
  }
}
