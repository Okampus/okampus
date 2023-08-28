import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { RoleRepository, Role } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  RoleInsertInput,
  RoleOnConflict,
  RoleBoolExp,
  RoleOrderBy,
  RoleSelectColumn,
  RoleSetInput,
  RoleUpdates,
  RolePkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class RolesService extends RequestContext {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly roleRepository: RoleRepository,
  ) {
    super();
  }

  checkPermsCreate(props: RoleInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(role: Role) {
    if (role.deletedAt) throw new NotFoundException(`Role was deleted on ${role.deletedAt}.`);
    if (this.requester().adminRoles.getItems().some((role) => role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === role.tenant?.id)) 
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: RoleSetInput, role: Role) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (role.deletedAt) throw new NotFoundException(`Role was deleted on ${role.deletedAt}.`);
    if (role.hiddenAt) throw new NotFoundException('Role must be unhidden before it can be updated.');

    if (this.requester().adminRoles.getItems().some((role) => role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === role.tenant?.id)) 
      return true;

    // Custom logic
    return role.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: RoleSetInput) {
    this.hasuraService.checkForbiddenFields(props);
    

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: RoleInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    
    

    return true;
  }

  async insertRoleOne(
    selectionSet: string[],
    object: RoleInsertInput,
    onConflict?: RoleOnConflict,
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Role.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertRoleOne', selectionSet, object, onConflict);
  
    const role = await this.roleRepository.findOneOrFail(data.insertRoleOne.id);
    await this.logsService.createLog(EntityName.Role, role);
    
    // Custom logic
    return data.insertRoleOne;
  }

  async findRole(
    selectionSet: string[],
    where: RoleBoolExp,
    orderBy?: Array<RoleOrderBy>,
    distinctOn?: Array<RoleSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('role', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.role;
  }

  async findRoleByPk(
    selectionSet: string[],
     id: string, 
  ) {
    // Custom logic
    const data = await this.hasuraService.findByPk('roleByPk', selectionSet, {  id,  });
    return data.roleByPk;
  }

  async insertRole(
    selectionSet: string[],
    objects: Array<RoleInsertInput>,
    onConflict?: RoleOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Role.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertRole', selectionSet, objects, onConflict);

    for (const inserted of data.insertRole.returning) {
      const role = await this.roleRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Role, role);
    }

    // Custom logic
    return data.insertRole;
  }

  async updateRoleMany(
    selectionSet: string[],
    updates: Array<RoleUpdates>,
  ) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const roles = await this.roleRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const role = roles.find((role) => role.id === update.where.id._eq);
      if (!role) throw new NotFoundException(`Role (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, role);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Role (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateRoleMany', selectionSet, updates);

    await Promise.all(roles.map(async (role) => {
      const update = updates.find((update) => update.where.id._eq === role.id)
      if (!update) return;
      await this.logsService.updateLog(EntityName.Role, role, update._set);
    }));

    // Custom logic
    return data.updateRoleMany;
  }

  async updateRoleByPk(
    selectionSet: string[],
    pkColumns: RolePkColumnsInput,
    _set: RoleSetInput,
  ) {
    const role = await this.roleRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, role);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Role (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateRoleByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Role, role, _set);

    // Custom logic
    return data.updateRoleByPk;
  }

  async deleteRole(
    selectionSet: string[],
    where: RoleBoolExp,
  ) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect) throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const roles = await this.roleRepository.findByIds(where.id._in);
    for (const role of roles) {
      const canDelete = this.checkPermsDelete(role);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Role (${role.id}).`);
    }

    const data = await this.hasuraService.update('updateRole', selectionSet, where, { deletedAt: new Date().toISOString() });

    await Promise.all(roles.map(async (role) => {
      await this.logsService.deleteLog(EntityName.Role, role.id);
    }));

    // Custom logic
    return data.updateRole;
  }

  async deleteRoleByPk(
    selectionSet: string[],
    id: string,
  ) {
    const role = await this.roleRepository.findOneOrFail(id);

    const canDelete = this.checkPermsDelete(role);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Role (${id}).`);

    const data = await this.hasuraService.updateByPk('updateRoleByPk', selectionSet, { id }, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Role, id);
    // Custom logic
    return data.updateRoleByPk;
  }

  async aggregateRole(
    selectionSet: string[],
    where: RoleBoolExp,
    orderBy?: Array<RoleOrderBy>,
    distinctOn?: Array<RoleSelectColumn>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate('roleAggregate', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.roleAggregate;
  }
}