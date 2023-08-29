import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { FormSubmissionRepository, FormSubmission } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  FormSubmissionInsertInput,
  FormSubmissionOnConflict,
  FormSubmissionBoolExp,
  FormSubmissionOrderBy,
  FormSubmissionSelectColumn,
  FormSubmissionSetInput,
  FormSubmissionUpdates,
  FormSubmissionPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class FormSubmissionsService extends RequestContext {
  private readonly logger = new Logger(FormSubmissionsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly formSubmissionRepository: FormSubmissionRepository,
  ) {
    super();
  }

  checkPermsCreate(props: FormSubmissionInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(formSubmission: FormSubmission) {
    if (formSubmission.deletedAt)
      throw new NotFoundException(`FormSubmission was deleted on ${formSubmission.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) &&
            role.tenant?.id === formSubmission.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: FormSubmissionSetInput, formSubmission: FormSubmission) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (formSubmission.deletedAt)
      throw new NotFoundException(`FormSubmission was deleted on ${formSubmission.deletedAt}.`);
    if (formSubmission.hiddenAt)
      throw new NotFoundException('FormSubmission must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) &&
            role.tenant?.id === formSubmission.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return formSubmission.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: FormSubmissionSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: FormSubmissionInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertFormSubmissionOne(
    selectionSet: string[],
    object: FormSubmissionInsertInput,
    onConflict?: FormSubmissionOnConflict,
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert FormSubmission.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertFormSubmissionOne', selectionSet, object, onConflict);

    const formSubmission = await this.formSubmissionRepository.findOneOrFail(data.insertFormSubmissionOne.id);
    await this.logsService.createLog(EntityName.FormSubmission, formSubmission);

    // Custom logic
    return data.insertFormSubmissionOne;
  }

  async findFormSubmission(
    selectionSet: string[],
    where: FormSubmissionBoolExp,
    orderBy?: Array<FormSubmissionOrderBy>,
    distinctOn?: Array<FormSubmissionSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'formSubmission',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.formSubmission;
  }

  async findFormSubmissionByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('formSubmissionByPk', selectionSet, { id });
    return data.formSubmissionByPk;
  }

  async insertFormSubmission(
    selectionSet: string[],
    objects: Array<FormSubmissionInsertInput>,
    onConflict?: FormSubmissionOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert FormSubmission.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertFormSubmission', selectionSet, objects, onConflict);

    for (const inserted of data.insertFormSubmission.returning) {
      const formSubmission = await this.formSubmissionRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.FormSubmission, formSubmission);
    }

    // Custom logic
    return data.insertFormSubmission;
  }

  async updateFormSubmissionMany(selectionSet: string[], updates: Array<FormSubmissionUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const formSubmissions = await this.formSubmissionRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const formSubmission = formSubmissions.find((formSubmission) => formSubmission.id === update.where.id._eq);
      if (!formSubmission) throw new NotFoundException(`FormSubmission (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, formSubmission);
      if (!canUpdate)
        throw new ForbiddenException(`You are not allowed to update FormSubmission (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateFormSubmissionMany', selectionSet, updates);

    await Promise.all(
      formSubmissions.map(async (formSubmission) => {
        const update = updates.find((update) => update.where.id._eq === formSubmission.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.FormSubmission, formSubmission, update._set);
      }),
    );

    // Custom logic
    return data.updateFormSubmissionMany;
  }

  async updateFormSubmissionByPk(
    selectionSet: string[],
    pkColumns: FormSubmissionPkColumnsInput,
    _set: FormSubmissionSetInput,
  ) {
    const formSubmission = await this.formSubmissionRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, formSubmission);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update FormSubmission (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateFormSubmissionByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.FormSubmission, formSubmission, _set);

    // Custom logic
    return data.updateFormSubmissionByPk;
  }

  async deleteFormSubmission(selectionSet: string[], where: FormSubmissionBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const formSubmissions = await this.formSubmissionRepository.findByIds(where.id._in);
    for (const formSubmission of formSubmissions) {
      const canDelete = this.checkPermsDelete(formSubmission);
      if (!canDelete)
        throw new ForbiddenException(`You are not allowed to delete FormSubmission (${formSubmission.id}).`);
    }

    const data = await this.hasuraService.update('updateFormSubmission', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      formSubmissions.map(async (formSubmission) => {
        await this.logsService.deleteLog(EntityName.FormSubmission, formSubmission.id);
      }),
    );

    // Custom logic
    return data.updateFormSubmission;
  }

  async deleteFormSubmissionByPk(selectionSet: string[], id: string) {
    const formSubmission = await this.formSubmissionRepository.findOneOrFail(id);

    const canDelete = this.checkPermsDelete(formSubmission);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete FormSubmission (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateFormSubmissionByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.FormSubmission, id);
    // Custom logic
    return data.updateFormSubmissionByPk;
  }

  async aggregateFormSubmission(
    selectionSet: string[],
    where: FormSubmissionBoolExp,
    orderBy?: Array<FormSubmissionOrderBy>,
    distinctOn?: Array<FormSubmissionSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'formSubmissionAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.formSubmissionAggregate;
  }
}
