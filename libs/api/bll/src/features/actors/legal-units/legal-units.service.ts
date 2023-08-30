import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { LegalUnitRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { LegalUnit } from '@okampus/api/dal';
import type {
  LegalUnitInsertInput,
  LegalUnitOnConflict,
  LegalUnitBoolExp,
  LegalUnitOrderBy,
  LegalUnitSelectColumn,
  LegalUnitSetInput,
  LegalUnitUpdates,
  LegalUnitPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class LegalUnitsService extends RequestContext {
  private readonly logger = new Logger(LegalUnitsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly legalUnitRepository: LegalUnitRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: LegalUnitInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return false;
  }

  async checkPermsDelete(legalUnit: LegalUnit) {
    if (legalUnit.deletedAt) throw new NotFoundException(`LegalUnit was deleted on ${legalUnit.deletedAt}.`);

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: LegalUnitSetInput, legalUnit: LegalUnit) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (legalUnit.deletedAt) throw new NotFoundException(`LegalUnit was deleted on ${legalUnit.deletedAt}.`);

    // Custom logic
    return legalUnit.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: LegalUnitSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: LegalUnitInsertInput) {
    // Custom logic

    props.createdById = this.requester().id;

    this.hasuraService.expectNestedRelationship(props, [{ path: 'actor', slugify: 'name' }]);

    return true;
  }

  async insertLegalUnitOne(selectionSet: string[], object: LegalUnitInsertInput, onConflict?: LegalUnitOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert LegalUnit.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertLegalUnitOne', selectionSet, object, onConflict);

    const legalUnit = await this.legalUnitRepository.findOneOrFail(data.insertLegalUnitOne.id);
    await this.logsService.createLog(EntityName.LegalUnit, legalUnit);

    // Custom logic
    return data.insertLegalUnitOne;
  }

  async findLegalUnit(
    selectionSet: string[],
    where: LegalUnitBoolExp,
    orderBy?: Array<LegalUnitOrderBy>,
    distinctOn?: Array<LegalUnitSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('legalUnit', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.legalUnit;
  }

  async findLegalUnitByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('legalUnitByPk', selectionSet, { id });
    return data.legalUnitByPk;
  }

  async insertLegalUnit(
    selectionSet: string[],
    objects: Array<LegalUnitInsertInput>,
    onConflict?: LegalUnitOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert LegalUnit.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertLegalUnit', selectionSet, objects, onConflict);

    for (const inserted of data.insertLegalUnit.returning) {
      const legalUnit = await this.legalUnitRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.LegalUnit, legalUnit);
    }

    // Custom logic
    return data.insertLegalUnit;
  }

  async updateLegalUnitMany(selectionSet: string[], updates: Array<LegalUnitUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const legalUnits = await this.legalUnitRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const legalUnit = legalUnits.find((legalUnit) => legalUnit.id === update.where.id._eq);
        if (!legalUnit) throw new NotFoundException(`LegalUnit (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, legalUnit);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update LegalUnit (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateLegalUnitMany', selectionSet, updates);

    await Promise.all(
      legalUnits.map(async (legalUnit) => {
        const update = updates.find((update) => update.where.id._eq === legalUnit.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.LegalUnit, legalUnit, update._set);
      }),
    );

    // Custom logic
    return data.updateLegalUnitMany;
  }

  async updateLegalUnitByPk(selectionSet: string[], pkColumns: LegalUnitPkColumnsInput, _set: LegalUnitSetInput) {
    const legalUnit = await this.legalUnitRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, legalUnit);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update LegalUnit (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateLegalUnitByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.LegalUnit, legalUnit, _set);

    // Custom logic
    return data.updateLegalUnitByPk;
  }

  async deleteLegalUnit(selectionSet: string[], where: LegalUnitBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const legalUnits = await this.legalUnitRepository.findByIds(where.id._in);

    await Promise.all(
      legalUnits.map(async (legalUnit) => {
        const canDelete = await this.checkPermsDelete(legalUnit);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete LegalUnit (${legalUnit.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateLegalUnit', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      legalUnits.map(async (legalUnit) => {
        await this.logsService.deleteLog(EntityName.LegalUnit, legalUnit.id);
      }),
    );

    // Custom logic
    return data.updateLegalUnit;
  }

  async deleteLegalUnitByPk(selectionSet: string[], id: string) {
    const legalUnit = await this.legalUnitRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(legalUnit);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete LegalUnit (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateLegalUnitByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.LegalUnit, id);
    // Custom logic
    return data.updateLegalUnitByPk;
  }

  async aggregateLegalUnit(
    selectionSet: string[],
    where: LegalUnitBoolExp,
    orderBy?: Array<LegalUnitOrderBy>,
    distinctOn?: Array<LegalUnitSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'legalUnitAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.legalUnitAggregate;
  }
}
