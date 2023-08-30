import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { GrantAllocateRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique, canAdminDelete, canAdminManage } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { GrantAllocate } from '@okampus/api/dal';
import type {
  GrantAllocateInsertInput,
  GrantAllocateOnConflict,
  GrantAllocateBoolExp,
  GrantAllocateOrderBy,
  GrantAllocateSelectColumn,
  GrantAllocateSetInput,
  GrantAllocateUpdates,
  GrantAllocatePkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class GrantAllocatesService extends RequestContext {
  private readonly logger = new Logger(GrantAllocatesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly grantAllocateRepository: GrantAllocateRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: GrantAllocateInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, { tenant: this.tenant() }))) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(grantAllocate: GrantAllocate) {
    if (grantAllocate.deletedAt)
      throw new NotFoundException(`GrantAllocate was deleted on ${grantAllocate.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminDelete(adminRole, grantAllocate))) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: GrantAllocateSetInput, grantAllocate: GrantAllocate) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (grantAllocate.deletedAt)
      throw new NotFoundException(`GrantAllocate was deleted on ${grantAllocate.deletedAt}.`);
    if (grantAllocate.hiddenAt) throw new NotFoundException('GrantAllocate must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, grantAllocate))) return true;

    // Custom logic
    return grantAllocate.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: GrantAllocateSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: GrantAllocateInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertGrantAllocateOne(
    selectionSet: string[],
    object: GrantAllocateInsertInput,
    onConflict?: GrantAllocateOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert GrantAllocate.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertGrantAllocateOne', selectionSet, object, onConflict);

    const grantAllocate = await this.grantAllocateRepository.findOneOrFail(data.insertGrantAllocateOne.id);
    await this.logsService.createLog(EntityName.GrantAllocate, grantAllocate);

    // Custom logic
    return data.insertGrantAllocateOne;
  }

  async findGrantAllocate(
    selectionSet: string[],
    where: GrantAllocateBoolExp,
    orderBy?: Array<GrantAllocateOrderBy>,
    distinctOn?: Array<GrantAllocateSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find(
      'grantAllocate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.grantAllocate;
  }

  async findGrantAllocateByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('grantAllocateByPk', selectionSet, { id });
    return data.grantAllocateByPk;
  }

  async insertGrantAllocate(
    selectionSet: string[],
    objects: Array<GrantAllocateInsertInput>,
    onConflict?: GrantAllocateOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert GrantAllocate.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertGrantAllocate', selectionSet, objects, onConflict);

    for (const inserted of data.insertGrantAllocate.returning) {
      const grantAllocate = await this.grantAllocateRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.GrantAllocate, grantAllocate);
    }

    // Custom logic
    return data.insertGrantAllocate;
  }

  async updateGrantAllocateMany(selectionSet: string[], updates: Array<GrantAllocateUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const grantAllocates = await this.grantAllocateRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const grantAllocate = grantAllocates.find((grantAllocate) => grantAllocate.id === update.where.id._eq);
        if (!grantAllocate) throw new NotFoundException(`GrantAllocate (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, grantAllocate);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update GrantAllocate (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateGrantAllocateMany', selectionSet, updates);

    await Promise.all(
      grantAllocates.map(async (grantAllocate) => {
        const update = updates.find((update) => update.where.id._eq === grantAllocate.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.GrantAllocate, grantAllocate, update._set);
      }),
    );

    // Custom logic
    return data.updateGrantAllocateMany;
  }

  async updateGrantAllocateByPk(
    selectionSet: string[],
    pkColumns: GrantAllocatePkColumnsInput,
    _set: GrantAllocateSetInput,
  ) {
    const grantAllocate = await this.grantAllocateRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, grantAllocate);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update GrantAllocate (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateGrantAllocateByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.GrantAllocate, grantAllocate, _set);

    // Custom logic
    return data.updateGrantAllocateByPk;
  }

  async deleteGrantAllocate(selectionSet: string[], where: GrantAllocateBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const grantAllocates = await this.grantAllocateRepository.findByIds(where.id._in);

    await Promise.all(
      grantAllocates.map(async (grantAllocate) => {
        const canDelete = await this.checkPermsDelete(grantAllocate);
        if (!canDelete)
          throw new ForbiddenException(`You are not allowed to delete GrantAllocate (${grantAllocate.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateGrantAllocate', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      grantAllocates.map(async (grantAllocate) => {
        await this.logsService.deleteLog(EntityName.GrantAllocate, grantAllocate.id);
      }),
    );

    // Custom logic
    return data.updateGrantAllocate;
  }

  async deleteGrantAllocateByPk(selectionSet: string[], id: string) {
    const grantAllocate = await this.grantAllocateRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(grantAllocate);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete GrantAllocate (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateGrantAllocateByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.GrantAllocate, id);
    // Custom logic
    return data.updateGrantAllocateByPk;
  }

  async aggregateGrantAllocate(
    selectionSet: string[],
    where: GrantAllocateBoolExp,
    orderBy?: Array<GrantAllocateOrderBy>,
    distinctOn?: Array<GrantAllocateSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'grantAllocateAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.grantAllocateAggregate;
  }
}
