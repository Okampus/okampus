import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FormRepository, Form } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class FormsService extends RequestContext {
  private readonly logger = new Logger(FormsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly formRepository: FormRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['FormInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(form: Form) {
    if (form.deletedAt) throw new NotFoundException(`Form was deleted on ${form.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === form.tenant?.id
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['FormSetInput'], form: Form) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (form.deletedAt) throw new NotFoundException(`Form was deleted on ${form.deletedAt}.`);
    if (form.hiddenAt) throw new NotFoundException('Form must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === form.tenant?.id
        )
    )
      return true;

    // Custom logic
    return form.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['FormSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['FormInsertInput']) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertFormOne(
    selectionSet: string[],
    object: ValueTypes['FormInsertInput'],
    onConflict?: ValueTypes['FormOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Form.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertFormOne', selectionSet, object, onConflict);

    const form = await this.formRepository.findOneOrFail(data.insertFormOne.id);
    await this.logsService.createLog(EntityName.Form, form);

    // Custom logic
    return data.insertFormOne;
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

  async insertForm(
    selectionSet: string[],
    objects: Array<ValueTypes['FormInsertInput']>,
    onConflict?: ValueTypes['FormOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Form.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertForm', selectionSet, objects, onConflict);

    for (const inserted of data.insertForm.returning) {
      const form = await this.formRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Form, form);
    }

    // Custom logic
    return data.insertForm;
  }

  async updateFormMany(selectionSet: string[], updates: Array<ValueTypes['FormUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const forms = await this.formRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const form = forms.find((form) => form.id === update.where.id._eq);
      if (!form) throw new NotFoundException(`Form (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, form);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Form (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateFormMany', selectionSet, updates);

    await Promise.all(
      forms.map(async (form) => {
        const update = updates.find((update) => update.where.id._eq === form.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Form, form, update._set);
      })
    );

    // Custom logic
    return data.updateFormMany;
  }

  async updateFormByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['FormPkColumnsInput'],
    _set: ValueTypes['FormSetInput']
  ) {
    const form = await this.formRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, form);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Form (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateFormByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Form, form, _set);

    // Custom logic
    return data.updateFormByPk;
  }

  async deleteForm(selectionSet: string[], where: ValueTypes['FormBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const forms = await this.formRepository.findByIds(where.id._in);
    for (const form of forms) {
      const canDelete = this.checkPermsDelete(form);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Form (${form.id}).`);
    }

    const data = await this.hasuraService.update('updateForm', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      forms.map(async (form) => {
        await this.logsService.deleteLog(EntityName.Form, form.id);
      })
    );

    // Custom logic
    return data.updateForm;
  }

  async deleteFormByPk(selectionSet: string[], pkColumns: ValueTypes['FormPkColumnsInput']) {
    const form = await this.formRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(form);
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
