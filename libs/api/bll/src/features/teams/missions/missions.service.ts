import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { MissionRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique, canAdminDelete, canAdminManage } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { Mission } from '@okampus/api/dal';
import type {
  MissionInsertInput,
  MissionOnConflict,
  MissionBoolExp,
  MissionOrderBy,
  MissionSelectColumn,
  MissionSetInput,
  MissionUpdates,
  MissionPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class MissionsService extends RequestContext {
  private readonly logger = new Logger(MissionsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly missionRepository: MissionRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: MissionInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, { tenantScope: this.tenant() }))) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(mission: Mission) {
    if (mission.deletedAt) throw new NotFoundException(`Mission was deleted on ${mission.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminDelete(adminRole, mission))) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: MissionSetInput, mission: Mission) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (mission.deletedAt) throw new NotFoundException(`Mission was deleted on ${mission.deletedAt}.`);
    if (mission.hiddenAt) throw new NotFoundException('Mission must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, mission))) return true;

    // Custom logic
    return mission.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: MissionSetInput) {
    this.hasuraService.checkForbiddenFields(props);
    

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: MissionInsertInput) {
    // Custom logic
    props.tenantScopeId = this.tenant().id;
    props.createdById = this.requester().id;

    
    

    return true;
  }

  async insertMissionOne(
    selectionSet: string[],
    object: MissionInsertInput,
    onConflict?: MissionOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Mission.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertMissionOne', selectionSet, object, onConflict);

    const mission = await this.missionRepository.findOneOrFail(data.insertMissionOne.id);
    await this.logsService.createLog(EntityName.Mission, mission);

    // Custom logic
    return data.insertMissionOne;
  }

  async findMission(
    selectionSet: string[],
    where: MissionBoolExp,
    orderBy?: Array<MissionOrderBy>,
    distinctOn?: Array<MissionSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('mission', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.mission;
  }

  async findMissionByPk(
    selectionSet: string[],
     id: string, 
  ) {
    // Custom logic
    const data = await this.hasuraService.findByPk('missionByPk', selectionSet, {  id,  });
    return data.missionByPk;
  }

  async insertMission(
    selectionSet: string[],
    objects: Array<MissionInsertInput>,
    onConflict?: MissionOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Mission.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertMission', selectionSet, objects, onConflict);

    for (const inserted of data.insertMission.returning) {
      const mission = await this.missionRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Mission, mission);
    }

    // Custom logic
    return data.insertMission;
  }

  async updateMissionMany(
    selectionSet: string[],
    updates: Array<MissionUpdates>,
  ) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const missions = await this.missionRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(updates.map(async (update) => {
      const mission = missions.find((mission) => mission.id === update.where.id._eq);
      if (!mission) throw new NotFoundException(`Mission (${update.where.id._eq}) was not found.`);

      const canUpdate = await this.checkPermsUpdate(update._set, mission);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Mission (${update.where.id._eq}).`);

      const arePropsValid = await this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }));

    const data = await this.hasuraService.updateMany('updateMissionMany', selectionSet, updates);

    await Promise.all(missions.map(async (mission) => {
      const update = updates.find((update) => update.where.id._eq === mission.id)
      if (!update) return;
      await this.logsService.updateLog(EntityName.Mission, mission, update._set);
    }));

    // Custom logic
    return data.updateMissionMany;
  }

  async updateMissionByPk(
    selectionSet: string[],
    pkColumns: MissionPkColumnsInput,
    _set: MissionSetInput,
  ) {
    const mission = await this.missionRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, mission);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Mission (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateMissionByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Mission, mission, _set);

    // Custom logic
    return data.updateMissionByPk;
  }

  async deleteMission(
    selectionSet: string[],
    where: MissionBoolExp,
  ) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect) throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const missions = await this.missionRepository.findByIds(where.id._in);

    await Promise.all(missions.map(async (mission) => {
      const canDelete = await this.checkPermsDelete(mission);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Mission (${mission.id}).`);
    }));

    const data = await this.hasuraService.update('updateMission', selectionSet, where, { deletedAt: new Date().toISOString() });

    await Promise.all(missions.map(async (mission) => {
      await this.logsService.deleteLog(EntityName.Mission, mission.id);
    }));

    // Custom logic
    return data.updateMission;
  }

  async deleteMissionByPk(
    selectionSet: string[],
    id: string,
  ) {
    const mission = await this.missionRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(mission);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Mission (${id}).`);

    const data = await this.hasuraService.updateByPk('updateMissionByPk', selectionSet, { id }, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Mission, id);
    // Custom logic
    return data.updateMissionByPk;
  }

  async aggregateMission(
    selectionSet: string[],
    where: MissionBoolExp,
    orderBy?: Array<MissionOrderBy>,
    distinctOn?: Array<MissionSelectColumn>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate('missionAggregate', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.missionAggregate;
  }
}