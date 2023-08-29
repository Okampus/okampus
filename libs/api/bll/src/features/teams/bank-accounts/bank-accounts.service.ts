import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { BankAccountRepository, BankAccount } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  BankAccountInsertInput,
  BankAccountOnConflict,
  BankAccountBoolExp,
  BankAccountOrderBy,
  BankAccountSelectColumn,
  BankAccountSetInput,
  BankAccountUpdates,
  BankAccountPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class BankAccountsService extends RequestContext {
  private readonly logger = new Logger(BankAccountsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly bankAccountRepository: BankAccountRepository,
  ) {
    super();
  }

  checkPermsCreate(props: BankAccountInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(bankAccount: BankAccount) {
    if (bankAccount.deletedAt) throw new NotFoundException(`BankAccount was deleted on ${bankAccount.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) &&
            role.tenant?.id === bankAccount.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: BankAccountSetInput, bankAccount: BankAccount) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (bankAccount.deletedAt) throw new NotFoundException(`BankAccount was deleted on ${bankAccount.deletedAt}.`);
    if (bankAccount.hiddenAt) throw new NotFoundException('BankAccount must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) &&
            role.tenant?.id === bankAccount.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return bankAccount.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: BankAccountSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: BankAccountInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertBankAccountOne(
    selectionSet: string[],
    object: BankAccountInsertInput,
    onConflict?: BankAccountOnConflict,
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert BankAccount.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertBankAccountOne', selectionSet, object, onConflict);

    const bankAccount = await this.bankAccountRepository.findOneOrFail(data.insertBankAccountOne.id);
    await this.logsService.createLog(EntityName.BankAccount, bankAccount);

    // Custom logic
    return data.insertBankAccountOne;
  }

  async findBankAccount(
    selectionSet: string[],
    where: BankAccountBoolExp,
    orderBy?: Array<BankAccountOrderBy>,
    distinctOn?: Array<BankAccountSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('bankAccount', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.bankAccount;
  }

  async findBankAccountByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('bankAccountByPk', selectionSet, { id });
    return data.bankAccountByPk;
  }

  async insertBankAccount(
    selectionSet: string[],
    objects: Array<BankAccountInsertInput>,
    onConflict?: BankAccountOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert BankAccount.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertBankAccount', selectionSet, objects, onConflict);

    for (const inserted of data.insertBankAccount.returning) {
      const bankAccount = await this.bankAccountRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.BankAccount, bankAccount);
    }

    // Custom logic
    return data.insertBankAccount;
  }

  async updateBankAccountMany(selectionSet: string[], updates: Array<BankAccountUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const bankAccounts = await this.bankAccountRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const bankAccount = bankAccounts.find((bankAccount) => bankAccount.id === update.where.id._eq);
      if (!bankAccount) throw new NotFoundException(`BankAccount (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, bankAccount);
      if (!canUpdate)
        throw new ForbiddenException(`You are not allowed to update BankAccount (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateBankAccountMany', selectionSet, updates);

    await Promise.all(
      bankAccounts.map(async (bankAccount) => {
        const update = updates.find((update) => update.where.id._eq === bankAccount.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.BankAccount, bankAccount, update._set);
      }),
    );

    // Custom logic
    return data.updateBankAccountMany;
  }

  async updateBankAccountByPk(selectionSet: string[], pkColumns: BankAccountPkColumnsInput, _set: BankAccountSetInput) {
    const bankAccount = await this.bankAccountRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, bankAccount);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update BankAccount (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateBankAccountByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.BankAccount, bankAccount, _set);

    // Custom logic
    return data.updateBankAccountByPk;
  }

  async deleteBankAccount(selectionSet: string[], where: BankAccountBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const bankAccounts = await this.bankAccountRepository.findByIds(where.id._in);
    for (const bankAccount of bankAccounts) {
      const canDelete = this.checkPermsDelete(bankAccount);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete BankAccount (${bankAccount.id}).`);
    }

    const data = await this.hasuraService.update('updateBankAccount', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      bankAccounts.map(async (bankAccount) => {
        await this.logsService.deleteLog(EntityName.BankAccount, bankAccount.id);
      }),
    );

    // Custom logic
    return data.updateBankAccount;
  }

  async deleteBankAccountByPk(selectionSet: string[], id: string) {
    const bankAccount = await this.bankAccountRepository.findOneOrFail(id);

    const canDelete = this.checkPermsDelete(bankAccount);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete BankAccount (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateBankAccountByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.BankAccount, id);
    // Custom logic
    return data.updateBankAccountByPk;
  }

  async aggregateBankAccount(
    selectionSet: string[],
    where: BankAccountBoolExp,
    orderBy?: Array<BankAccountOrderBy>,
    distinctOn?: Array<BankAccountSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'bankAccountAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.bankAccountAggregate;
  }
}
