import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { BankRepository, Bank } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  BankInsertInput,
  BankOnConflict,
  BankBoolExp,
  BankOrderBy,
  BankSelectColumn,
  BankSetInput,
  BankUpdates,
  BankPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class BanksService extends RequestContext {
  private readonly logger = new Logger(BanksService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly bankRepository: BankRepository,
  ) {
    super();
  }

  checkPermsCreate(props: BankInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(bank: Bank) {
    if (bank.deletedAt) throw new NotFoundException(`Bank was deleted on ${bank.deletedAt}.`);
    if (this.requester().adminRoles.getItems().some((role) => role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === bank.tenant?.id)) 
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: BankSetInput, bank: Bank) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (bank.deletedAt) throw new NotFoundException(`Bank was deleted on ${bank.deletedAt}.`);
    if (bank.hiddenAt) throw new NotFoundException('Bank must be unhidden before it can be updated.');

    if (this.requester().adminRoles.getItems().some((role) => role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === bank.tenant?.id)) 
      return true;

    // Custom logic
    return bank.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: BankSetInput) {
    this.hasuraService.checkForbiddenFields(props);
    

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: BankInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    
    

    return true;
  }

  async insertBankOne(
    selectionSet: string[],
    object: BankInsertInput,
    onConflict?: BankOnConflict,
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Bank.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertBankOne', selectionSet, object, onConflict);
  
    const bank = await this.bankRepository.findOneOrFail(data.insertBankOne.id);
    await this.logsService.createLog(EntityName.Bank, bank);
    
    // Custom logic
    return data.insertBankOne;
  }

  async findBank(
    selectionSet: string[],
    where: BankBoolExp,
    orderBy?: Array<BankOrderBy>,
    distinctOn?: Array<BankSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('bank', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.bank;
  }

  async findBankByPk(
    selectionSet: string[],
     id: string, 
  ) {
    // Custom logic
    const data = await this.hasuraService.findByPk('bankByPk', selectionSet, {  id,  });
    return data.bankByPk;
  }

  async insertBank(
    selectionSet: string[],
    objects: Array<BankInsertInput>,
    onConflict?: BankOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Bank.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertBank', selectionSet, objects, onConflict);

    for (const inserted of data.insertBank.returning) {
      const bank = await this.bankRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Bank, bank);
    }

    // Custom logic
    return data.insertBank;
  }

  async updateBankMany(
    selectionSet: string[],
    updates: Array<BankUpdates>,
  ) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const banks = await this.bankRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const bank = banks.find((bank) => bank.id === update.where.id._eq);
      if (!bank) throw new NotFoundException(`Bank (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, bank);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Bank (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateBankMany', selectionSet, updates);

    await Promise.all(banks.map(async (bank) => {
      const update = updates.find((update) => update.where.id._eq === bank.id)
      if (!update) return;
      await this.logsService.updateLog(EntityName.Bank, bank, update._set);
    }));

    // Custom logic
    return data.updateBankMany;
  }

  async updateBankByPk(
    selectionSet: string[],
    pkColumns: BankPkColumnsInput,
    _set: BankSetInput,
  ) {
    const bank = await this.bankRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, bank);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Bank (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateBankByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Bank, bank, _set);

    // Custom logic
    return data.updateBankByPk;
  }

  async deleteBank(
    selectionSet: string[],
    where: BankBoolExp,
  ) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect) throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const banks = await this.bankRepository.findByIds(where.id._in);
    for (const bank of banks) {
      const canDelete = this.checkPermsDelete(bank);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Bank (${bank.id}).`);
    }

    const data = await this.hasuraService.update('updateBank', selectionSet, where, { deletedAt: new Date().toISOString() });

    await Promise.all(banks.map(async (bank) => {
      await this.logsService.deleteLog(EntityName.Bank, bank.id);
    }));

    // Custom logic
    return data.updateBank;
  }

  async deleteBankByPk(
    selectionSet: string[],
    id: string,
  ) {
    const bank = await this.bankRepository.findOneOrFail(id);

    const canDelete = this.checkPermsDelete(bank);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Bank (${id}).`);

    const data = await this.hasuraService.updateByPk('updateBankByPk', selectionSet, { id }, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Bank, id);
    // Custom logic
    return data.updateBankByPk;
  }

  async aggregateBank(
    selectionSet: string[],
    where: BankBoolExp,
    orderBy?: Array<BankOrderBy>,
    distinctOn?: Array<BankSelectColumn>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate('bankAggregate', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.bankAggregate;
  }
}