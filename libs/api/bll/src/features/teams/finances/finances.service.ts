import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { FinanceRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique, canAdminDelete, canAdminManage } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { Finance } from '@okampus/api/dal';
import type {
  FinanceInsertInput,
  FinanceOnConflict,
  FinanceBoolExp,
  FinanceOrderBy,
  FinanceSelectColumn,
  FinanceSetInput,
  FinanceUpdates,
  FinancePkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class FinancesService extends RequestContext {
  private readonly logger = new Logger(FinancesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly financeRepository: FinanceRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: FinanceInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, { tenantScope: this.tenant() }))) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(finance: Finance) {
    if (finance.deletedAt) throw new NotFoundException(`Finance was deleted on ${finance.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminDelete(adminRole, finance))) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: FinanceSetInput, finance: Finance) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (finance.deletedAt) throw new NotFoundException(`Finance was deleted on ${finance.deletedAt}.`);
    if (finance.hiddenAt) throw new NotFoundException('Finance must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, finance))) return true;

    // Custom logic
    return finance.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: FinanceSetInput) {
    this.hasuraService.checkForbiddenFields(props);
    

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: FinanceInsertInput) {
    // Custom logic
    props.tenantScopeId = this.tenant().id;
    props.createdById = this.requester().id;

    
    

    return true;
  }

  async insertFinanceOne(
    selectionSet: string[],
    object: FinanceInsertInput,
    onConflict?: FinanceOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Finance.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertFinanceOne', selectionSet, object, onConflict);

    const finance = await this.financeRepository.findOneOrFail(data.insertFinanceOne.id);
    await this.logsService.createLog(EntityName.Finance, finance);

    // Custom logic
    return data.insertFinanceOne;
  }

  async findFinance(
    selectionSet: string[],
    where: FinanceBoolExp,
    orderBy?: Array<FinanceOrderBy>,
    distinctOn?: Array<FinanceSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('finance', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.finance;
  }

  async findFinanceByPk(
    selectionSet: string[],
     id: string, 
  ) {
    // Custom logic
    const data = await this.hasuraService.findByPk('financeByPk', selectionSet, {  id,  });
    return data.financeByPk;
  }

  async insertFinance(
    selectionSet: string[],
    objects: Array<FinanceInsertInput>,
    onConflict?: FinanceOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Finance.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertFinance', selectionSet, objects, onConflict);

    for (const inserted of data.insertFinance.returning) {
      const finance = await this.financeRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Finance, finance);
    }

    // Custom logic
    return data.insertFinance;
  }

  async updateFinanceMany(
    selectionSet: string[],
    updates: Array<FinanceUpdates>,
  ) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const finances = await this.financeRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(updates.map(async (update) => {
      const finance = finances.find((finance) => finance.id === update.where.id._eq);
      if (!finance) throw new NotFoundException(`Finance (${update.where.id._eq}) was not found.`);

      const canUpdate = await this.checkPermsUpdate(update._set, finance);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Finance (${update.where.id._eq}).`);

      const arePropsValid = await this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }));

    const data = await this.hasuraService.updateMany('updateFinanceMany', selectionSet, updates);

    await Promise.all(finances.map(async (finance) => {
      const update = updates.find((update) => update.where.id._eq === finance.id)
      if (!update) return;
      await this.logsService.updateLog(EntityName.Finance, finance, update._set);
    }));

    // Custom logic
    return data.updateFinanceMany;
  }

  async updateFinanceByPk(
    selectionSet: string[],
    pkColumns: FinancePkColumnsInput,
    _set: FinanceSetInput,
  ) {
    const finance = await this.financeRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, finance);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Finance (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateFinanceByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Finance, finance, _set);

    // Custom logic
    return data.updateFinanceByPk;
  }

  async deleteFinance(
    selectionSet: string[],
    where: FinanceBoolExp,
  ) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect) throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const finances = await this.financeRepository.findByIds(where.id._in);

    await Promise.all(finances.map(async (finance) => {
      const canDelete = await this.checkPermsDelete(finance);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Finance (${finance.id}).`);
    }));

    const data = await this.hasuraService.update('updateFinance', selectionSet, where, { deletedAt: new Date().toISOString() });

    await Promise.all(finances.map(async (finance) => {
      await this.logsService.deleteLog(EntityName.Finance, finance.id);
    }));

    // Custom logic
    return data.updateFinance;
  }

  async deleteFinanceByPk(
    selectionSet: string[],
    id: string,
  ) {
    const finance = await this.financeRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(finance);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Finance (${id}).`);

    const data = await this.hasuraService.updateByPk('updateFinanceByPk', selectionSet, { id }, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Finance, id);
    // Custom logic
    return data.updateFinanceByPk;
  }

  async aggregateFinance(
    selectionSet: string[],
    where: FinanceBoolExp,
    orderBy?: Array<FinanceOrderBy>,
    distinctOn?: Array<FinanceSelectColumn>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate('financeAggregate', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.financeAggregate;
  }
}