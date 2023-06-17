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

  checkPermsCreate(props: ValueTypes['BotInfoInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(botInfo: BotInfo) {
    if (botInfo.deletedAt) throw new NotFoundException(`BotInfo was deleted on ${botInfo.deletedAt}.`);
    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['BotInfoSetInput'], botInfo: BotInfo) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (botInfo.deletedAt) throw new NotFoundException(`BotInfo was deleted on ${botInfo.deletedAt}.`);
    if (botInfo.hiddenAt) throw new NotFoundException('BotInfo must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return botInfo.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['BotInfoSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['BotInfoInsertInput']) {
    // Custom logic
    return true;
  }

  async insertBotInfoOne(
    selectionSet: string[],
    object: ValueTypes['BotInfoInsertInput'],
    onConflict?: ValueTypes['BotInfoOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert BotInfo.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertBotInfoOne', selectionSet, object, onConflict);

    const botInfo = await this.botInfoRepository.findOneOrFail(data.insertBotInfoOne.id);
    await this.logsService.createLog(EntityName.BotInfo, botInfo);

    // Custom logic
    return data.insertBotInfoOne;
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

  async insertBotInfo(
    selectionSet: string[],
    objects: Array<ValueTypes['BotInfoInsertInput']>,
    onConflict?: ValueTypes['BotInfoOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert BotInfo.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insert('insertBotInfo', selectionSet, objects, onConflict);

    for (const inserted of data.insertBotInfo.returning) {
      const botInfo = await this.botInfoRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.BotInfo, botInfo);
    }

    // Custom logic
    return data.insertBotInfo;
  }

  async updateBotInfoMany(selectionSet: string[], updates: Array<ValueTypes['BotInfoUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const botInfos = await this.botInfoRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const botInfo = botInfos.find((botInfo) => botInfo.id === update.where.id._eq);
      if (!botInfo) throw new NotFoundException(`BotInfo (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, botInfo);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update BotInfo (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateBotInfoMany', selectionSet, updates);

    await Promise.all(
      botInfos.map(async (botInfo) => {
        const update = updates.find((update) => update.where.id._eq === botInfo.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.BotInfo, botInfo, update._set);
      })
    );

    // Custom logic
    return data.updateBotInfoMany;
  }

  async updateBotInfoByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['BotInfoPkColumnsInput'],
    _set: ValueTypes['BotInfoSetInput']
  ) {
    const botInfo = await this.botInfoRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, botInfo);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update BotInfo (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateBotInfoByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.BotInfo, botInfo, _set);

    // Custom logic
    return data.updateBotInfoByPk;
  }

  async deleteBotInfoByPk(selectionSet: string[], pkColumns: ValueTypes['BotInfoPkColumnsInput']) {
    const botInfo = await this.botInfoRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(botInfo);
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
