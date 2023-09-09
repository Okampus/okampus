import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { RequiredRoleRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { RequiredRole } from '@okampus/api/dal';
import type {
  RequiredRoleInsertInput,
  RequiredRoleOnConflict,
  RequiredRoleBoolExp,
  RequiredRoleOrderBy,
  RequiredRoleSelectColumn,
  RequiredRoleSetInput,
  RequiredRoleUpdates,
  RequiredRolePkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class RequiredRolesService extends RequestContext {
  private readonly logger = new Logger(RequiredRolesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly requiredRoleRepository: RequiredRoleRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: RequiredRoleInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(requiredRole: RequiredRole) {
    if (requiredRole.deletedAt) throw new NotFoundException(`RequiredRole was deleted on ${requiredRole.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canDeleteTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: RequiredRoleSetInput, requiredRole: RequiredRole) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (requiredRole.deletedAt) throw new NotFoundException(`RequiredRole was deleted on ${requiredRole.deletedAt}.`);
    if (requiredRole.hiddenAt) throw new NotFoundException('RequiredRole must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return requiredRole.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: RequiredRoleSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: RequiredRoleInsertInput) {
    // Custom logic
    props.tenantScopeId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertRequiredRoleOne(
    selectionSet: string[],
    object: RequiredRoleInsertInput,
    onConflict?: RequiredRoleOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert RequiredRole.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertRequiredRoleOne', selectionSet, object, onConflict);

    const requiredRole = await this.requiredRoleRepository.findOneOrFail(data.insertRequiredRoleOne.id);
    await this.logsService.createLog(EntityName.RequiredRole, requiredRole);

    // Custom logic
    return data.insertRequiredRoleOne;
  }

  async findRequiredRole(
    selectionSet: string[],
    where: RequiredRoleBoolExp,
    orderBy?: Array<RequiredRoleOrderBy>,
    distinctOn?: Array<RequiredRoleSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('requiredRole', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.requiredRole;
  }

  async findRequiredRoleByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('requiredRoleByPk', selectionSet, { id });
    return data.requiredRoleByPk;
  }

  async insertRequiredRole(
    selectionSet: string[],
    objects: Array<RequiredRoleInsertInput>,
    onConflict?: RequiredRoleOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert RequiredRole.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertRequiredRole', selectionSet, objects, onConflict);

    for (const inserted of data.insertRequiredRole.returning) {
      const requiredRole = await this.requiredRoleRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.RequiredRole, requiredRole);
    }

    // Custom logic
    return data.insertRequiredRole;
  }

  async updateRequiredRoleMany(selectionSet: string[], updates: Array<RequiredRoleUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const requiredRoles = await this.requiredRoleRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const requiredRole = requiredRoles.find((requiredRole) => requiredRole.id === update.where.id._eq);
        if (!requiredRole) throw new NotFoundException(`RequiredRole (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, requiredRole);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update RequiredRole (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateRequiredRoleMany', selectionSet, updates);

    await Promise.all(
      requiredRoles.map(async (requiredRole) => {
        const update = updates.find((update) => update.where.id._eq === requiredRole.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.RequiredRole, requiredRole, update._set);
      }),
    );

    // Custom logic
    return data.updateRequiredRoleMany;
  }

  async updateRequiredRoleByPk(
    selectionSet: string[],
    pkColumns: RequiredRolePkColumnsInput,
    _set: RequiredRoleSetInput,
  ) {
    const requiredRole = await this.requiredRoleRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, requiredRole);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update RequiredRole (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateRequiredRoleByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.RequiredRole, requiredRole, _set);

    // Custom logic
    return data.updateRequiredRoleByPk;
  }

  async deleteRequiredRole(selectionSet: string[], where: RequiredRoleBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const requiredRoles = await this.requiredRoleRepository.findByIds(where.id._in);

    await Promise.all(
      requiredRoles.map(async (requiredRole) => {
        const canDelete = await this.checkPermsDelete(requiredRole);
        if (!canDelete)
          throw new ForbiddenException(`You are not allowed to delete RequiredRole (${requiredRole.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateRequiredRole', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      requiredRoles.map(async (requiredRole) => {
        await this.logsService.deleteLog(EntityName.RequiredRole, requiredRole.id);
      }),
    );

    // Custom logic
    return data.updateRequiredRole;
  }

  async deleteRequiredRoleByPk(selectionSet: string[], id: string) {
    const requiredRole = await this.requiredRoleRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(requiredRole);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete RequiredRole (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateRequiredRoleByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.RequiredRole, id);
    // Custom logic
    return data.updateRequiredRoleByPk;
  }

  async aggregateRequiredRole(
    selectionSet: string[],
    where: RequiredRoleBoolExp,
    orderBy?: Array<RequiredRoleOrderBy>,
    distinctOn?: Array<RequiredRoleSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'requiredRoleAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.requiredRoleAggregate;
  }
}
