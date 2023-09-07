import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { TransactionRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { Transaction } from '@okampus/api/dal';
import type {
  TransactionInsertInput,
  TransactionOnConflict,
  TransactionBoolExp,
  TransactionOrderBy,
  TransactionSelectColumn,
  TransactionSetInput,
  TransactionUpdates,
  TransactionPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class TransactionsService extends RequestContext {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly transactionRepository: TransactionRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: TransactionInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(transaction: Transaction) {
    if (transaction.deletedAt) throw new NotFoundException(`Transaction was deleted on ${transaction.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canDeleteTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: TransactionSetInput, transaction: Transaction) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (transaction.deletedAt) throw new NotFoundException(`Transaction was deleted on ${transaction.deletedAt}.`);
    if (transaction.hiddenAt) throw new NotFoundException('Transaction must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return transaction.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: TransactionSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: TransactionInsertInput) {
    // Custom logic
    props.tenantScopeId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertTransactionOne(
    selectionSet: string[],
    object: TransactionInsertInput,
    onConflict?: TransactionOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Transaction.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertTransactionOne', selectionSet, object, onConflict);

    const transaction = await this.transactionRepository.findOneOrFail(data.insertTransactionOne.id);
    await this.logsService.createLog(EntityName.Transaction, transaction);

    // Custom logic
    return data.insertTransactionOne;
  }

  async findTransaction(
    selectionSet: string[],
    where: TransactionBoolExp,
    orderBy?: Array<TransactionOrderBy>,
    distinctOn?: Array<TransactionSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('transaction', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.transaction;
  }

  async findTransactionByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('transactionByPk', selectionSet, { id });
    return data.transactionByPk;
  }

  async insertTransaction(
    selectionSet: string[],
    objects: Array<TransactionInsertInput>,
    onConflict?: TransactionOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Transaction.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertTransaction', selectionSet, objects, onConflict);

    for (const inserted of data.insertTransaction.returning) {
      const transaction = await this.transactionRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Transaction, transaction);
    }

    // Custom logic
    return data.insertTransaction;
  }

  async updateTransactionMany(selectionSet: string[], updates: Array<TransactionUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const transactions = await this.transactionRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const transaction = transactions.find((transaction) => transaction.id === update.where.id._eq);
        if (!transaction) throw new NotFoundException(`Transaction (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, transaction);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update Transaction (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateTransactionMany', selectionSet, updates);

    await Promise.all(
      transactions.map(async (transaction) => {
        const update = updates.find((update) => update.where.id._eq === transaction.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Transaction, transaction, update._set);
      }),
    );

    // Custom logic
    return data.updateTransactionMany;
  }

  async updateTransactionByPk(selectionSet: string[], pkColumns: TransactionPkColumnsInput, _set: TransactionSetInput) {
    const transaction = await this.transactionRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, transaction);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Transaction (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTransactionByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Transaction, transaction, _set);

    // Custom logic
    return data.updateTransactionByPk;
  }

  async deleteTransaction(selectionSet: string[], where: TransactionBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const transactions = await this.transactionRepository.findByIds(where.id._in);

    await Promise.all(
      transactions.map(async (transaction) => {
        const canDelete = await this.checkPermsDelete(transaction);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Transaction (${transaction.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateTransaction', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      transactions.map(async (transaction) => {
        await this.logsService.deleteLog(EntityName.Transaction, transaction.id);
      }),
    );

    // Custom logic
    return data.updateTransaction;
  }

  async deleteTransactionByPk(selectionSet: string[], id: string) {
    const transaction = await this.transactionRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(transaction);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Transaction (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateTransactionByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.Transaction, id);
    // Custom logic
    return data.updateTransactionByPk;
  }

  async aggregateTransaction(
    selectionSet: string[],
    where: TransactionBoolExp,
    orderBy?: Array<TransactionOrderBy>,
    distinctOn?: Array<TransactionSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'transactionAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.transactionAggregate;
  }
}
