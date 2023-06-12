import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FollowRepository, Follow } from '@okampus/api/dal';
import { ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class FollowsService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly followRepository: FollowRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['FollowInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const follow = await this.followRepository.findOneOrFail(id);
    if (follow.deletedAt) throw new NotFoundException(`Follow was deleted on ${follow.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['FollowSetInput'], follow: Follow) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (follow.deletedAt) throw new NotFoundException(`Follow was deleted on ${follow.deletedAt}.`);
    if (follow.hiddenAt) throw new NotFoundException('Follow must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return follow.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['FollowSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['FollowInsertInput']) {
    // Custom logic
    return true;
  }

  async insertFollow(
    selectionSet: string[],
    objects: Array<ValueTypes['FollowInsertInput']>,
    onConflict?: ValueTypes['FollowOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await Promise.all(
      objects.map(async (props) => {
        const canCreate = await this.checkPermsCreate(props);
        if (!canCreate) throw new ForbiddenException('You are not allowed to insert Follow.');

        const arePropsValid = await this.checkPropsConstraints(props);
        if (!arePropsValid) throw new BadRequestException('Props are not valid.');

        const areRelationshipsValid = await this.checkCreateRelationships(props);
        if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

        return canCreate && arePropsValid && areRelationshipsValid;
      })
    ).then((results) => results.every(Boolean));

    if (!arePropsValid) throw new ForbiddenException('You are not allowed to insert Follow.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insert('insertFollow', selectionSet, objects, onConflict, insertOne);

    const follow = await this.followRepository.findOneOrFail(data.insertFollow[0].id);
    await this.logsService.createLog(follow);

    // Custom logic
    return data.insertFollow;
  }

  async findFollow(
    selectionSet: string[],
    where: ValueTypes['FollowBoolExp'],
    orderBy?: Array<ValueTypes['FollowOrderBy']>,
    distinctOn?: Array<ValueTypes['FollowSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('follow', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.follow;
  }

  async findFollowByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('followByPk', selectionSet, { id });
    return data.followByPk;
  }

  async updateFollowByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['FollowPkColumnsInput'],
    _set: ValueTypes['FollowSetInput']
  ) {
    const follow = await this.followRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, follow);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Follow (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateFollowByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(follow, _set);

    // Custom logic
    return data.updateFollowByPk;
  }

  async deleteFollowByPk(selectionSet: string[], pkColumns: ValueTypes['FollowPkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Follow (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateFollowByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(pkColumns.id);
    // Custom logic
    return data.updateFollowByPk;
  }

  async aggregateFollow(
    selectionSet: string[],
    where: ValueTypes['FollowBoolExp'],
    orderBy?: Array<ValueTypes['FollowOrderBy']>,
    distinctOn?: Array<ValueTypes['FollowSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'followAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.followAggregate;
  }
}
