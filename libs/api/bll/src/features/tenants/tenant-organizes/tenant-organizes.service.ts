import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { TenantOrganizeRepository, TenantOrganize } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

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

  checkPermsCreate(props: TenantOrganizeInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(tenantOrganize: TenantOrganize) {
    if (tenantOrganize.deletedAt)
      throw new NotFoundException(`TenantOrganize was deleted on ${tenantOrganize.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) &&
            role.tenant?.id === tenantOrganize.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: TenantOrganizeSetInput, tenantOrganize: TenantOrganize) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (tenantOrganize.deletedAt)
      throw new NotFoundException(`TenantOrganize was deleted on ${tenantOrganize.deletedAt}.`);
    if (tenantOrganize.hiddenAt)
      throw new NotFoundException('TenantOrganize must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) &&
            role.tenant?.id === tenantOrganize.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return tenantOrganize.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: TenantOrganizeSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: TenantOrganizeInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertTenantOrganizeOne(
    selectionSet: string[],
    object: TenantOrganizeInsertInput,
    onConflict?: TenantOrganizeOnConflict,
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert TenantOrganize.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
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
    const data = await this.hasuraService.find(
      'tenantOrganize',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.tenantOrganize;
  }

  async findTenantOrganizeByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('tenantOrganizeByPk', selectionSet, { id });
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

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertTenantOrganize', selectionSet, objects, onConflict);

    for (const inserted of data.insertTenantOrganize.returning) {
      const tenantOrganize = await this.tenantOrganizeRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.TenantOrganize, tenantOrganize);
    }

    // Custom logic
    return data.insertTenantOrganize;
  }

  async updateTenantOrganizeMany(selectionSet: string[], updates: Array<TenantOrganizeUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const tenantOrganizes = await this.tenantOrganizeRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const tenantOrganize = tenantOrganizes.find((tenantOrganize) => tenantOrganize.id === update.where.id._eq);
      if (!tenantOrganize) throw new NotFoundException(`TenantOrganize (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, tenantOrganize);
      if (!canUpdate)
        throw new ForbiddenException(`You are not allowed to update TenantOrganize (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateTenantOrganizeMany', selectionSet, updates);

    await Promise.all(
      tenantOrganizes.map(async (tenantOrganize) => {
        const update = updates.find((update) => update.where.id._eq === tenantOrganize.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.TenantOrganize, tenantOrganize, update._set);
      }),
    );

    // Custom logic
    return data.updateTenantOrganizeMany;
  }

  async updateTenantOrganizeByPk(
    selectionSet: string[],
    pkColumns: TenantOrganizePkColumnsInput,
    _set: TenantOrganizeSetInput,
  ) {
    const tenantOrganize = await this.tenantOrganizeRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, tenantOrganize);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TenantOrganize (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTenantOrganizeByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.TenantOrganize, tenantOrganize, _set);

    // Custom logic
    return data.updateTenantOrganizeByPk;
  }

  async deleteTenantOrganize(selectionSet: string[], where: TenantOrganizeBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const tenantOrganizes = await this.tenantOrganizeRepository.findByIds(where.id._in);
    for (const tenantOrganize of tenantOrganizes) {
      const canDelete = this.checkPermsDelete(tenantOrganize);
      if (!canDelete)
        throw new ForbiddenException(`You are not allowed to delete TenantOrganize (${tenantOrganize.id}).`);
    }

    const data = await this.hasuraService.update('updateTenantOrganize', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      tenantOrganizes.map(async (tenantOrganize) => {
        await this.logsService.deleteLog(EntityName.TenantOrganize, tenantOrganize.id);
      }),
    );

    // Custom logic
    return data.updateTenantOrganize;
  }

  async deleteTenantOrganizeByPk(selectionSet: string[], id: string) {
    const tenantOrganize = await this.tenantOrganizeRepository.findOneOrFail(id);

    const canDelete = this.checkPermsDelete(tenantOrganize);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TenantOrganize (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateTenantOrganizeByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

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
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'tenantOrganizeAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.tenantOrganizeAggregate;
  }
}
