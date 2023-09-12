import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { TenantMemberRoleRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { TenantMemberRole } from '@okampus/api/dal';
import type {
  TenantMemberRoleInsertInput,
  TenantMemberRoleOnConflict,
  TenantMemberRoleBoolExp,
  TenantMemberRoleOrderBy,
  TenantMemberRoleSelectColumn,
  TenantMemberRoleSetInput,
  TenantMemberRoleUpdates,
  TenantMemberRolePkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class TenantMemberRolesService extends RequestContext {
  private readonly logger = new Logger(TenantMemberRolesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly tenantMemberRoleRepository: TenantMemberRoleRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: TenantMemberRoleInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return false;
  }

  async checkPermsDelete(tenantMemberRole: TenantMemberRole) {
    if (tenantMemberRole.deletedAt)
      throw new NotFoundException(`TenantMemberRole was deleted on ${tenantMemberRole.deletedAt}.`);

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: TenantMemberRoleSetInput, tenantMemberRole: TenantMemberRole) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (tenantMemberRole.deletedAt)
      throw new NotFoundException(`TenantMemberRole was deleted on ${tenantMemberRole.deletedAt}.`);

    // Custom logic
    return tenantMemberRole.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: TenantMemberRoleSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: TenantMemberRoleInsertInput) {
    // Custom logic

    props.createdById = this.requester().id;

    return true;
  }

  async insertTenantMemberRoleOne(
    selectionSet: string[],
    object: TenantMemberRoleInsertInput,
    onConflict?: TenantMemberRoleOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert TenantMemberRole.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertTenantMemberRoleOne', selectionSet, object, onConflict);

    const tenantMemberRole = await this.tenantMemberRoleRepository.findOneOrFail(data.insertTenantMemberRoleOne.id);
    await this.logsService.createLog(EntityName.TenantMemberRole, tenantMemberRole);

    // Custom logic
    return data.insertTenantMemberRoleOne;
  }

  async findTenantMemberRole(
    selectionSet: string[],
    where: TenantMemberRoleBoolExp,
    orderBy?: Array<TenantMemberRoleOrderBy>,
    distinctOn?: Array<TenantMemberRoleSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'tenantMemberRole',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.tenantMemberRole;
  }

  async findTenantMemberRoleByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('tenantMemberRoleByPk', selectionSet, { id });
    return data.tenantMemberRoleByPk;
  }

  async insertTenantMemberRole(
    selectionSet: string[],
    objects: Array<TenantMemberRoleInsertInput>,
    onConflict?: TenantMemberRoleOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert TenantMemberRole.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertTenantMemberRole', selectionSet, objects, onConflict);

    for (const inserted of data.insertTenantMemberRole.returning) {
      const tenantMemberRole = await this.tenantMemberRoleRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.TenantMemberRole, tenantMemberRole);
    }

    // Custom logic
    return data.insertTenantMemberRole;
  }

  async updateTenantMemberRoleMany(selectionSet: string[], updates: Array<TenantMemberRoleUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const tenantMemberRoles = await this.tenantMemberRoleRepository.findByIds(
      updates.map((update) => update.where.id._eq),
    );

    await Promise.all(
      updates.map(async (update) => {
        const tenantMemberRole = tenantMemberRoles.find(
          (tenantMemberRole) => tenantMemberRole.id === update.where.id._eq,
        );
        if (!tenantMemberRole) throw new NotFoundException(`TenantMemberRole (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, tenantMemberRole);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update TenantMemberRole (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateTenantMemberRoleMany', selectionSet, updates);

    await Promise.all(
      tenantMemberRoles.map(async (tenantMemberRole) => {
        const update = updates.find((update) => update.where.id._eq === tenantMemberRole.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.TenantMemberRole, tenantMemberRole, update._set);
      }),
    );

    // Custom logic
    return data.updateTenantMemberRoleMany;
  }

  async updateTenantMemberRoleByPk(
    selectionSet: string[],
    pkColumns: TenantMemberRolePkColumnsInput,
    _set: TenantMemberRoleSetInput,
  ) {
    const tenantMemberRole = await this.tenantMemberRoleRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, tenantMemberRole);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TenantMemberRole (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTenantMemberRoleByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.TenantMemberRole, tenantMemberRole, _set);

    // Custom logic
    return data.updateTenantMemberRoleByPk;
  }

  async deleteTenantMemberRole(selectionSet: string[], where: TenantMemberRoleBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const tenantMemberRoles = await this.tenantMemberRoleRepository.findByIds(where.id._in);

    await Promise.all(
      tenantMemberRoles.map(async (tenantMemberRole) => {
        const canDelete = await this.checkPermsDelete(tenantMemberRole);
        if (!canDelete)
          throw new ForbiddenException(`You are not allowed to delete TenantMemberRole (${tenantMemberRole.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateTenantMemberRole', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      tenantMemberRoles.map(async (tenantMemberRole) => {
        await this.logsService.deleteLog(EntityName.TenantMemberRole, tenantMemberRole.id);
      }),
    );

    // Custom logic
    return data.updateTenantMemberRole;
  }

  async deleteTenantMemberRoleByPk(selectionSet: string[], id: string) {
    const tenantMemberRole = await this.tenantMemberRoleRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(tenantMemberRole);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TenantMemberRole (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateTenantMemberRoleByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.TenantMemberRole, id);
    // Custom logic
    return data.updateTenantMemberRoleByPk;
  }

  async aggregateTenantMemberRole(
    selectionSet: string[],
    where: TenantMemberRoleBoolExp,
    orderBy?: Array<TenantMemberRoleOrderBy>,
    distinctOn?: Array<TenantMemberRoleSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'tenantMemberRoleAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.tenantMemberRoleAggregate;
  }
}
