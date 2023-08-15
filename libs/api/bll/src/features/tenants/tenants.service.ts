import { RequestContext } from '../../shards/abstract/request-context';
import { HasuraService } from '../../global/graphql/hasura.service';
import { LogsService } from '../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { TenantRepository, Tenant } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  TenantInsertInput,
  TenantOnConflict,
  TenantBoolExp,
  TenantOrderBy,
  TenantSelectColumn,
  TenantSetInput,
  TenantUpdates,
  TenantPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class TenantsService extends RequestContext {
  private readonly logger = new Logger(TenantsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly tenantRepository: TenantRepository
  ) {
    super();
  }

  checkPermsCreate(props: TenantInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(tenant: Tenant) {
    if (tenant.deletedAt) throw new NotFoundException(`Tenant was deleted on ${tenant.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) => role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === tenant.id
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: TenantSetInput, tenant: Tenant) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (tenant.deletedAt) throw new NotFoundException(`Tenant was deleted on ${tenant.deletedAt}.`);

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) => role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === tenant.id
        )
    )
      return true;

    // Custom logic
    return tenant.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: TenantSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: TenantInsertInput) {
    // Custom logic

    props.createdById = this.requester().id;

    return true;
  }

  async insertTenantOne(selectionSet: string[], object: TenantInsertInput, onConflict?: TenantOnConflict) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Tenant.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertTenantOne', selectionSet, object, onConflict);

    const tenant = await this.tenantRepository.findOneOrFail(data.insertTenantOne.id);
    await this.logsService.createLog(EntityName.Tenant, tenant);

    // Custom logic
    return data.insertTenantOne;
  }

  async findTenant(
    selectionSet: string[],
    where: TenantBoolExp,
    orderBy?: Array<TenantOrderBy>,
    distinctOn?: Array<TenantSelectColumn>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('tenant', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.tenant;
  }

  async findTenantByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('tenantByPk', selectionSet, { id });
    return data.tenantByPk;
  }

  async insertTenant(selectionSet: string[], objects: Array<TenantInsertInput>, onConflict?: TenantOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Tenant.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertTenant', selectionSet, objects, onConflict);

    for (const inserted of data.insertTenant.returning) {
      const tenant = await this.tenantRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Tenant, tenant);
    }

    // Custom logic
    return data.insertTenant;
  }

  async updateTenantMany(selectionSet: string[], updates: Array<TenantUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const tenants = await this.tenantRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const tenant = tenants.find((tenant) => tenant.id === update.where.id._eq);
      if (!tenant) throw new NotFoundException(`Tenant (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, tenant);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Tenant (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateTenantMany', selectionSet, updates);

    await Promise.all(
      tenants.map(async (tenant) => {
        const update = updates.find((update) => update.where.id._eq === tenant.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Tenant, tenant, update._set);
      })
    );

    // Custom logic
    return data.updateTenantMany;
  }

  async updateTenantByPk(selectionSet: string[], pkColumns: TenantPkColumnsInput, _set: TenantSetInput) {
    const tenant = await this.tenantRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, tenant);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Tenant (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTenantByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Tenant, tenant, _set);

    // Custom logic
    return data.updateTenantByPk;
  }

  async deleteTenant(selectionSet: string[], where: TenantBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const tenants = await this.tenantRepository.findByIds(where.id._in);
    for (const tenant of tenants) {
      const canDelete = this.checkPermsDelete(tenant);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Tenant (${tenant.id}).`);
    }

    const data = await this.hasuraService.update('updateTenant', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      tenants.map(async (tenant) => {
        await this.logsService.deleteLog(EntityName.Tenant, tenant.id);
      })
    );

    // Custom logic
    return data.updateTenant;
  }

  async deleteTenantByPk(selectionSet: string[], pkColumns: TenantPkColumnsInput) {
    const tenant = await this.tenantRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(tenant);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Tenant (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateTenantByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Tenant, pkColumns.id);
    // Custom logic
    return data.updateTenantByPk;
  }

  async aggregateTenant(
    selectionSet: string[],
    where: TenantBoolExp,
    orderBy?: Array<TenantOrderBy>,
    distinctOn?: Array<TenantSelectColumn>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'tenantAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.tenantAggregate;
  }
}
