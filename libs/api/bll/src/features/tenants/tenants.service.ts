import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TenantRepository, Tenant } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class TenantsService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly tenantRepository: TenantRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['TenantInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const tenant = await this.tenantRepository.findOneOrFail(id);
    if (tenant.deletedAt) throw new NotFoundException(`Tenant was deleted on ${tenant.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['TenantSetInput'], tenant: Tenant) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (tenant.deletedAt) throw new NotFoundException(`Tenant was deleted on ${tenant.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return tenant.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['TenantSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['TenantInsertInput']) {
    // Custom logic
    return true;
  }

  async insertTenant(
    selectionSet: string[],
    objects: Array<ValueTypes['TenantInsertInput']>,
    onConflict?: ValueTypes['TenantOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await Promise.all(
      objects.map(async (props) => {
        const canCreate = await this.checkPermsCreate(props);
        if (!canCreate) throw new ForbiddenException('You are not allowed to insert Tenant.');

        const arePropsValid = await this.checkPropsConstraints(props);
        if (!arePropsValid) throw new BadRequestException('Props are not valid.');

        const areRelationshipsValid = await this.checkCreateRelationships(props);
        if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

        return canCreate && arePropsValid && areRelationshipsValid;
      })
    ).then((results) => results.every(Boolean));

    if (!arePropsValid) throw new ForbiddenException('You are not allowed to insert Tenant.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insert('insertTenant', selectionSet, objects, onConflict, insertOne);

    for (const inserted of data.insertTenant.returning) {
      const tenant = await this.tenantRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Tenant, tenant);
    }

    // Custom logic
    return data.insertTenant;
  }

  async findTenant(
    selectionSet: string[],
    where: ValueTypes['TenantBoolExp'],
    orderBy?: Array<ValueTypes['TenantOrderBy']>,
    distinctOn?: Array<ValueTypes['TenantSelectColumn']>,
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

  async updateTenantByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['TenantPkColumnsInput'],
    _set: ValueTypes['TenantSetInput']
  ) {
    const tenant = await this.tenantRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, tenant);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Tenant (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateTenantByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Tenant, tenant, _set);

    // Custom logic
    return data.updateTenantByPk;
  }

  async deleteTenantByPk(selectionSet: string[], pkColumns: ValueTypes['TenantPkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
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
    where: ValueTypes['TenantBoolExp'],
    orderBy?: Array<ValueTypes['TenantOrderBy']>,
    distinctOn?: Array<ValueTypes['TenantSelectColumn']>,
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
