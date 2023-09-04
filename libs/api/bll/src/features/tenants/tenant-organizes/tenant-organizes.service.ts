import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { TenantOrganizeRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { TenantOrganize } from '@okampus/api/dal';
import type {
  TenantOrganizeInsertInput,
  TenantOrganizeOnConflict,
  TenantOrganizeBoolExp,
  TenantOrganizeOrderBy,
  TenantOrganizeSelectColumn,
  TenantOrganizeSetInput,
  TenantOrganizeUpdates,
  TenantOrganizePkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class TenantOrganizesService extends RequestContext {
  private readonly logger = new Logger(TenantOrganizesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly tenantOrganizeRepository: TenantOrganizeRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: TenantOrganizeInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    

    // Custom logic
    return false;
  }

  async checkPermsDelete(tenantOrganize: TenantOrganize) {
    if (tenantOrganize.deletedAt) throw new NotFoundException(`TenantOrganize was deleted on ${tenantOrganize.deletedAt}.`);
    

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: TenantOrganizeSetInput, tenantOrganize: TenantOrganize) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (tenantOrganize.deletedAt) throw new NotFoundException(`TenantOrganize was deleted on ${tenantOrganize.deletedAt}.`);
    

    // Custom logic
    return tenantOrganize.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: TenantOrganizeSetInput) {
    this.hasuraService.checkForbiddenFields(props);
    

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: TenantOrganizeInsertInput) {
    // Custom logic
    
    props.createdById = this.requester().id;

    
    

    return true;
  }

  async insertTenantOrganizeOne(
    selectionSet: string[],
    object: TenantOrganizeInsertInput,
    onConflict?: TenantOrganizeOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert TenantOrganize.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertTenantOrganizeOne', selectionSet, object, onConflict);

    const tenantOrganize = await this.tenantOrganizeRepository.findOneOrFail(data.insertTenantOrganizeOne.id);
    await this.logsService.createLog(EntityName.TenantOrganize, tenantOrganize);

    // Custom logic
    return data.insertTenantOrganizeOne;
  }

  async findTenantOrganize(
    selectionSet: string[],
    where: TenantOrganizeBoolExp,
    orderBy?: Array<TenantOrganizeOrderBy>,
    distinctOn?: Array<TenantOrganizeSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('tenantOrganize', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.tenantOrganize;
  }

  async findTenantOrganizeByPk(
    selectionSet: string[],
     id: string, 
  ) {
    // Custom logic
    const data = await this.hasuraService.findByPk('tenantOrganizeByPk', selectionSet, {  id,  });
    return data.tenantOrganizeByPk;
  }

  async insertTenantOrganize(
    selectionSet: string[],
    objects: Array<TenantOrganizeInsertInput>,
    onConflict?: TenantOrganizeOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert TenantOrganize.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertTenantOrganize', selectionSet, objects, onConflict);

    for (const inserted of data.insertTenantOrganize.returning) {
      const tenantOrganize = await this.tenantOrganizeRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.TenantOrganize, tenantOrganize);
    }

    // Custom logic
    return data.insertTenantOrganize;
  }

  async updateTenantOrganizeMany(
    selectionSet: string[],
    updates: Array<TenantOrganizeUpdates>,
  ) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const tenantOrganizes = await this.tenantOrganizeRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(updates.map(async (update) => {
      const tenantOrganize = tenantOrganizes.find((tenantOrganize) => tenantOrganize.id === update.where.id._eq);
      if (!tenantOrganize) throw new NotFoundException(`TenantOrganize (${update.where.id._eq}) was not found.`);

      const canUpdate = await this.checkPermsUpdate(update._set, tenantOrganize);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TenantOrganize (${update.where.id._eq}).`);

      const arePropsValid = await this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }));

    const data = await this.hasuraService.updateMany('updateTenantOrganizeMany', selectionSet, updates);

    await Promise.all(tenantOrganizes.map(async (tenantOrganize) => {
      const update = updates.find((update) => update.where.id._eq === tenantOrganize.id)
      if (!update) return;
      await this.logsService.updateLog(EntityName.TenantOrganize, tenantOrganize, update._set);
    }));

    // Custom logic
    return data.updateTenantOrganizeMany;
  }

  async updateTenantOrganizeByPk(
    selectionSet: string[],
    pkColumns: TenantOrganizePkColumnsInput,
    _set: TenantOrganizeSetInput,
  ) {
    const tenantOrganize = await this.tenantOrganizeRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, tenantOrganize);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TenantOrganize (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTenantOrganizeByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.TenantOrganize, tenantOrganize, _set);

    // Custom logic
    return data.updateTenantOrganizeByPk;
  }

  async deleteTenantOrganize(
    selectionSet: string[],
    where: TenantOrganizeBoolExp,
  ) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect) throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const tenantOrganizes = await this.tenantOrganizeRepository.findByIds(where.id._in);

    await Promise.all(tenantOrganizes.map(async (tenantOrganize) => {
      const canDelete = await this.checkPermsDelete(tenantOrganize);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TenantOrganize (${tenantOrganize.id}).`);
    }));

    const data = await this.hasuraService.update('updateTenantOrganize', selectionSet, where, { deletedAt: new Date().toISOString() });

    await Promise.all(tenantOrganizes.map(async (tenantOrganize) => {
      await this.logsService.deleteLog(EntityName.TenantOrganize, tenantOrganize.id);
    }));

    // Custom logic
    return data.updateTenantOrganize;
  }

  async deleteTenantOrganizeByPk(
    selectionSet: string[],
    id: string,
  ) {
    const tenantOrganize = await this.tenantOrganizeRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(tenantOrganize);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TenantOrganize (${id}).`);

    const data = await this.hasuraService.updateByPk('updateTenantOrganizeByPk', selectionSet, { id }, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.TenantOrganize, id);
    // Custom logic
    return data.updateTenantOrganizeByPk;
  }

  async aggregateTenantOrganize(
    selectionSet: string[],
    where: TenantOrganizeBoolExp,
    orderBy?: Array<TenantOrganizeOrderBy>,
    distinctOn?: Array<TenantOrganizeSelectColumn>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate('tenantOrganizeAggregate', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.tenantOrganizeAggregate;
  }
}