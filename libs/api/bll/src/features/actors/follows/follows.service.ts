import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
import { BadRequestException, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FollowRepository } from '@okampus/api/dal';
import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class FollowsService extends RequestContext {
  constructor(private readonly followRepository: FollowRepository, private readonly hasuraService: HasuraService) {
    super();
  }

  validateProps(props: ValueTypes['FollowInsertInput']) {
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async insertFollow(
    selectionSet: string[],
    objects: Array<ValueTypes['FollowInsertInput']>,
    onConflict?: ValueTypes['FollowOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await objects.every((object) => this.validateProps(object));
    if (!arePropsValid) throw new BadRequestException('Cannot insert Follow with invalid props.');

    const data = await this.hasuraService.insert('insertFollow', selectionSet, objects, onConflict, insertOne);
    // Custom logic
    return data.insertFollow;
  }

  async updateFollow(selectionSet: string[], where: ValueTypes['FollowBoolExp'], _set: ValueTypes['FollowSetInput']) {
    const arePropsValid = this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Follow with invalid props.');

    const data = await this.hasuraService.update('updateFollow', selectionSet, where, _set);
    // Custom logic
    return data.updateFollow;
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
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Follow with invalid props.');

    const data = await this.hasuraService.updateByPk('updateFollowByPk', selectionSet, pkColumns, _set);
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
