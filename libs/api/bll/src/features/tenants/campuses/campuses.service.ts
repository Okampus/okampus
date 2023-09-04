import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { CampusRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique, canAdminDelete, canAdminManage } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { Campus } from '@okampus/api/dal';
import type {
  CampusInsertInput,
  CampusOnConflict,
  CampusBoolExp,
  CampusOrderBy,
  CampusSelectColumn,
  CampusSetInput,
  CampusUpdates,
  CampusPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class CampusesService extends RequestContext {
  private readonly logger = new Logger(CampusesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly campusRepository: CampusRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: CampusInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, { tenantScope: this.tenant() }))) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(campus: Campus) {
    if (campus.deletedAt) throw new NotFoundException(`Campus was deleted on ${campus.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminDelete(adminRole, campus))) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: CampusSetInput, campus: Campus) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (campus.deletedAt) throw new NotFoundException(`Campus was deleted on ${campus.deletedAt}.`);
    if (campus.hiddenAt) throw new NotFoundException('Campus must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, campus))) return true;

    // Custom logic
    return campus.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: CampusSetInput) {
    this.hasuraService.checkForbiddenFields(props);
    

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: CampusInsertInput) {
    // Custom logic
    props.tenantScopeId = this.tenant().id;
    props.createdById = this.requester().id;

    
    

    return true;
  }

  async insertCampusOne(
    selectionSet: string[],
    object: CampusInsertInput,
    onConflict?: CampusOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Campus.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertCampusOne', selectionSet, object, onConflict);

    const campus = await this.campusRepository.findOneOrFail(data.insertCampusOne.id);
    await this.logsService.createLog(EntityName.Campus, campus);

    // Custom logic
    return data.insertCampusOne;
  }

  async findCampus(
    selectionSet: string[],
    where: CampusBoolExp,
    orderBy?: Array<CampusOrderBy>,
    distinctOn?: Array<CampusSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('campus', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.campus;
  }

  async findCampusByPk(
    selectionSet: string[],
     id: string, 
  ) {
    // Custom logic
    const data = await this.hasuraService.findByPk('campusByPk', selectionSet, {  id,  });
    return data.campusByPk;
  }

  async insertCampus(
    selectionSet: string[],
    objects: Array<CampusInsertInput>,
    onConflict?: CampusOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Campus.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertCampus', selectionSet, objects, onConflict);

    for (const inserted of data.insertCampus.returning) {
      const campus = await this.campusRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Campus, campus);
    }

    // Custom logic
    return data.insertCampus;
  }

  async updateCampusMany(
    selectionSet: string[],
    updates: Array<CampusUpdates>,
  ) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const campuses = await this.campusRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(updates.map(async (update) => {
      const campus = campuses.find((campus) => campus.id === update.where.id._eq);
      if (!campus) throw new NotFoundException(`Campus (${update.where.id._eq}) was not found.`);

      const canUpdate = await this.checkPermsUpdate(update._set, campus);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Campus (${update.where.id._eq}).`);

      const arePropsValid = await this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }));

    const data = await this.hasuraService.updateMany('updateCampusMany', selectionSet, updates);

    await Promise.all(campuses.map(async (campus) => {
      const update = updates.find((update) => update.where.id._eq === campus.id)
      if (!update) return;
      await this.logsService.updateLog(EntityName.Campus, campus, update._set);
    }));

    // Custom logic
    return data.updateCampusMany;
  }

  async updateCampusByPk(
    selectionSet: string[],
    pkColumns: CampusPkColumnsInput,
    _set: CampusSetInput,
  ) {
    const campus = await this.campusRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, campus);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Campus (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateCampusByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Campus, campus, _set);

    // Custom logic
    return data.updateCampusByPk;
  }

  async deleteCampus(
    selectionSet: string[],
    where: CampusBoolExp,
  ) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect) throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const campuses = await this.campusRepository.findByIds(where.id._in);

    await Promise.all(campuses.map(async (campus) => {
      const canDelete = await this.checkPermsDelete(campus);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Campus (${campus.id}).`);
    }));

    const data = await this.hasuraService.update('updateCampus', selectionSet, where, { deletedAt: new Date().toISOString() });

    await Promise.all(campuses.map(async (campus) => {
      await this.logsService.deleteLog(EntityName.Campus, campus.id);
    }));

    // Custom logic
    return data.updateCampus;
  }

  async deleteCampusByPk(
    selectionSet: string[],
    id: string,
  ) {
    const campus = await this.campusRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(campus);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Campus (${id}).`);

    const data = await this.hasuraService.updateByPk('updateCampusByPk', selectionSet, { id }, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Campus, id);
    // Custom logic
    return data.updateCampusByPk;
  }

  async aggregateCampus(
    selectionSet: string[],
    where: CampusBoolExp,
    orderBy?: Array<CampusOrderBy>,
    distinctOn?: Array<CampusSelectColumn>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate('campusAggregate', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.campusAggregate;
  }
}