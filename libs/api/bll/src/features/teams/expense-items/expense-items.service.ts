import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { ExpenseItemRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique, canAdminDelete, canAdminManage } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { ExpenseItem } from '@okampus/api/dal';
import type {
  ExpenseItemInsertInput,
  ExpenseItemOnConflict,
  ExpenseItemBoolExp,
  ExpenseItemOrderBy,
  ExpenseItemSelectColumn,
  ExpenseItemSetInput,
  ExpenseItemUpdates,
  ExpenseItemPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class ExpenseItemsService extends RequestContext {
  private readonly logger = new Logger(ExpenseItemsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly expenseItemRepository: ExpenseItemRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: ExpenseItemInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, { tenant: this.tenant() }))) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(expenseItem: ExpenseItem) {
    if (expenseItem.deletedAt) throw new NotFoundException(`ExpenseItem was deleted on ${expenseItem.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminDelete(adminRole, expenseItem))) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ExpenseItemSetInput, expenseItem: ExpenseItem) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (expenseItem.deletedAt) throw new NotFoundException(`ExpenseItem was deleted on ${expenseItem.deletedAt}.`);
    if (expenseItem.hiddenAt) throw new NotFoundException('ExpenseItem must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, expenseItem))) return true;

    // Custom logic
    return expenseItem.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ExpenseItemSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ExpenseItemInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertExpenseItemOne(
    selectionSet: string[],
    object: ExpenseItemInsertInput,
    onConflict?: ExpenseItemOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert ExpenseItem.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertExpenseItemOne', selectionSet, object, onConflict);

    const expenseItem = await this.expenseItemRepository.findOneOrFail(data.insertExpenseItemOne.id);
    await this.logsService.createLog(EntityName.ExpenseItem, expenseItem);

    // Custom logic
    return data.insertExpenseItemOne;
  }

  async findExpenseItem(
    selectionSet: string[],
    where: ExpenseItemBoolExp,
    orderBy?: Array<ExpenseItemOrderBy>,
    distinctOn?: Array<ExpenseItemSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('expenseItem', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.expenseItem;
  }

  async findExpenseItemByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('expenseItemByPk', selectionSet, { id });
    return data.expenseItemByPk;
  }

  async insertExpenseItem(
    selectionSet: string[],
    objects: Array<ExpenseItemInsertInput>,
    onConflict?: ExpenseItemOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert ExpenseItem.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertExpenseItem', selectionSet, objects, onConflict);

    for (const inserted of data.insertExpenseItem.returning) {
      const expenseItem = await this.expenseItemRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.ExpenseItem, expenseItem);
    }

    // Custom logic
    return data.insertExpenseItem;
  }

  async updateExpenseItemMany(selectionSet: string[], updates: Array<ExpenseItemUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const expenseItems = await this.expenseItemRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const expenseItem = expenseItems.find((expenseItem) => expenseItem.id === update.where.id._eq);
        if (!expenseItem) throw new NotFoundException(`ExpenseItem (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, expenseItem);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update ExpenseItem (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateExpenseItemMany', selectionSet, updates);

    await Promise.all(
      expenseItems.map(async (expenseItem) => {
        const update = updates.find((update) => update.where.id._eq === expenseItem.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.ExpenseItem, expenseItem, update._set);
      }),
    );

    // Custom logic
    return data.updateExpenseItemMany;
  }

  async updateExpenseItemByPk(selectionSet: string[], pkColumns: ExpenseItemPkColumnsInput, _set: ExpenseItemSetInput) {
    const expenseItem = await this.expenseItemRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, expenseItem);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update ExpenseItem (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateExpenseItemByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.ExpenseItem, expenseItem, _set);

    // Custom logic
    return data.updateExpenseItemByPk;
  }

  async deleteExpenseItem(selectionSet: string[], where: ExpenseItemBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const expenseItems = await this.expenseItemRepository.findByIds(where.id._in);

    await Promise.all(
      expenseItems.map(async (expenseItem) => {
        const canDelete = await this.checkPermsDelete(expenseItem);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete ExpenseItem (${expenseItem.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateExpenseItem', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      expenseItems.map(async (expenseItem) => {
        await this.logsService.deleteLog(EntityName.ExpenseItem, expenseItem.id);
      }),
    );

    // Custom logic
    return data.updateExpenseItem;
  }

  async deleteExpenseItemByPk(selectionSet: string[], id: string) {
    const expenseItem = await this.expenseItemRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(expenseItem);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete ExpenseItem (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateExpenseItemByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.ExpenseItem, id);
    // Custom logic
    return data.updateExpenseItemByPk;
  }

  async aggregateExpenseItem(
    selectionSet: string[],
    where: ExpenseItemBoolExp,
    orderBy?: Array<ExpenseItemOrderBy>,
    distinctOn?: Array<ExpenseItemSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'expenseItemAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.expenseItemAggregate;
  }
}
