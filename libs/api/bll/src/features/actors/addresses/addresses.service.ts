import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { AddressRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { Address } from '@okampus/api/dal';
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

  async checkPermsCreate(props: AddressInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    

    // Custom logic
    return false;
  }

  async checkPermsDelete(address: Address) {
    if (address.deletedAt) throw new NotFoundException(`Address was deleted on ${address.deletedAt}.`);
    

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: AddressSetInput, address: Address) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (address.deletedAt) throw new NotFoundException(`Address was deleted on ${address.deletedAt}.`);
    

    // Custom logic
    return address.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: AddressSetInput) {
    this.hasuraService.checkForbiddenFields(props);
    

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: AddressInsertInput) {
    // Custom logic
    
    props.createdById = this.requester().id;

    
    

    return true;
  }

  async insertAddressOne(
    selectionSet: string[],
    object: AddressInsertInput,
    onConflict?: AddressOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Address.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
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

  async findAddressByPk(
    selectionSet: string[],
     id: string, 
  ) {
    // Custom logic
    const data = await this.hasuraService.findByPk('addressByPk', selectionSet, {  id,  });
    return data.addressByPk;
  }

  async insertAddress(
    selectionSet: string[],
    objects: Array<AddressInsertInput>,
    onConflict?: AddressOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Address.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertAddress', selectionSet, objects, onConflict);

    for (const inserted of data.insertAddress.returning) {
      const address = await this.addressRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Address, address);
    }

    // Custom logic
    return data.insertAddress;
  }

  async updateAddressMany(
    selectionSet: string[],
    updates: Array<AddressUpdates>,
  ) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const addresses = await this.addressRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(updates.map(async (update) => {
      const address = addresses.find((address) => address.id === update.where.id._eq);
      if (!address) throw new NotFoundException(`Address (${update.where.id._eq}) was not found.`);

      const canUpdate = await this.checkPermsUpdate(update._set, address);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Address (${update.where.id._eq}).`);

      const arePropsValid = await this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }));

    const data = await this.hasuraService.updateMany('updateAddressMany', selectionSet, updates);

    await Promise.all(addresses.map(async (address) => {
      const update = updates.find((update) => update.where.id._eq === address.id)
      if (!update) return;
      await this.logsService.updateLog(EntityName.Address, address, update._set);
    }));

    // Custom logic
    return data.updateAddressMany;
  }

  async updateAddressByPk(
    selectionSet: string[],
    pkColumns: AddressPkColumnsInput,
    _set: AddressSetInput,
  ) {
    const address = await this.addressRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, address);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Address (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateAddressByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Address, address, _set);

    // Custom logic
    return data.updateAddressByPk;
  }

  async deleteAddress(
    selectionSet: string[],
    where: AddressBoolExp,
  ) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect) throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const addresses = await this.addressRepository.findByIds(where.id._in);

    await Promise.all(addresses.map(async (address) => {
      const canDelete = await this.checkPermsDelete(address);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Address (${address.id}).`);
    }));

    const data = await this.hasuraService.update('updateAddress', selectionSet, where, { deletedAt: new Date().toISOString() });

    await Promise.all(addresses.map(async (address) => {
      await this.logsService.deleteLog(EntityName.Address, address.id);
    }));

    // Custom logic
    return data.updateAddress;
  }

  async deleteAddressByPk(
    selectionSet: string[],
    id: string,
  ) {
    const address = await this.addressRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(address);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Address (${id}).`);

    const data = await this.hasuraService.updateByPk('updateAddressByPk', selectionSet, { id }, {
      deletedAt: new Date().toISOString(),
    });

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
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate('addressAggregate', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.addressAggregate;
  }
}