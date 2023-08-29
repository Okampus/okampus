import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ExpenseRepository, Expense } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  ExpenseInsertInput,
  ExpenseOnConflict,
  ExpenseBoolExp,
  ExpenseOrderBy,
  ExpenseSelectColumn,
  ExpenseSetInput,
  ExpenseUpdates,
  ExpensePkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class ExpensesService extends RequestContext {
  private readonly logger = new Logger(ExpensesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly expenseRepository: ExpenseRepository,
  ) {
    super();
  }

  checkPermsCreate(props: ExpenseInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(expense: Expense) {
    if (expense.deletedAt) throw new NotFoundException(`Expense was deleted on ${expense.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === expense.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ExpenseSetInput, expense: Expense) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (expense.deletedAt) throw new NotFoundException(`Expense was deleted on ${expense.deletedAt}.`);
    if (expense.hiddenAt) throw new NotFoundException('Expense must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === expense.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return expense.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ExpenseSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ExpenseInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertExpenseOne(selectionSet: string[], object: ExpenseInsertInput, onConflict?: ExpenseOnConflict) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Expense.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertExpenseOne', selectionSet, object, onConflict);

    const expense = await this.expenseRepository.findOneOrFail(data.insertExpenseOne.id);
    await this.logsService.createLog(EntityName.Expense, expense);

    // Custom logic
    return data.insertExpenseOne;
  }

  async findExpense(
    selectionSet: string[],
    where: ExpenseBoolExp,
    orderBy?: Array<ExpenseOrderBy>,
    distinctOn?: Array<ExpenseSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('expense', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.expense;
  }

  async findExpenseByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('expenseByPk', selectionSet, { id });
    return data.expenseByPk;
  }

  async insertExpense(selectionSet: string[], objects: Array<ExpenseInsertInput>, onConflict?: ExpenseOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Expense.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertExpense', selectionSet, objects, onConflict);

    for (const inserted of data.insertExpense.returning) {
      const expense = await this.expenseRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Expense, expense);
    }

    // Custom logic
    return data.insertExpense;
  }

  async updateExpenseMany(selectionSet: string[], updates: Array<ExpenseUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const expenses = await this.expenseRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const expense = expenses.find((expense) => expense.id === update.where.id._eq);
      if (!expense) throw new NotFoundException(`Expense (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, expense);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Expense (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateExpenseMany', selectionSet, updates);

    await Promise.all(
      expenses.map(async (expense) => {
        const update = updates.find((update) => update.where.id._eq === expense.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Expense, expense, update._set);
      }),
    );

    // Custom logic
    return data.updateExpenseMany;
  }

  async updateExpenseByPk(selectionSet: string[], pkColumns: ExpensePkColumnsInput, _set: ExpenseSetInput) {
    const expense = await this.expenseRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, expense);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Expense (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateExpenseByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Expense, expense, _set);

    // Custom logic
    return data.updateExpenseByPk;
  }

  async deleteExpense(selectionSet: string[], where: ExpenseBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const expenses = await this.expenseRepository.findByIds(where.id._in);
    for (const expense of expenses) {
      const canDelete = this.checkPermsDelete(expense);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Expense (${expense.id}).`);
    }

    const data = await this.hasuraService.update('updateExpense', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      expenses.map(async (expense) => {
        await this.logsService.deleteLog(EntityName.Expense, expense.id);
      }),
    );

    // Custom logic
    return data.updateExpense;
  }

  async deleteExpenseByPk(selectionSet: string[], id: string) {
    const expense = await this.expenseRepository.findOneOrFail(id);

    const canDelete = this.checkPermsDelete(expense);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Expense (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateExpenseByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.Expense, id);
    // Custom logic
    return data.updateExpenseByPk;
  }

  async aggregateExpense(
    selectionSet: string[],
    where: ExpenseBoolExp,
    orderBy?: Array<ExpenseOrderBy>,
    distinctOn?: Array<ExpenseSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'expenseAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.expenseAggregate;
  }
}
