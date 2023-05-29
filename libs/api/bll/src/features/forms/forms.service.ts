import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
import { BadRequestException, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FormRepository } from '@okampus/api/dal';
import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class FormsService extends RequestContext {
  constructor(private readonly formRepository: FormRepository, private readonly hasuraService: HasuraService) {
    super();
  }

  validateProps(props: ValueTypes['FormInsertInput']) {
    // Custom logic
    return true;
  }

  async insertForm(
    selectionSet: string[],
    objects: Array<ValueTypes['FormInsertInput']>,
    onConflict?: ValueTypes['FormOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await objects.every((object) => this.validateProps(object));
    if (!arePropsValid) throw new BadRequestException('Cannot insert Form with invalid props.');

    const data = await this.hasuraService.insert('insertForm', selectionSet, objects, onConflict, insertOne);
    // Custom logic
    return data.insertForm;
  }

  async updateForm(selectionSet: string[], where: ValueTypes['FormBoolExp'], _set: ValueTypes['FormSetInput']) {
    const arePropsValid = this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Form with invalid props.');

    const data = await this.hasuraService.update('updateForm', selectionSet, where, _set);
    // Custom logic
    return data.updateForm;
  }

  async findForm(
    selectionSet: string[],
    where: ValueTypes['FormBoolExp'],
    orderBy?: Array<ValueTypes['FormOrderBy']>,
    distinctOn?: Array<ValueTypes['FormSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('form', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.form;
  }

  async findFormByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('formByPk', selectionSet, { id });
    return data.formByPk;
  }

  async updateFormByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['FormPkColumnsInput'],
    _set: ValueTypes['FormSetInput']
  ) {
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Form with invalid props.');

    const data = await this.hasuraService.updateByPk('updateFormByPk', selectionSet, pkColumns, _set);
    // Custom logic
    return data.updateFormByPk;
  }

  async aggregateForm(
    selectionSet: string[],
    where: ValueTypes['FormBoolExp'],
    orderBy?: Array<ValueTypes['FormOrderBy']>,
    distinctOn?: Array<ValueTypes['FormSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'formAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.formAggregate;
  }
}
