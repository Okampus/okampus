import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { LocationRepository, Location } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  LocationInsertInput,
  LocationOnConflict,
  LocationBoolExp,
  LocationOrderBy,
  LocationSelectColumn,
  LocationSetInput,
  LocationUpdates,
  LocationPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class LocationsService extends RequestContext {
  private readonly logger = new Logger(LocationsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly locationRepository: LocationRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: LocationInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(location: Location) {
    if (location.deletedAt) throw new NotFoundException(`Location was deleted on ${location.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === location.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: LocationSetInput, location: Location) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (location.deletedAt) throw new NotFoundException(`Location was deleted on ${location.deletedAt}.`);
    if (location.hiddenAt) throw new NotFoundException('Location must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === location.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return location.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: LocationSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: LocationInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertLocationOne(selectionSet: string[], object: LocationInsertInput, onConflict?: LocationOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Location.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertLocationOne', selectionSet, object, onConflict);

    const location = await this.locationRepository.findOneOrFail(data.insertLocationOne.id);
    await this.logsService.createLog(EntityName.Location, location);

    // Custom logic
    return data.insertLocationOne;
  }

  async findLocation(
    selectionSet: string[],
    where: LocationBoolExp,
    orderBy?: Array<LocationOrderBy>,
    distinctOn?: Array<LocationSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('location', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.location;
  }

  async findLocationByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('locationByPk', selectionSet, { id });
    return data.locationByPk;
  }

  async insertLocation(selectionSet: string[], objects: Array<LocationInsertInput>, onConflict?: LocationOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Location.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertLocation', selectionSet, objects, onConflict);

    for (const inserted of data.insertLocation.returning) {
      const location = await this.locationRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Location, location);
    }

    // Custom logic
    return data.insertLocation;
  }

  async updateLocationMany(selectionSet: string[], updates: Array<LocationUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const locations = await this.locationRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const location = locations.find((location) => location.id === update.where.id._eq);
        if (!location) throw new NotFoundException(`Location (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, location);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update Location (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateLocationMany', selectionSet, updates);

    await Promise.all(
      locations.map(async (location) => {
        const update = updates.find((update) => update.where.id._eq === location.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Location, location, update._set);
      }),
    );

    // Custom logic
    return data.updateLocationMany;
  }

  async updateLocationByPk(selectionSet: string[], pkColumns: LocationPkColumnsInput, _set: LocationSetInput) {
    const location = await this.locationRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, location);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Location (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateLocationByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Location, location, _set);

    // Custom logic
    return data.updateLocationByPk;
  }

  async deleteLocation(selectionSet: string[], where: LocationBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const locations = await this.locationRepository.findByIds(where.id._in);

    await Promise.all(
      locations.map(async (location) => {
        const canDelete = await this.checkPermsDelete(location);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Location (${location.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateLocation', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      locations.map(async (location) => {
        await this.logsService.deleteLog(EntityName.Location, location.id);
      }),
    );

    // Custom logic
    return data.updateLocation;
  }

  async deleteLocationByPk(selectionSet: string[], id: string) {
    const location = await this.locationRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(location);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Location (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateLocationByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.Location, id);
    // Custom logic
    return data.updateLocationByPk;
  }

  async aggregateLocation(
    selectionSet: string[],
    where: LocationBoolExp,
    orderBy?: Array<LocationOrderBy>,
    distinctOn?: Array<LocationSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'locationAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.locationAggregate;
  }
}
