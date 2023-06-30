import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AccountAllocateRepository, AccountAllocate } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class AccountAllocatesService extends RequestContext {
  private readonly logger = new Logger(AccountAllocatesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly accountAllocateRepository: AccountAllocateRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['AccountAllocateInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(accountAllocate: AccountAllocate) {
    if (accountAllocate.deletedAt)
      throw new NotFoundException(`AccountAllocate was deleted on ${accountAllocate.deletedAt}.`);
    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['AccountAllocateSetInput'], accountAllocate: AccountAllocate) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (accountAllocate.deletedAt)
      throw new NotFoundException(`AccountAllocate was deleted on ${accountAllocate.deletedAt}.`);
    if (accountAllocate.hiddenAt)
      throw new NotFoundException('AccountAllocate must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return accountAllocate.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['AccountAllocateSetInput']) {
    this.hasuraService.checkForbiddenFields(props);
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['AccountAllocateInsertInput']) {
    // Custom logic

    return true;
  }

  async insertAccountAllocateOne(
    selectionSet: string[],
    object: ValueTypes['AccountAllocateInsertInput'],
    onConflict?: ValueTypes['AccountAllocateOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert AccountAllocate.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertAccountAllocateOne', selectionSet, object, onConflict);

    const accountAllocate = await this.accountAllocateRepository.findOneOrFail(data.insertAccountAllocateOne.id);
    await this.logsService.createLog(EntityName.AccountAllocate, accountAllocate);

    // Custom logic
    return data.insertAccountAllocateOne;
  }

  async findAccountAllocate(
    selectionSet: string[],
    where: ValueTypes['AccountAllocateBoolExp'],
    orderBy?: Array<ValueTypes['AccountAllocateOrderBy']>,
    distinctOn?: Array<ValueTypes['AccountAllocateSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'accountAllocate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.accountAllocate;
  }

  async findAccountAllocateByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('accountAllocateByPk', selectionSet, { id });
    return data.accountAllocateByPk;
  }

  async insertAccountAllocate(
    selectionSet: string[],
    objects: Array<ValueTypes['AccountAllocateInsertInput']>,
    onConflict?: ValueTypes['AccountAllocateOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert AccountAllocate.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertAccountAllocate', selectionSet, objects, onConflict);

    for (const inserted of data.insertAccountAllocate.returning) {
      const accountAllocate = await this.accountAllocateRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.AccountAllocate, accountAllocate);
    }

    // Custom logic
    return data.insertAccountAllocate;
  }

  async updateAccountAllocateMany(selectionSet: string[], updates: Array<ValueTypes['AccountAllocateUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const accountAllocates = await this.accountAllocateRepository.findByIds(
      updates.map((update) => update.where.id._eq)
    );
    for (const update of updates) {
      const accountAllocate = accountAllocates.find((accountAllocate) => accountAllocate.id === update.where.id._eq);
      if (!accountAllocate) throw new NotFoundException(`AccountAllocate (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, accountAllocate);
      if (!canUpdate)
        throw new ForbiddenException(`You are not allowed to update AccountAllocate (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateAccountAllocateMany', selectionSet, updates);

    await Promise.all(
      accountAllocates.map(async (accountAllocate) => {
        const update = updates.find((update) => update.where.id._eq === accountAllocate.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.AccountAllocate, accountAllocate, update._set);
      })
    );

    // Custom logic
    return data.updateAccountAllocateMany;
  }

  async updateAccountAllocateByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['AccountAllocatePkColumnsInput'],
    _set: ValueTypes['AccountAllocateSetInput']
  ) {
    const accountAllocate = await this.accountAllocateRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, accountAllocate);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update AccountAllocate (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateAccountAllocateByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.AccountAllocate, accountAllocate, _set);

    // Custom logic
    return data.updateAccountAllocateByPk;
  }

  async deleteAccountAllocate(selectionSet: string[], where: ValueTypes['AccountAllocateBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const accountAllocates = await this.accountAllocateRepository.findByIds(where.id._in);
    for (const accountAllocate of accountAllocates) {
      const canDelete = this.checkPermsDelete(accountAllocate);
      if (!canDelete)
        throw new ForbiddenException(`You are not allowed to delete AccountAllocate (${accountAllocate.id}).`);
    }

    const data = await this.hasuraService.update('updateAccountAllocate', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      accountAllocates.map(async (accountAllocate) => {
        await this.logsService.deleteLog(EntityName.AccountAllocate, accountAllocate.id);
      })
    );

    // Custom logic
    return data.updateAccountAllocate;
  }

  async deleteAccountAllocateByPk(selectionSet: string[], pkColumns: ValueTypes['AccountAllocatePkColumnsInput']) {
    const accountAllocate = await this.accountAllocateRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(accountAllocate);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete AccountAllocate (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateAccountAllocateByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.AccountAllocate, pkColumns.id);
    // Custom logic
    return data.updateAccountAllocateByPk;
  }

  async aggregateAccountAllocate(
    selectionSet: string[],
    where: ValueTypes['AccountAllocateBoolExp'],
    orderBy?: Array<ValueTypes['AccountAllocateOrderBy']>,
    distinctOn?: Array<ValueTypes['AccountAllocateSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'accountAllocateAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.accountAllocateAggregate;
  }
}
