import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CampusClusterRepository, CampusCluster } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  CampusClusterInsertInput,
  CampusClusterOnConflict,
  CampusClusterBoolExp,
  CampusClusterOrderBy,
  CampusClusterSelectColumn,
  CampusClusterSetInput,
  CampusClusterUpdates,
  CampusClusterPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class CampusClustersService extends RequestContext {
  private readonly logger = new Logger(CampusClustersService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly campusClusterRepository: CampusClusterRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: CampusClusterInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(campusCluster: CampusCluster) {
    if (campusCluster.deletedAt)
      throw new NotFoundException(`CampusCluster was deleted on ${campusCluster.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) &&
            role.tenant?.id === campusCluster.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: CampusClusterSetInput, campusCluster: CampusCluster) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (campusCluster.deletedAt)
      throw new NotFoundException(`CampusCluster was deleted on ${campusCluster.deletedAt}.`);
    if (campusCluster.hiddenAt) throw new NotFoundException('CampusCluster must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) &&
            role.tenant?.id === campusCluster.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return campusCluster.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: CampusClusterSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: CampusClusterInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertCampusClusterOne(
    selectionSet: string[],
    object: CampusClusterInsertInput,
    onConflict?: CampusClusterOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert CampusCluster.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertCampusClusterOne', selectionSet, object, onConflict);

    const campusCluster = await this.campusClusterRepository.findOneOrFail(data.insertCampusClusterOne.id);
    await this.logsService.createLog(EntityName.CampusCluster, campusCluster);

    // Custom logic
    return data.insertCampusClusterOne;
  }

  async findCampusCluster(
    selectionSet: string[],
    where: CampusClusterBoolExp,
    orderBy?: Array<CampusClusterOrderBy>,
    distinctOn?: Array<CampusClusterSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'campusCluster',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.campusCluster;
  }

  async findCampusClusterByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('campusClusterByPk', selectionSet, { id });
    return data.campusClusterByPk;
  }

  async insertCampusCluster(
    selectionSet: string[],
    objects: Array<CampusClusterInsertInput>,
    onConflict?: CampusClusterOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert CampusCluster.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertCampusCluster', selectionSet, objects, onConflict);

    for (const inserted of data.insertCampusCluster.returning) {
      const campusCluster = await this.campusClusterRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.CampusCluster, campusCluster);
    }

    // Custom logic
    return data.insertCampusCluster;
  }

  async updateCampusClusterMany(selectionSet: string[], updates: Array<CampusClusterUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const campusClusters = await this.campusClusterRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const campusCluster = campusClusters.find((campusCluster) => campusCluster.id === update.where.id._eq);
        if (!campusCluster) throw new NotFoundException(`CampusCluster (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, campusCluster);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update CampusCluster (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateCampusClusterMany', selectionSet, updates);

    await Promise.all(
      campusClusters.map(async (campusCluster) => {
        const update = updates.find((update) => update.where.id._eq === campusCluster.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.CampusCluster, campusCluster, update._set);
      }),
    );

    // Custom logic
    return data.updateCampusClusterMany;
  }

  async updateCampusClusterByPk(
    selectionSet: string[],
    pkColumns: CampusClusterPkColumnsInput,
    _set: CampusClusterSetInput,
  ) {
    const campusCluster = await this.campusClusterRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, campusCluster);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update CampusCluster (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateCampusClusterByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.CampusCluster, campusCluster, _set);

    // Custom logic
    return data.updateCampusClusterByPk;
  }

  async deleteCampusCluster(selectionSet: string[], where: CampusClusterBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const campusClusters = await this.campusClusterRepository.findByIds(where.id._in);

    await Promise.all(
      campusClusters.map(async (campusCluster) => {
        const canDelete = await this.checkPermsDelete(campusCluster);
        if (!canDelete)
          throw new ForbiddenException(`You are not allowed to delete CampusCluster (${campusCluster.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateCampusCluster', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      campusClusters.map(async (campusCluster) => {
        await this.logsService.deleteLog(EntityName.CampusCluster, campusCluster.id);
      }),
    );

    // Custom logic
    return data.updateCampusCluster;
  }

  async deleteCampusClusterByPk(selectionSet: string[], id: string) {
    const campusCluster = await this.campusClusterRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(campusCluster);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete CampusCluster (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateCampusClusterByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.CampusCluster, id);
    // Custom logic
    return data.updateCampusClusterByPk;
  }

  async aggregateCampusCluster(
    selectionSet: string[],
    where: CampusClusterBoolExp,
    orderBy?: Array<CampusClusterOrderBy>,
    distinctOn?: Array<CampusClusterSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'campusClusterAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.campusClusterAggregate;
  }
}
