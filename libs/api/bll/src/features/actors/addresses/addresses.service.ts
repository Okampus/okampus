import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { AddressRepository, Address } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  AddressInsertInput,
  AddressOnConflict,
  AddressBoolExp,
  AddressOrderBy,
  AddressSelectColumn,
  AddressSetInput,
  AddressUpdates,
  AddressPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class AddressesService extends RequestContext {
  private readonly logger = new Logger(AddressesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly addressRepository: AddressRepository,
  ) {
    super();
  }

  checkPermsCreate(props: AddressInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(address: Address) {
    if (address.deletedAt) throw new NotFoundException(`Address was deleted on ${address.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) => role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === address.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: AddressSetInput, address: Address) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (address.deletedAt) throw new NotFoundException(`Address was deleted on ${address.deletedAt}.`);

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) => role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === address.id,
        )
    )
      return true;

    // Custom logic
    return address.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: AddressSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: AddressInsertInput) {
    // Custom logic

    props.createdById = this.requester().id;

    return true;
  }

  async insertAddressOne(selectionSet: string[], object: AddressInsertInput, onConflict?: AddressOnConflict) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Address.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertAddressOne', selectionSet, object, onConflict);

    const address = await this.addressRepository.findOneOrFail(data.insertAddressOne.id);
    await this.logsService.createLog(EntityName.Address, address);

    // Custom logic
    return data.insertAddressOne;
  }

  async findAddress(
    selectionSet: string[],
    where: AddressBoolExp,
    orderBy?: Array<AddressOrderBy>,
    distinctOn?: Array<AddressSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('address', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.address;
  }

  async findAddressByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('addressByPk', selectionSet, { id });
    return data.addressByPk;
  }

  async insertAddress(selectionSet: string[], objects: Array<AddressInsertInput>, onConflict?: AddressOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Address.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertAddress', selectionSet, objects, onConflict);

    for (const inserted of data.insertAddress.returning) {
      const address = await this.addressRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Address, address);
    }

    // Custom logic
    return data.insertAddress;
  }

  async updateAddressMany(selectionSet: string[], updates: Array<AddressUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const addresses = await this.addressRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const address = addresses.find((address) => address.id === update.where.id._eq);
      if (!address) throw new NotFoundException(`Address (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, address);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Address (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateAddressMany', selectionSet, updates);

    await Promise.all(
      addresses.map(async (address) => {
        const update = updates.find((update) => update.where.id._eq === address.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Address, address, update._set);
      }),
    );

    // Custom logic
    return data.updateAddressMany;
  }

  async updateAddressByPk(selectionSet: string[], pkColumns: AddressPkColumnsInput, _set: AddressSetInput) {
    const address = await this.addressRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, address);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Address (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateAddressByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Address, address, _set);

    // Custom logic
    return data.updateAddressByPk;
  }

  async deleteAddress(selectionSet: string[], where: AddressBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const addresses = await this.addressRepository.findByIds(where.id._in);
    for (const address of addresses) {
      const canDelete = this.checkPermsDelete(address);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Address (${address.id}).`);
    }

    const data = await this.hasuraService.update('updateAddress', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      addresses.map(async (address) => {
        await this.logsService.deleteLog(EntityName.Address, address.id);
      }),
    );

    // Custom logic
    return data.updateAddress;
  }

  async deleteAddressByPk(selectionSet: string[], id: string) {
    const address = await this.addressRepository.findOneOrFail(id);

    const canDelete = this.checkPermsDelete(address);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Address (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateAddressByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.Address, id);
    // Custom logic
    return data.updateAddressByPk;
  }

  async aggregateAddress(
    selectionSet: string[],
    where: AddressBoolExp,
    orderBy?: Array<AddressOrderBy>,
    distinctOn?: Array<AddressSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'addressAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.addressAggregate;
  }
}
