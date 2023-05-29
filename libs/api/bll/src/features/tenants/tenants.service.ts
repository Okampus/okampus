import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
import { BadRequestException, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TenantRepository } from '@okampus/api/dal';
import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class TenantsService extends RequestContext {
  constructor(private readonly tenantRepository: TenantRepository, private readonly hasuraService: HasuraService) {
    super();
  }

  validateProps(props: ValueTypes['TenantInsertInput']) {
    // Custom logic
    return true;
  }

  async insertTenant(
    selectionSet: string[],
    objects: Array<ValueTypes['TenantInsertInput']>,
    onConflict?: ValueTypes['TenantOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await objects.every((object) => this.validateProps(object));
    if (!arePropsValid) throw new BadRequestException('Cannot insert Tenant with invalid props.');

    const data = await this.hasuraService.insert('insertTenant', selectionSet, objects, onConflict, insertOne);
    // Custom logic
    return data.insertTenant;
  }

  async updateTenant(selectionSet: string[], where: ValueTypes['TenantBoolExp'], _set: ValueTypes['TenantSetInput']) {
    const arePropsValid = this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Tenant with invalid props.');

    const data = await this.hasuraService.update('updateTenant', selectionSet, where, _set);
    // Custom logic
    return data.updateTenant;
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
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Tenant with invalid props.');

    const data = await this.hasuraService.updateByPk('updateTenantByPk', selectionSet, pkColumns, _set);
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
