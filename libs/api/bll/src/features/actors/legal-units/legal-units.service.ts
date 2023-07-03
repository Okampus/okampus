import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LegalUnitRepository, LegalUnit } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class LegalUnitsService extends RequestContext {
  private readonly logger = new Logger(LegalUnitsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly legalUnitRepository: LegalUnitRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['LegalUnitInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(legalUnit: LegalUnit) {
    if (legalUnit.deletedAt) throw new NotFoundException(`LegalUnit was deleted on ${legalUnit.deletedAt}.`);
    if (
      this.requester().adminRoles.some(
        (role) => role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === legalUnit.id
      )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['LegalUnitSetInput'], legalUnit: LegalUnit) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (legalUnit.deletedAt) throw new NotFoundException(`LegalUnit was deleted on ${legalUnit.deletedAt}.`);

    if (
      this.requester().adminRoles.some(
        (role) => role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === legalUnit.id
      )
    )
      return true;

    // Custom logic
    return legalUnit.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['LegalUnitSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.createdById = this.requester().id;

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['LegalUnitInsertInput']) {
    // Custom logic

    this.hasuraService.expectNestedRelationship(props, [{ path: 'actor', slugify: 'name' }]);

    return true;
  }

  async insertLegalUnitOne(
    selectionSet: string[],
    object: ValueTypes['LegalUnitInsertInput'],
    onConflict?: ValueTypes['LegalUnitOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert LegalUnit.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertLegalUnitOne', selectionSet, object, onConflict);

    const legalUnit = await this.legalUnitRepository.findOneOrFail(data.insertLegalUnitOne.id);
    await this.logsService.createLog(EntityName.LegalUnit, legalUnit);

    // Custom logic
    return data.insertLegalUnitOne;
  }

  async findLegalUnit(
    selectionSet: string[],
    where: ValueTypes['LegalUnitBoolExp'],
    orderBy?: Array<ValueTypes['LegalUnitOrderBy']>,
    distinctOn?: Array<ValueTypes['LegalUnitSelectColumn']>,
    limit?: number,
    offset?: number
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
    objects: Array<ValueTypes['LegalUnitInsertInput']>,
    onConflict?: ValueTypes['LegalUnitOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert LegalUnit.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
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

  async updateLegalUnitMany(selectionSet: string[], updates: Array<ValueTypes['LegalUnitUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const legalUnits = await this.legalUnitRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const legalUnit = legalUnits.find((legalUnit) => legalUnit.id === update.where.id._eq);
      if (!legalUnit) throw new NotFoundException(`LegalUnit (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, legalUnit);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update LegalUnit (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateLegalUnitMany', selectionSet, updates);

    await Promise.all(
      legalUnits.map(async (legalUnit) => {
        const update = updates.find((update) => update.where.id._eq === legalUnit.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.LegalUnit, legalUnit, update._set);
      })
    );

    // Custom logic
    return data.updateLegalUnitMany;
  }

  async updateLegalUnitByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['LegalUnitPkColumnsInput'],
    _set: ValueTypes['LegalUnitSetInput']
  ) {
    const legalUnit = await this.legalUnitRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, legalUnit);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update LegalUnit (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateLegalUnitByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.LegalUnit, legalUnit, _set);

    // Custom logic
    return data.updateLegalUnitByPk;
  }

  async deleteLegalUnit(selectionSet: string[], where: ValueTypes['LegalUnitBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const legalUnits = await this.legalUnitRepository.findByIds(where.id._in);
    for (const legalUnit of legalUnits) {
      const canDelete = this.checkPermsDelete(legalUnit);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete LegalUnit (${legalUnit.id}).`);
    }

    const data = await this.hasuraService.update('updateLegalUnit', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      legalUnits.map(async (legalUnit) => {
        await this.logsService.deleteLog(EntityName.LegalUnit, legalUnit.id);
      })
    );

    // Custom logic
    return data.updateLegalUnit;
  }

  async deleteLegalUnitByPk(selectionSet: string[], pkColumns: ValueTypes['LegalUnitPkColumnsInput']) {
    const legalUnit = await this.legalUnitRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(legalUnit);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete LegalUnit (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateLegalUnitByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.LegalUnit, pkColumns.id);
    // Custom logic
    return data.updateLegalUnitByPk;
  }

  async aggregateLegalUnit(
    selectionSet: string[],
    where: ValueTypes['LegalUnitBoolExp'],
    orderBy?: Array<ValueTypes['LegalUnitOrderBy']>,
    distinctOn?: Array<ValueTypes['LegalUnitSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'legalUnitAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.legalUnitAggregate;
  }
}
