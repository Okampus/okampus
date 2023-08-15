import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { BotRepository, Bot } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  BotInsertInput,
  BotOnConflict,
  BotBoolExp,
  BotOrderBy,
  BotSelectColumn,
  BotSetInput,
  BotUpdates,
  BotPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class BotsService extends RequestContext {
  private readonly logger = new Logger(BotsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly botRepository: BotRepository
  ) {
    super();
  }

  checkPermsCreate(props: BotInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(bot: Bot) {
    if (bot.deletedAt) throw new NotFoundException(`Bot was deleted on ${bot.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === bot.tenant?.id
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: BotSetInput, bot: Bot) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (bot.deletedAt) throw new NotFoundException(`Bot was deleted on ${bot.deletedAt}.`);
    if (bot.hiddenAt) throw new NotFoundException('Bot must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === bot.tenant?.id
        )
    )
      return true;

    // Custom logic
    return bot.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: BotSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: BotInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertBotOne(selectionSet: string[], object: BotInsertInput, onConflict?: BotOnConflict) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Bot.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertBotOne', selectionSet, object, onConflict);

    const bot = await this.botRepository.findOneOrFail(data.insertBotOne.id);
    await this.logsService.createLog(EntityName.Bot, bot);

    // Custom logic
    return data.insertBotOne;
  }

  async findBot(
    selectionSet: string[],
    where: BotBoolExp,
    orderBy?: Array<BotOrderBy>,
    distinctOn?: Array<BotSelectColumn>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('bot', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.bot;
  }

  async findBotByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('botByPk', selectionSet, { id });
    return data.botByPk;
  }

  async insertBot(selectionSet: string[], objects: Array<BotInsertInput>, onConflict?: BotOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Bot.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertBot', selectionSet, objects, onConflict);

    for (const inserted of data.insertBot.returning) {
      const bot = await this.botRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Bot, bot);
    }

    // Custom logic
    return data.insertBot;
  }

  async updateBotMany(selectionSet: string[], updates: Array<BotUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const bots = await this.botRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const bot = bots.find((bot) => bot.id === update.where.id._eq);
      if (!bot) throw new NotFoundException(`Bot (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, bot);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Bot (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateBotMany', selectionSet, updates);

    await Promise.all(
      bots.map(async (bot) => {
        const update = updates.find((update) => update.where.id._eq === bot.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Bot, bot, update._set);
      })
    );

    // Custom logic
    return data.updateBotMany;
  }

  async updateBotByPk(selectionSet: string[], pkColumns: BotPkColumnsInput, _set: BotSetInput) {
    const bot = await this.botRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, bot);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Bot (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateBotByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Bot, bot, _set);

    // Custom logic
    return data.updateBotByPk;
  }

  async deleteBot(selectionSet: string[], where: BotBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const bots = await this.botRepository.findByIds(where.id._in);
    for (const bot of bots) {
      const canDelete = this.checkPermsDelete(bot);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Bot (${bot.id}).`);
    }

    const data = await this.hasuraService.update('updateBot', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      bots.map(async (bot) => {
        await this.logsService.deleteLog(EntityName.Bot, bot.id);
      })
    );

    // Custom logic
    return data.updateBot;
  }

  async deleteBotByPk(selectionSet: string[], pkColumns: BotPkColumnsInput) {
    const bot = await this.botRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(bot);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Bot (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateBotByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Bot, pkColumns.id);
    // Custom logic
    return data.updateBotByPk;
  }

  async aggregateBot(
    selectionSet: string[],
    where: BotBoolExp,
    orderBy?: Array<BotOrderBy>,
    distinctOn?: Array<BotSelectColumn>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'botAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.botAggregate;
  }
}
