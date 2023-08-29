import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { LegalUnitLocationRepository, LegalUnitLocation } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  LegalUnitLocationInsertInput,
  LegalUnitLocationOnConflict,
  LegalUnitLocationBoolExp,
  LegalUnitLocationOrderBy,
  LegalUnitLocationSelectColumn,
  LegalUnitLocationSetInput,
  LegalUnitLocationUpdates,
  LegalUnitLocationPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class LegalUnitLocationsService extends RequestContext {
  private readonly logger = new Logger(LegalUnitLocationsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly legalUnitLocationRepository: LegalUnitLocationRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: LegalUnitLocationInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(legalUnitLocation: LegalUnitLocation) {
    if (legalUnitLocation.deletedAt)
      throw new NotFoundException(`LegalUnitLocation was deleted on ${legalUnitLocation.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) &&
            role.tenant?.id === legalUnitLocation.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: LegalUnitLocationSetInput, legalUnitLocation: LegalUnitLocation) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (legalUnitLocation.deletedAt)
      throw new NotFoundException(`LegalUnitLocation was deleted on ${legalUnitLocation.deletedAt}.`);

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) &&
            role.tenant?.id === legalUnitLocation.id,
        )
    )
      return true;

    // Custom logic
    return legalUnitLocation.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: LegalUnitLocationSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: LegalUnitLocationInsertInput) {
    // Custom logic

    props.createdById = this.requester().id;

    this.hasuraService.expectNestedRelationship(props, [{ path: 'actor', slugify: 'name' }]);

    return true;
  }

  async insertLegalUnitLocationOne(
    selectionSet: string[],
    object: LegalUnitLocationInsertInput,
    onConflict?: LegalUnitLocationOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert LegalUnitLocation.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
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
    where: LegalUnitLocationBoolExp,
    orderBy?: Array<LegalUnitLocationOrderBy>,
    distinctOn?: Array<LegalUnitLocationSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'legalUnitLocation',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
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
    objects: Array<LegalUnitLocationInsertInput>,
    onConflict?: LegalUnitLocationOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert LegalUnitLocation.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
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

  async updateLegalUnitLocationMany(selectionSet: string[], updates: Array<LegalUnitLocationUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const legalUnitLocations = await this.legalUnitLocationRepository.findByIds(
      updates.map((update) => update.where.id._eq),
    );

    await Promise.all(
      updates.map(async (update) => {
        const legalUnitLocation = legalUnitLocations.find(
          (legalUnitLocation) => legalUnitLocation.id === update.where.id._eq,
        );
        if (!legalUnitLocation)
          throw new NotFoundException(`LegalUnitLocation (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, legalUnitLocation);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update LegalUnitLocation (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateLegalUnitLocationMany', selectionSet, updates);

    await Promise.all(
      legalUnitLocations.map(async (legalUnitLocation) => {
        const update = updates.find((update) => update.where.id._eq === legalUnitLocation.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.LegalUnitLocation, legalUnitLocation, update._set);
      }),
    );

    // Custom logic
    return data.updateLegalUnitLocationMany;
  }

  async updateLegalUnitLocationByPk(
    selectionSet: string[],
    pkColumns: LegalUnitLocationPkColumnsInput,
    _set: LegalUnitLocationSetInput,
  ) {
    const legalUnitLocation = await this.legalUnitLocationRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, legalUnitLocation);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update LegalUnitLocation (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateLegalUnitLocationByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.LegalUnitLocation, legalUnitLocation, _set);

    // Custom logic
    return data.updateLegalUnitLocationByPk;
  }

  async deleteLegalUnitLocation(selectionSet: string[], where: LegalUnitLocationBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const legalUnitLocations = await this.legalUnitLocationRepository.findByIds(where.id._in);

    await Promise.all(
      legalUnitLocations.map(async (legalUnitLocation) => {
        const canDelete = await this.checkPermsDelete(legalUnitLocation);
        if (!canDelete)
          throw new ForbiddenException(`You are not allowed to delete LegalUnitLocation (${legalUnitLocation.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateLegalUnitLocation', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      legalUnitLocations.map(async (legalUnitLocation) => {
        await this.logsService.deleteLog(EntityName.LegalUnitLocation, legalUnitLocation.id);
      }),
    );

    // Custom logic
    return data.updateLegalUnitLocation;
  }

  async deleteLegalUnitLocationByPk(selectionSet: string[], id: string) {
    const legalUnitLocation = await this.legalUnitLocationRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(legalUnitLocation);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete LegalUnitLocation (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateLegalUnitLocationByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.LegalUnitLocation, id);
    // Custom logic
    return data.updateLegalUnitLocationByPk;
  }

  async aggregateLegalUnitLocation(
    selectionSet: string[],
    where: LegalUnitLocationBoolExp,
    orderBy?: Array<LegalUnitLocationOrderBy>,
    distinctOn?: Array<LegalUnitLocationSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'legalUnitLocationAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.legalUnitLocationAggregate;
  }
}
