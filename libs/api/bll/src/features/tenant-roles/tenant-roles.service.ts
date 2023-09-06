import { RequestContext } from '../../shards/abstract/request-context';
import { HasuraService } from '../../global/graphql/hasura.service';
import { LogsService } from '../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { TenantRoleRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique, canAdminDelete, canAdminManage } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { TenantRole } from '@okampus/api/dal';
import type {
  TenantRoleInsertInput,
  TenantRoleOnConflict,
  TenantRoleBoolExp,
  TenantRoleOrderBy,
  TenantRoleSelectColumn,
  TenantRoleSetInput,
  TenantRoleUpdates,
  TenantRolePkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class TenantRolesService extends RequestContext {
  private readonly logger = new Logger(TenantRolesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly tenantRoleRepository: TenantRoleRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: TenantRoleInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, { tenantScope: this.tenant() }))) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(tenantRole: TenantRole) {
    if (tenantRole.deletedAt) throw new NotFoundException(`TenantRole was deleted on ${tenantRole.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminDelete(adminRole, tenantRole))) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: TenantRoleSetInput, tenantRole: TenantRole) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (tenantRole.deletedAt) throw new NotFoundException(`TenantRole was deleted on ${tenantRole.deletedAt}.`);
    if (tenantRole.hiddenAt) throw new NotFoundException('TenantRole must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, tenantRole))) return true;

    // Custom logic
    return tenantRole.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: TenantRoleSetInput) {
    this.hasuraService.checkForbiddenFields(props);
    

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: TenantRoleInsertInput) {
    // Custom logic
    props.tenantScopeId = this.tenant().id;
    props.createdById = this.requester().id;

    
    

    return true;
  }

  async insertTenantRoleOne(
    selectionSet: string[],
    object: TenantRoleInsertInput,
    onConflict?: TenantRoleOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert TenantRole.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertTenantRoleOne', selectionSet, object, onConflict);

    const tenantRole = await this.tenantRoleRepository.findOneOrFail(data.insertTenantRoleOne.id);
    await this.logsService.createLog(EntityName.TenantRole, tenantRole);

    // Custom logic
    return data.insertTenantRoleOne;
  }

  async findTenantRole(
    selectionSet: string[],
    where: TenantRoleBoolExp,
    orderBy?: Array<TenantRoleOrderBy>,
    distinctOn?: Array<TenantRoleSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('tenantRole', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.tenantRole;
  }

  async findTenantRoleByPk(
    selectionSet: string[],
     id: string, 
  ) {
    // Custom logic
    const data = await this.hasuraService.findByPk('tenantRoleByPk', selectionSet, {  id,  });
    return data.tenantRoleByPk;
  }

  async insertTenantRole(
    selectionSet: string[],
    objects: Array<TenantRoleInsertInput>,
    onConflict?: TenantRoleOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert TenantRole.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertTenantRole', selectionSet, objects, onConflict);

    for (const inserted of data.insertTenantRole.returning) {
      const tenantRole = await this.tenantRoleRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.TenantRole, tenantRole);
    }

    // Custom logic
    return data.insertTenantRole;
  }

  async updateTenantRoleMany(
    selectionSet: string[],
    updates: Array<TenantRoleUpdates>,
  ) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const tenantRoles = await this.tenantRoleRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(updates.map(async (update) => {
      const tenantRole = tenantRoles.find((tenantRole) => tenantRole.id === update.where.id._eq);
      if (!tenantRole) throw new NotFoundException(`TenantRole (${update.where.id._eq}) was not found.`);

      const canUpdate = await this.checkPermsUpdate(update._set, tenantRole);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TenantRole (${update.where.id._eq}).`);

      const arePropsValid = await this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }));

    const data = await this.hasuraService.updateMany('updateTenantRoleMany', selectionSet, updates);

    await Promise.all(tenantRoles.map(async (tenantRole) => {
      const update = updates.find((update) => update.where.id._eq === tenantRole.id)
      if (!update) return;
      await this.logsService.updateLog(EntityName.TenantRole, tenantRole, update._set);
    }));

    // Custom logic
    return data.updateTenantRoleMany;
  }

  async updateTenantRoleByPk(
    selectionSet: string[],
    pkColumns: TenantRolePkColumnsInput,
    _set: TenantRoleSetInput,
  ) {
    const tenantRole = await this.tenantRoleRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, tenantRole);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TenantRole (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTenantRoleByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.TenantRole, tenantRole, _set);

    // Custom logic
    return data.updateTenantRoleByPk;
  }

  async deleteTenantRole(
    selectionSet: string[],
    where: TenantRoleBoolExp,
  ) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect) throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const tenantRoles = await this.tenantRoleRepository.findByIds(where.id._in);

    await Promise.all(tenantRoles.map(async (tenantRole) => {
      const canDelete = await this.checkPermsDelete(tenantRole);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TenantRole (${tenantRole.id}).`);
    }));

    const data = await this.hasuraService.update('updateTenantRole', selectionSet, where, { deletedAt: new Date().toISOString() });

    await Promise.all(tenantRoles.map(async (tenantRole) => {
      await this.logsService.deleteLog(EntityName.TenantRole, tenantRole.id);
    }));

    // Custom logic
    return data.updateTenantRole;
  }

  async deleteTenantRoleByPk(
    selectionSet: string[],
    id: string,
  ) {
    const tenantRole = await this.tenantRoleRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(tenantRole);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TenantRole (${id}).`);

    const data = await this.hasuraService.updateByPk('updateTenantRoleByPk', selectionSet, { id }, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.TenantRole, id);
    // Custom logic
    return data.updateTenantRoleByPk;
  }

  async aggregateTenantRole(
    selectionSet: string[],
    where: TenantRoleBoolExp,
    orderBy?: Array<TenantRoleOrderBy>,
    distinctOn?: Array<TenantRoleSelectColumn>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate('tenantRoleAggregate', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.tenantRoleAggregate;
  }
}