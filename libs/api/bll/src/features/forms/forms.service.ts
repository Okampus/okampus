import { RequestContext } from '../../shards/abstract/request-context';
import { HasuraService } from '../../global/graphql/hasura.service';
import { LogsService } from '../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { FormRepository, Form } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  FormInsertInput,
  FormOnConflict,
  FormBoolExp,
  FormOrderBy,
  FormSelectColumn,
  FormSetInput,
  FormUpdates,
  FormPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class FormsService extends RequestContext {
  private readonly logger = new Logger(FormsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly formRepository: FormRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: FormInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(form: Form) {
    if (form.deletedAt) throw new NotFoundException(`Form was deleted on ${form.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === form.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: FormSetInput, form: Form) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (form.deletedAt) throw new NotFoundException(`Form was deleted on ${form.deletedAt}.`);
    if (form.hiddenAt) throw new NotFoundException('Form must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === form.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return form.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: FormSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: FormInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertFormOne(selectionSet: string[], object: FormInsertInput, onConflict?: FormOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Form.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
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
    where: FormBoolExp,
    orderBy?: Array<FormOrderBy>,
    distinctOn?: Array<FormSelectColumn>,
    limit?: number,
    offset?: number,
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

  async insertForm(selectionSet: string[], objects: Array<FormInsertInput>, onConflict?: FormOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Form.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
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

  async updateFormMany(selectionSet: string[], updates: Array<FormUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const forms = await this.formRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const form = forms.find((form) => form.id === update.where.id._eq);
        if (!form) throw new NotFoundException(`Form (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, form);
        if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Form (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateFormMany', selectionSet, updates);

    await Promise.all(
      forms.map(async (form) => {
        const update = updates.find((update) => update.where.id._eq === form.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Form, form, update._set);
      }),
    );

    // Custom logic
    return data.updateFormMany;
  }

  async updateFormByPk(selectionSet: string[], pkColumns: FormPkColumnsInput, _set: FormSetInput) {
    const form = await this.formRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, form);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Form (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateFormByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Form, form, _set);

    // Custom logic
    return data.updateFormByPk;
  }

  async deleteForm(selectionSet: string[], where: FormBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const forms = await this.formRepository.findByIds(where.id._in);

    await Promise.all(
      forms.map(async (form) => {
        const canDelete = await this.checkPermsDelete(form);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Form (${form.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateForm', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      forms.map(async (form) => {
        await this.logsService.deleteLog(EntityName.Form, form.id);
      }),
    );

    // Custom logic
    return data.updateForm;
  }

  async deleteFormByPk(selectionSet: string[], id: string) {
    const form = await this.formRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(form);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Form (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateFormByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.Form, id);
    // Custom logic
    return data.updateFormByPk;
  }

  async aggregateForm(
    selectionSet: string[],
    where: FormBoolExp,
    orderBy?: Array<FormOrderBy>,
    distinctOn?: Array<FormSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'formAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.formAggregate;
  }
}
