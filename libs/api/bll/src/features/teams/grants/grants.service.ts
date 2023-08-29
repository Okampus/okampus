import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { GrantRepository, Grant } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  GrantInsertInput,
  GrantOnConflict,
  GrantBoolExp,
  GrantOrderBy,
  GrantSelectColumn,
  GrantSetInput,
  GrantUpdates,
  GrantPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class GrantsService extends RequestContext {
  private readonly logger = new Logger(GrantsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly grantRepository: GrantRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: GrantInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(grant: Grant) {
    if (grant.deletedAt) throw new NotFoundException(`Grant was deleted on ${grant.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === grant.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: GrantSetInput, grant: Grant) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (grant.deletedAt) throw new NotFoundException(`Grant was deleted on ${grant.deletedAt}.`);
    if (grant.hiddenAt) throw new NotFoundException('Grant must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === grant.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return grant.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: GrantSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: GrantInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertGrantOne(selectionSet: string[], object: GrantInsertInput, onConflict?: GrantOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Grant.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertGrantOne', selectionSet, object, onConflict);

    const grant = await this.grantRepository.findOneOrFail(data.insertGrantOne.id);
    await this.logsService.createLog(EntityName.Grant, grant);

    // Custom logic
    return data.insertGrantOne;
  }

  async findGrant(
    selectionSet: string[],
    where: GrantBoolExp,
    orderBy?: Array<GrantOrderBy>,
    distinctOn?: Array<GrantSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('grant', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.grant;
  }

  async findGrantByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('grantByPk', selectionSet, { id });
    return data.grantByPk;
  }

  async insertGrant(selectionSet: string[], objects: Array<GrantInsertInput>, onConflict?: GrantOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Grant.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertGrant', selectionSet, objects, onConflict);

    for (const inserted of data.insertGrant.returning) {
      const grant = await this.grantRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Grant, grant);
    }

    // Custom logic
    return data.insertGrant;
  }

  async updateGrantMany(selectionSet: string[], updates: Array<GrantUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const grants = await this.grantRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const grant = grants.find((grant) => grant.id === update.where.id._eq);
        if (!grant) throw new NotFoundException(`Grant (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, grant);
        if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Grant (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateGrantMany', selectionSet, updates);

    await Promise.all(
      grants.map(async (grant) => {
        const update = updates.find((update) => update.where.id._eq === grant.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Grant, grant, update._set);
      }),
    );

    // Custom logic
    return data.updateGrantMany;
  }

  async updateGrantByPk(selectionSet: string[], pkColumns: GrantPkColumnsInput, _set: GrantSetInput) {
    const grant = await this.grantRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, grant);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Grant (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateGrantByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Grant, grant, _set);

    // Custom logic
    return data.updateGrantByPk;
  }

  async deleteGrant(selectionSet: string[], where: GrantBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const grants = await this.grantRepository.findByIds(where.id._in);

    await Promise.all(
      grants.map(async (grant) => {
        const canDelete = await this.checkPermsDelete(grant);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Grant (${grant.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateGrant', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      grants.map(async (grant) => {
        await this.logsService.deleteLog(EntityName.Grant, grant.id);
      }),
    );

    // Custom logic
    return data.updateGrant;
  }

  async deleteGrantByPk(selectionSet: string[], id: string) {
    const grant = await this.grantRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(grant);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Grant (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateGrantByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.Grant, id);
    // Custom logic
    return data.updateGrantByPk;
  }

  async aggregateGrant(
    selectionSet: string[],
    where: GrantBoolExp,
    orderBy?: Array<GrantOrderBy>,
    distinctOn?: Array<GrantSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'grantAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.grantAggregate;
  }
}
