import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
import { BadRequestException, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { IndividualRepository } from '@okampus/api/dal';
import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class IndividualsService extends RequestContext {
  constructor(
    private readonly individualRepository: IndividualRepository,
    private readonly hasuraService: HasuraService
  ) {
    super();
  }

  validateProps(props: ValueTypes['IndividualInsertInput']) {
    // Custom logic
    return true;
  }

  async insertIndividual(
    selectionSet: string[],
    objects: Array<ValueTypes['IndividualInsertInput']>,
    onConflict?: ValueTypes['IndividualOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await objects.every((object) => this.validateProps(object));
    if (!arePropsValid) throw new BadRequestException('Cannot insert Individual with invalid props.');

    const data = await this.hasuraService.insert('insertIndividual', selectionSet, objects, onConflict, insertOne);
    // Custom logic
    return data.insertIndividual;
  }

  async updateIndividual(
    selectionSet: string[],
    where: ValueTypes['IndividualBoolExp'],
    _set: ValueTypes['IndividualSetInput']
  ) {
    const arePropsValid = this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Individual with invalid props.');

    const data = await this.hasuraService.update('updateIndividual', selectionSet, where, _set);
    // Custom logic
    return data.updateIndividual;
  }

  async findIndividual(
    selectionSet: string[],
    where: ValueTypes['IndividualBoolExp'],
    orderBy?: Array<ValueTypes['IndividualOrderBy']>,
    distinctOn?: Array<ValueTypes['IndividualSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('individual', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.individual;
  }

  async findIndividualByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('individualByPk', selectionSet, { id });
    return data.individualByPk;
  }

  async updateIndividualByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['IndividualPkColumnsInput'],
    _set: ValueTypes['IndividualSetInput']
  ) {
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Individual with invalid props.');

    const data = await this.hasuraService.updateByPk('updateIndividualByPk', selectionSet, pkColumns, _set);
    // Custom logic
    return data.updateIndividualByPk;
  }

  async aggregateIndividual(
    selectionSet: string[],
    where: ValueTypes['IndividualBoolExp'],
    orderBy?: Array<ValueTypes['IndividualOrderBy']>,
    distinctOn?: Array<ValueTypes['IndividualSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'individualAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.individualAggregate;
  }
}
