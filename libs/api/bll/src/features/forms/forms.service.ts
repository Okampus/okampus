import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FormRepository, Form } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class FormsService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly formRepository: FormRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['FormInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const form = await this.formRepository.findOneOrFail(id);
    if (form.deletedAt) throw new NotFoundException(`Form was deleted on ${form.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['FormSetInput'], form: Form) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (form.deletedAt) throw new NotFoundException(`Form was deleted on ${form.deletedAt}.`);
    if (form.hiddenAt) throw new NotFoundException('Form must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return form.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['FormSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['FormInsertInput']) {
    // Custom logic
    return true;
  }

  async insertForm(
    selectionSet: string[],
    objects: Array<ValueTypes['FormInsertInput']>,
    onConflict?: ValueTypes['FormOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await Promise.all(
      objects.map(async (props) => {
        const canCreate = await this.checkPermsCreate(props);
        if (!canCreate) throw new ForbiddenException('You are not allowed to insert Form.');

        const arePropsValid = await this.checkPropsConstraints(props);
        if (!arePropsValid) throw new BadRequestException('Props are not valid.');

        const areRelationshipsValid = await this.checkCreateRelationships(props);
        if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

        return canCreate && arePropsValid && areRelationshipsValid;
      })
    ).then((results) => results.every(Boolean));

    if (!arePropsValid) throw new ForbiddenException('You are not allowed to insert Form.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insert('insertForm', selectionSet, objects, onConflict, insertOne);

    for (const inserted of data.insertForm.returning) {
      const form = await this.formRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Form, form);
    }

    // Custom logic
    return data.insertForm;
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
    const form = await this.formRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, form);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Form (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateFormByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Form, form, _set);

    // Custom logic
    return data.updateFormByPk;
  }

  async deleteFormByPk(selectionSet: string[], pkColumns: ValueTypes['FormPkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Form (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateFormByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Form, pkColumns.id);
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
