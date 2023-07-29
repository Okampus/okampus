import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { FinanceRepository, Finance } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class FinancesService extends RequestContext {
  private readonly logger = new Logger(FinancesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly financeRepository: FinanceRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['FinanceInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(finance: Finance) {
    if (finance.deletedAt) throw new NotFoundException(`Finance was deleted on ${finance.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === finance.tenant?.id
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['FinanceSetInput'], finance: Finance) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (finance.deletedAt) throw new NotFoundException(`Finance was deleted on ${finance.deletedAt}.`);
    if (finance.hiddenAt) throw new NotFoundException('Finance must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === finance.tenant?.id
        )
    )
      return true;

    // Custom logic
    return finance.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['FinanceSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['FinanceInsertInput']) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertFinanceOne(
    selectionSet: string[],
    object: ValueTypes['FinanceInsertInput'],
    onConflict?: ValueTypes['FinanceOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Finance.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertFinanceOne', selectionSet, object, onConflict);

    const finance = await this.financeRepository.findOneOrFail(data.insertFinanceOne.id);
    await this.logsService.createLog(EntityName.Finance, finance);

    // Custom logic
    return data.insertFinanceOne;
  }

  async findFinance(
    selectionSet: string[],
    where: ValueTypes['FinanceBoolExp'],
    orderBy?: Array<ValueTypes['FinanceOrderBy']>,
    distinctOn?: Array<ValueTypes['FinanceSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('finance', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.finance;
  }

  async findFinanceByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('financeByPk', selectionSet, { id });
    return data.financeByPk;
  }

  async insertFinance(
    selectionSet: string[],
    objects: Array<ValueTypes['FinanceInsertInput']>,
    onConflict?: ValueTypes['FinanceOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Finance.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertFinance', selectionSet, objects, onConflict);

    for (const inserted of data.insertFinance.returning) {
      const finance = await this.financeRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Finance, finance);
    }

    // Custom logic
    return data.insertFinance;
  }

  async updateFinanceMany(selectionSet: string[], updates: Array<ValueTypes['FinanceUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const finances = await this.financeRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const finance = finances.find((finance) => finance.id === update.where.id._eq);
      if (!finance) throw new NotFoundException(`Finance (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, finance);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Finance (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateFinanceMany', selectionSet, updates);

    await Promise.all(
      finances.map(async (finance) => {
        const update = updates.find((update) => update.where.id._eq === finance.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Finance, finance, update._set);
      })
    );

    // Custom logic
    return data.updateFinanceMany;
  }

  async updateFinanceByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['FinancePkColumnsInput'],
    _set: ValueTypes['FinanceSetInput']
  ) {
    const finance = await this.financeRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, finance);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Finance (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateFinanceByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Finance, finance, _set);

    // Custom logic
    return data.updateFinanceByPk;
  }

  async deleteFinance(selectionSet: string[], where: ValueTypes['FinanceBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const finances = await this.financeRepository.findByIds(where.id._in);
    for (const finance of finances) {
      const canDelete = this.checkPermsDelete(finance);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Finance (${finance.id}).`);
    }

    const data = await this.hasuraService.update('updateFinance', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      finances.map(async (finance) => {
        await this.logsService.deleteLog(EntityName.Finance, finance.id);
      })
    );

    // Custom logic
    return data.updateFinance;
  }

  async deleteFinanceByPk(selectionSet: string[], pkColumns: ValueTypes['FinancePkColumnsInput']) {
    const finance = await this.financeRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(finance);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Finance (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateFinanceByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Finance, pkColumns.id);
    // Custom logic
    return data.updateFinanceByPk;
  }

  async aggregateFinance(
    selectionSet: string[],
    where: ValueTypes['FinanceBoolExp'],
    orderBy?: Array<ValueTypes['FinanceOrderBy']>,
    distinctOn?: Array<ValueTypes['FinanceSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'financeAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.financeAggregate;
  }
}
