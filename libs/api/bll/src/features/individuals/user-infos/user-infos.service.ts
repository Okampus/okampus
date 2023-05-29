import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
import { BadRequestException, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UserInfoRepository } from '@okampus/api/dal';
import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class UserInfosService extends RequestContext {
  constructor(private readonly userInfoRepository: UserInfoRepository, private readonly hasuraService: HasuraService) {
    super();
  }

  validateProps(props: ValueTypes['UserInfoInsertInput']) {
    // Custom logic
    return true;
  }

  async insertUserInfo(
    selectionSet: string[],
    objects: Array<ValueTypes['UserInfoInsertInput']>,
    onConflict?: ValueTypes['UserInfoOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await objects.every((object) => this.validateProps(object));
    if (!arePropsValid) throw new BadRequestException('Cannot insert UserInfo with invalid props.');

    const data = await this.hasuraService.insert('insertUserInfo', selectionSet, objects, onConflict, insertOne);
    // Custom logic
    return data.insertUserInfo;
  }

  async updateUserInfo(
    selectionSet: string[],
    where: ValueTypes['UserInfoBoolExp'],
    _set: ValueTypes['UserInfoSetInput']
  ) {
    const arePropsValid = this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update UserInfo with invalid props.');

    const data = await this.hasuraService.update('updateUserInfo', selectionSet, where, _set);
    // Custom logic
    return data.updateUserInfo;
  }

  async findUserInfo(
    selectionSet: string[],
    where: ValueTypes['UserInfoBoolExp'],
    orderBy?: Array<ValueTypes['UserInfoOrderBy']>,
    distinctOn?: Array<ValueTypes['UserInfoSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('userInfo', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.userInfo;
  }

  async findUserInfoByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('userInfoByPk', selectionSet, { id });
    return data.userInfoByPk;
  }

  async updateUserInfoByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['UserInfoPkColumnsInput'],
    _set: ValueTypes['UserInfoSetInput']
  ) {
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update UserInfo with invalid props.');

    const data = await this.hasuraService.updateByPk('updateUserInfoByPk', selectionSet, pkColumns, _set);
    // Custom logic
    return data.updateUserInfoByPk;
  }

  async aggregateUserInfo(
    selectionSet: string[],
    where: ValueTypes['UserInfoBoolExp'],
    orderBy?: Array<ValueTypes['UserInfoOrderBy']>,
    distinctOn?: Array<ValueTypes['UserInfoSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'userInfoAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.userInfoAggregate;
  }
}
