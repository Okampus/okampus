import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
import { BadRequestException, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamRepository } from '@okampus/api/dal';
import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class TeamsService extends RequestContext {
  constructor(private readonly teamRepository: TeamRepository, private readonly hasuraService: HasuraService) {
    super();
  }

  validateProps(props: ValueTypes['TeamInsertInput']) {
    // Custom logic
    return true;
  }

  async insertTeam(
    selectionSet: string[],
    objects: Array<ValueTypes['TeamInsertInput']>,
    onConflict?: ValueTypes['TeamOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await objects.every((object) => this.validateProps(object));
    if (!arePropsValid) throw new BadRequestException('Cannot insert Team with invalid props.');

    const data = await this.hasuraService.insert('insertTeam', selectionSet, objects, onConflict, insertOne);
    // Custom logic
    return data.insertTeam;
  }

  async updateTeam(selectionSet: string[], where: ValueTypes['TeamBoolExp'], _set: ValueTypes['TeamSetInput']) {
    const arePropsValid = this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Team with invalid props.');

    const data = await this.hasuraService.update('updateTeam', selectionSet, where, _set);
    // Custom logic
    return data.updateTeam;
  }

  async findTeam(
    selectionSet: string[],
    where: ValueTypes['TeamBoolExp'],
    orderBy?: Array<ValueTypes['TeamOrderBy']>,
    distinctOn?: Array<ValueTypes['TeamSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('team', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.team;
  }

  async findTeamByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('teamByPk', selectionSet, { id });
    return data.teamByPk;
  }

  async updateTeamByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['TeamPkColumnsInput'],
    _set: ValueTypes['TeamSetInput']
  ) {
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Team with invalid props.');

    const data = await this.hasuraService.updateByPk('updateTeamByPk', selectionSet, pkColumns, _set);
    // Custom logic
    return data.updateTeamByPk;
  }

  async aggregateTeam(
    selectionSet: string[],
    where: ValueTypes['TeamBoolExp'],
    orderBy?: Array<ValueTypes['TeamOrderBy']>,
    distinctOn?: Array<ValueTypes['TeamSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'teamAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.teamAggregate;
  }
}
