import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MissionJoinRepository, MissionJoin } from '@okampus/api/dal';
import { EntityName, AdminPermissions, ApprovalState } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class MissionJoinsService extends RequestContext {
  private readonly logger = new Logger(MissionJoinsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly missionJoinRepository: MissionJoinRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['MissionJoinInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(missionJoin: MissionJoin) {
    if (missionJoin.deletedAt) throw new NotFoundException(`MissionJoin was deleted on ${missionJoin.deletedAt}.`);
    if (
      this.requester().adminRoles.some(
        (role) =>
          role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === missionJoin.tenant?.id
      )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['MissionJoinSetInput'], missionJoin: MissionJoin) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (missionJoin.deletedAt) throw new NotFoundException(`MissionJoin was deleted on ${missionJoin.deletedAt}.`);
    if (missionJoin.hiddenAt) throw new NotFoundException('MissionJoin must be unhidden before it can be updated.');

    if (
      this.requester().adminRoles.some(
        (role) =>
          role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === missionJoin.tenant?.id
      )
    )
      return true;

    // Custom logic
    return missionJoin.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['MissionJoinSetInput']) {
    this.hasuraService.checkForbiddenFields(props);
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    if (props.processedById) throw new BadRequestException('Cannot update processedById directly.');
    if (props.processedAt) throw new BadRequestException('Cannot update processedAt directly.');

    if (props.state === ApprovalState.Approved || props.state === ApprovalState.Rejected) {
      props.processedById = this.requester().id;
      props.processedAt = new Date().toISOString();
    }
    if (props.pointsProcessedById) throw new BadRequestException('Cannot update pointsProcessedById directly.');
    if (props.pointsProcessedAt) throw new BadRequestException('Cannot update pointsProcessedAt directly.');

    if (props.points !== null) {
      props.pointsProcessedById = this.requester().id;
      props.pointsProcessedAt = new Date().toISOString();
    }

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['MissionJoinInsertInput']) {
    // Custom logic

    return true;
  }

  async insertMissionJoinOne(
    selectionSet: string[],
    object: ValueTypes['MissionJoinInsertInput'],
    onConflict?: ValueTypes['MissionJoinOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert MissionJoin.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertMissionJoinOne', selectionSet, object, onConflict);

    const missionJoin = await this.missionJoinRepository.findOneOrFail(data.insertMissionJoinOne.id);
    await this.logsService.createLog(EntityName.MissionJoin, missionJoin);

    // Custom logic
    return data.insertMissionJoinOne;
  }

  async findMissionJoin(
    selectionSet: string[],
    where: ValueTypes['MissionJoinBoolExp'],
    orderBy?: Array<ValueTypes['MissionJoinOrderBy']>,
    distinctOn?: Array<ValueTypes['MissionJoinSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('missionJoin', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.missionJoin;
  }

  async findMissionJoinByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('missionJoinByPk', selectionSet, { id });
    return data.missionJoinByPk;
  }

  async insertMissionJoin(
    selectionSet: string[],
    objects: Array<ValueTypes['MissionJoinInsertInput']>,
    onConflict?: ValueTypes['MissionJoinOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert MissionJoin.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertMissionJoin', selectionSet, objects, onConflict);

    for (const inserted of data.insertMissionJoin.returning) {
      const missionJoin = await this.missionJoinRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.MissionJoin, missionJoin);
    }

    // Custom logic
    return data.insertMissionJoin;
  }

  async updateMissionJoinMany(selectionSet: string[], updates: Array<ValueTypes['MissionJoinUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const missionJoins = await this.missionJoinRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const missionJoin = missionJoins.find((missionJoin) => missionJoin.id === update.where.id._eq);
      if (!missionJoin) throw new NotFoundException(`MissionJoin (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, missionJoin);
      if (!canUpdate)
        throw new ForbiddenException(`You are not allowed to update MissionJoin (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateMissionJoinMany', selectionSet, updates);

    await Promise.all(
      missionJoins.map(async (missionJoin) => {
        const update = updates.find((update) => update.where.id._eq === missionJoin.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.MissionJoin, missionJoin, update._set);
      })
    );

    // Custom logic
    return data.updateMissionJoinMany;
  }

  async updateMissionJoinByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['MissionJoinPkColumnsInput'],
    _set: ValueTypes['MissionJoinSetInput']
  ) {
    const missionJoin = await this.missionJoinRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, missionJoin);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update MissionJoin (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateMissionJoinByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.MissionJoin, missionJoin, _set);

    // Custom logic
    return data.updateMissionJoinByPk;
  }

  async deleteMissionJoin(selectionSet: string[], where: ValueTypes['MissionJoinBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const missionJoins = await this.missionJoinRepository.findByIds(where.id._in);
    for (const missionJoin of missionJoins) {
      const canDelete = this.checkPermsDelete(missionJoin);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete MissionJoin (${missionJoin.id}).`);
    }

    const data = await this.hasuraService.update('updateMissionJoin', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      missionJoins.map(async (missionJoin) => {
        await this.logsService.deleteLog(EntityName.MissionJoin, missionJoin.id);
      })
    );

    // Custom logic
    return data.updateMissionJoin;
  }

  async deleteMissionJoinByPk(selectionSet: string[], pkColumns: ValueTypes['MissionJoinPkColumnsInput']) {
    const missionJoin = await this.missionJoinRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(missionJoin);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete MissionJoin (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateMissionJoinByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.MissionJoin, pkColumns.id);
    // Custom logic
    return data.updateMissionJoinByPk;
  }

  async aggregateMissionJoin(
    selectionSet: string[],
    where: ValueTypes['MissionJoinBoolExp'],
    orderBy?: Array<ValueTypes['MissionJoinOrderBy']>,
    distinctOn?: Array<ValueTypes['MissionJoinSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'missionJoinAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.missionJoinAggregate;
  }
}
