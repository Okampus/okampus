import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { BotInfoRepository, BotInfo } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class BotInfosService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly botInfoRepository: BotInfoRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['BotInfoInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const botInfo = await this.botInfoRepository.findOneOrFail(id);
    if (botInfo.deletedAt) throw new NotFoundException(`BotInfo was deleted on ${botInfo.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['BotInfoSetInput'], botInfo: BotInfo) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (botInfo.deletedAt) throw new NotFoundException(`BotInfo was deleted on ${botInfo.deletedAt}.`);
    if (botInfo.hiddenAt) throw new NotFoundException('BotInfo must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return botInfo.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['BotInfoSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['BotInfoInsertInput']) {
    // Custom logic
    return true;
  }

  async insertBotInfo(
    selectionSet: string[],
    objects: Array<ValueTypes['BotInfoInsertInput']>,
    onConflict?: ValueTypes['BotInfoOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await Promise.all(
      objects.map(async (props) => {
        const canCreate = await this.checkPermsCreate(props);
        if (!canCreate) throw new ForbiddenException('You are not allowed to insert BotInfo.');

        const arePropsValid = await this.checkPropsConstraints(props);
        if (!arePropsValid) throw new BadRequestException('Props are not valid.');

        const areRelationshipsValid = await this.checkCreateRelationships(props);
        if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

        return canCreate && arePropsValid && areRelationshipsValid;
      })
    ).then((results) => results.every(Boolean));

    if (!arePropsValid) throw new ForbiddenException('You are not allowed to insert BotInfo.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insert('insertBotInfo', selectionSet, objects, onConflict, insertOne);

    for (const inserted of data.insertBotInfo.returning) {
      const botInfo = await this.botInfoRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.BotInfo, botInfo);
    }

    // Custom logic
    return data.insertBotInfo;
  }

  async findBotInfo(
    selectionSet: string[],
    where: ValueTypes['BotInfoBoolExp'],
    orderBy?: Array<ValueTypes['BotInfoOrderBy']>,
    distinctOn?: Array<ValueTypes['BotInfoSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('botInfo', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.botInfo;
  }

  async findBotInfoByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('botInfoByPk', selectionSet, { id });
    return data.botInfoByPk;
  }

  async updateBotInfoByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['BotInfoPkColumnsInput'],
    _set: ValueTypes['BotInfoSetInput']
  ) {
    const botInfo = await this.botInfoRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, botInfo);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update BotInfo (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateBotInfoByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.BotInfo, botInfo, _set);

    // Custom logic
    return data.updateBotInfoByPk;
  }

  async deleteBotInfoByPk(selectionSet: string[], pkColumns: ValueTypes['BotInfoPkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete BotInfo (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateBotInfoByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.BotInfo, pkColumns.id);
    // Custom logic
    return data.updateBotInfoByPk;
  }

  async aggregateBotInfo(
    selectionSet: string[],
    where: ValueTypes['BotInfoBoolExp'],
    orderBy?: Array<ValueTypes['BotInfoOrderBy']>,
    distinctOn?: Array<ValueTypes['BotInfoSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'botInfoAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.botInfoAggregate;
  }
}
