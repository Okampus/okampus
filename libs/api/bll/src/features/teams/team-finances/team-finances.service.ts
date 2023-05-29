import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
import { BadRequestException, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamFinanceEditRepository } from '@okampus/api/dal';
import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class TeamFinancesService extends RequestContext {
  constructor(
    private readonly teamFinanceEditRepository: TeamFinanceEditRepository,
    private readonly hasuraService: HasuraService
  ) {
    super();
  }

  validateProps(props: ValueTypes['TeamFinanceInsertInput']) {
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    if (props.actorAddress && props.actorAddress.data) {
      props.actorAddress.data.tenantId = this.tenant().id;
      props.actorAddress.data.createdById = this.requester().id;
    }
    // Custom logic
    return true;
  }

  async insertTeamFinance(
    selectionSet: string[],
    objects: Array<ValueTypes['TeamFinanceInsertInput']>,
    onConflict?: ValueTypes['TeamFinanceOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await objects.every((object) => this.validateProps(object));
    if (!arePropsValid) throw new BadRequestException('Cannot insert TeamFinance with invalid props.');

    const data = await this.hasuraService.insert('insertTeamFinance', selectionSet, objects, onConflict, insertOne);

    // Custom logic
    return data.insertTeamFinance;
  }

  async updateTeamFinance(
    selectionSet: string[],
    where: ValueTypes['TeamFinanceBoolExp'],
    _set: ValueTypes['TeamFinanceSetInput']
  ) {
    const arePropsValid = this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update TeamFinance with invalid props.');

    // const teamFinanceEdit = this.teamFinanceEditRepository.create({
    //   tenant: this.tenant()
    // })

    // await this.teamFinanceEditRepository.getEntityManager().persistAndFlush(teamFinanceEdit);

    const data = await this.hasuraService.update('updateTeamFinance', selectionSet, where, _set);
    // Custom logic
    return data.updateTeamFinance;
  }

  async findTeamFinance(
    selectionSet: string[],
    where: ValueTypes['TeamFinanceBoolExp'],
    orderBy?: Array<ValueTypes['TeamFinanceOrderBy']>,
    distinctOn?: Array<ValueTypes['TeamFinanceSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('teamFinance', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.teamFinance;
  }

  async findTeamFinanceByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('teamFinanceByPk', selectionSet, { id });
    return data.teamFinanceByPk;
  }

  async updateTeamFinanceByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['TeamFinancePkColumnsInput'],
    _set: ValueTypes['TeamFinanceSetInput']
  ) {
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update TeamFinance with invalid props.');

    const data = await this.hasuraService.updateByPk('updateTeamFinanceByPk', selectionSet, pkColumns, _set);
    // Custom logic
    return data.updateTeamFinanceByPk;
  }

  async aggregateTeamFinance(
    selectionSet: string[],
    where: ValueTypes['TeamFinanceBoolExp'],
    orderBy?: Array<ValueTypes['TeamFinanceOrderBy']>,
    distinctOn?: Array<ValueTypes['TeamFinanceSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'teamFinanceAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.teamFinanceAggregate;
  }
}
