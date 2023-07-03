import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AccountRepository, Account } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class AccountsService extends RequestContext {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly accountRepository: AccountRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['AccountInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(account: Account) {
    if (account.deletedAt) throw new NotFoundException(`Account was deleted on ${account.deletedAt}.`);
    if (
      this.requester().adminRoles.some(
        (role) =>
          role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === account.tenant?.id
      )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['AccountSetInput'], account: Account) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (account.deletedAt) throw new NotFoundException(`Account was deleted on ${account.deletedAt}.`);
    if (account.hiddenAt) throw new NotFoundException('Account must be unhidden before it can be updated.');

    if (
      this.requester().adminRoles.some(
        (role) =>
          role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === account.tenant?.id
      )
    )
      return true;

    // Custom logic
    return account.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['AccountSetInput']) {
    this.hasuraService.checkForbiddenFields(props);
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['AccountInsertInput']) {
    // Custom logic

    return true;
  }

  async insertAccountOne(
    selectionSet: string[],
    object: ValueTypes['AccountInsertInput'],
    onConflict?: ValueTypes['AccountOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Account.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertAccountOne', selectionSet, object, onConflict);

    const account = await this.accountRepository.findOneOrFail(data.insertAccountOne.id);
    await this.logsService.createLog(EntityName.Account, account);

    // Custom logic
    return data.insertAccountOne;
  }

  async findAccount(
    selectionSet: string[],
    where: ValueTypes['AccountBoolExp'],
    orderBy?: Array<ValueTypes['AccountOrderBy']>,
    distinctOn?: Array<ValueTypes['AccountSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('account', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.account;
  }

  async findAccountByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('accountByPk', selectionSet, { id });
    return data.accountByPk;
  }

  async insertAccount(
    selectionSet: string[],
    objects: Array<ValueTypes['AccountInsertInput']>,
    onConflict?: ValueTypes['AccountOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Account.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertAccount', selectionSet, objects, onConflict);

    for (const inserted of data.insertAccount.returning) {
      const account = await this.accountRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Account, account);
    }

    // Custom logic
    return data.insertAccount;
  }

  async updateAccountMany(selectionSet: string[], updates: Array<ValueTypes['AccountUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const accounts = await this.accountRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const account = accounts.find((account) => account.id === update.where.id._eq);
      if (!account) throw new NotFoundException(`Account (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, account);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Account (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateAccountMany', selectionSet, updates);

    await Promise.all(
      accounts.map(async (account) => {
        const update = updates.find((update) => update.where.id._eq === account.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Account, account, update._set);
      })
    );

    // Custom logic
    return data.updateAccountMany;
  }

  async updateAccountByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['AccountPkColumnsInput'],
    _set: ValueTypes['AccountSetInput']
  ) {
    const account = await this.accountRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, account);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Account (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateAccountByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Account, account, _set);

    // Custom logic
    return data.updateAccountByPk;
  }

  async deleteAccount(selectionSet: string[], where: ValueTypes['AccountBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const accounts = await this.accountRepository.findByIds(where.id._in);
    for (const account of accounts) {
      const canDelete = this.checkPermsDelete(account);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Account (${account.id}).`);
    }

    const data = await this.hasuraService.update('updateAccount', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      accounts.map(async (account) => {
        await this.logsService.deleteLog(EntityName.Account, account.id);
      })
    );

    // Custom logic
    return data.updateAccount;
  }

  async deleteAccountByPk(selectionSet: string[], pkColumns: ValueTypes['AccountPkColumnsInput']) {
    const account = await this.accountRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(account);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Account (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateAccountByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Account, pkColumns.id);
    // Custom logic
    return data.updateAccountByPk;
  }

  async aggregateAccount(
    selectionSet: string[],
    where: ValueTypes['AccountBoolExp'],
    orderBy?: Array<ValueTypes['AccountOrderBy']>,
    distinctOn?: Array<ValueTypes['AccountSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'accountAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.accountAggregate;
  }
}
