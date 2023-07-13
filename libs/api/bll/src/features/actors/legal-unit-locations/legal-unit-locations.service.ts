import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LegalUnitLocationRepository, LegalUnitLocation } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class LegalUnitLocationsService extends RequestContext {
  private readonly logger = new Logger(LegalUnitLocationsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly legalUnitLocationRepository: LegalUnitLocationRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['LegalUnitLocationInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(legalUnitLocation: LegalUnitLocation) {
    if (legalUnitLocation.deletedAt)
      throw new NotFoundException(`LegalUnitLocation was deleted on ${legalUnitLocation.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === legalUnitLocation.id
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['LegalUnitLocationSetInput'], legalUnitLocation: LegalUnitLocation) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (legalUnitLocation.deletedAt)
      throw new NotFoundException(`LegalUnitLocation was deleted on ${legalUnitLocation.deletedAt}.`);

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === legalUnitLocation.id
        )
    )
      return true;

    // Custom logic
    return legalUnitLocation.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['LegalUnitLocationSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['LegalUnitLocationInsertInput']) {
    // Custom logic

    props.createdById = this.requester().id;

    this.hasuraService.expectNestedRelationship(props, [{ path: 'actor', slugify: 'name' }]);

    return true;
  }

  async insertLegalUnitLocationOne(
    selectionSet: string[],
    object: ValueTypes['LegalUnitLocationInsertInput'],
    onConflict?: ValueTypes['LegalUnitLocationOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert LegalUnitLocation.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertLegalUnitLocationOne', selectionSet, object, onConflict);

    const legalUnitLocation = await this.legalUnitLocationRepository.findOneOrFail(data.insertLegalUnitLocationOne.id);
    await this.logsService.createLog(EntityName.LegalUnitLocation, legalUnitLocation);

    // Custom logic
    return data.insertLegalUnitLocationOne;
  }

  async findLegalUnitLocation(
    selectionSet: string[],
    where: ValueTypes['LegalUnitLocationBoolExp'],
    orderBy?: Array<ValueTypes['LegalUnitLocationOrderBy']>,
    distinctOn?: Array<ValueTypes['LegalUnitLocationSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'legalUnitLocation',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.legalUnitLocation;
  }

  async findLegalUnitLocationByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('legalUnitLocationByPk', selectionSet, { id });
    return data.legalUnitLocationByPk;
  }

  async insertLegalUnitLocation(
    selectionSet: string[],
    objects: Array<ValueTypes['LegalUnitLocationInsertInput']>,
    onConflict?: ValueTypes['LegalUnitLocationOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert LegalUnitLocation.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertLegalUnitLocation', selectionSet, objects, onConflict);

    for (const inserted of data.insertLegalUnitLocation.returning) {
      const legalUnitLocation = await this.legalUnitLocationRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.LegalUnitLocation, legalUnitLocation);
    }

    // Custom logic
    return data.insertLegalUnitLocation;
  }

  async updateLegalUnitLocationMany(selectionSet: string[], updates: Array<ValueTypes['LegalUnitLocationUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const legalUnitLocations = await this.legalUnitLocationRepository.findByIds(
      updates.map((update) => update.where.id._eq)
    );
    for (const update of updates) {
      const legalUnitLocation = legalUnitLocations.find(
        (legalUnitLocation) => legalUnitLocation.id === update.where.id._eq
      );
      if (!legalUnitLocation) throw new NotFoundException(`LegalUnitLocation (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, legalUnitLocation);
      if (!canUpdate)
        throw new ForbiddenException(`You are not allowed to update LegalUnitLocation (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateLegalUnitLocationMany', selectionSet, updates);

    await Promise.all(
      legalUnitLocations.map(async (legalUnitLocation) => {
        const update = updates.find((update) => update.where.id._eq === legalUnitLocation.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.LegalUnitLocation, legalUnitLocation, update._set);
      })
    );

    // Custom logic
    return data.updateLegalUnitLocationMany;
  }

  async updateLegalUnitLocationByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['LegalUnitLocationPkColumnsInput'],
    _set: ValueTypes['LegalUnitLocationSetInput']
  ) {
    const legalUnitLocation = await this.legalUnitLocationRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, legalUnitLocation);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update LegalUnitLocation (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateLegalUnitLocationByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.LegalUnitLocation, legalUnitLocation, _set);

    // Custom logic
    return data.updateLegalUnitLocationByPk;
  }

  async deleteLegalUnitLocation(selectionSet: string[], where: ValueTypes['LegalUnitLocationBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const legalUnitLocations = await this.legalUnitLocationRepository.findByIds(where.id._in);
    for (const legalUnitLocation of legalUnitLocations) {
      const canDelete = this.checkPermsDelete(legalUnitLocation);
      if (!canDelete)
        throw new ForbiddenException(`You are not allowed to delete LegalUnitLocation (${legalUnitLocation.id}).`);
    }

    const data = await this.hasuraService.update('updateLegalUnitLocation', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      legalUnitLocations.map(async (legalUnitLocation) => {
        await this.logsService.deleteLog(EntityName.LegalUnitLocation, legalUnitLocation.id);
      })
    );

    // Custom logic
    return data.updateLegalUnitLocation;
  }

  async deleteLegalUnitLocationByPk(selectionSet: string[], pkColumns: ValueTypes['LegalUnitLocationPkColumnsInput']) {
    const legalUnitLocation = await this.legalUnitLocationRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(legalUnitLocation);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete LegalUnitLocation (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateLegalUnitLocationByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.LegalUnitLocation, pkColumns.id);
    // Custom logic
    return data.updateLegalUnitLocationByPk;
  }

  async aggregateLegalUnitLocation(
    selectionSet: string[],
    where: ValueTypes['LegalUnitLocationBoolExp'],
    orderBy?: Array<ValueTypes['LegalUnitLocationOrderBy']>,
    distinctOn?: Array<ValueTypes['LegalUnitLocationSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'legalUnitLocationAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.legalUnitLocationAggregate;
  }
}
