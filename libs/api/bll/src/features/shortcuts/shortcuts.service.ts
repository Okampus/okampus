import { RequestContext } from '../../shards/abstract/request-context';
import { HasuraService } from '../../global/graphql/hasura.service';
import { LogsService } from '../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ShortcutRepository, Shortcut } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  ShortcutInsertInput,
  ShortcutOnConflict,
  ShortcutBoolExp,
  ShortcutOrderBy,
  ShortcutSelectColumn,
  ShortcutSetInput,
  ShortcutUpdates,
  ShortcutPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class ShortcutsService extends RequestContext {
  private readonly logger = new Logger(ShortcutsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly shortcutRepository: ShortcutRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: ShortcutInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(shortcut: Shortcut) {
    if (shortcut.deletedAt) throw new NotFoundException(`Shortcut was deleted on ${shortcut.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === shortcut.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ShortcutSetInput, shortcut: Shortcut) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (shortcut.deletedAt) throw new NotFoundException(`Shortcut was deleted on ${shortcut.deletedAt}.`);
    if (shortcut.hiddenAt) throw new NotFoundException('Shortcut must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === shortcut.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return shortcut.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ShortcutSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ShortcutInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertShortcutOne(selectionSet: string[], object: ShortcutInsertInput, onConflict?: ShortcutOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Shortcut.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertShortcutOne', selectionSet, object, onConflict);

    const shortcut = await this.shortcutRepository.findOneOrFail(data.insertShortcutOne.id);
    await this.logsService.createLog(EntityName.Shortcut, shortcut);

    // Custom logic
    return data.insertShortcutOne;
  }

  async findShortcut(
    selectionSet: string[],
    where: ShortcutBoolExp,
    orderBy?: Array<ShortcutOrderBy>,
    distinctOn?: Array<ShortcutSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('shortcut', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.shortcut;
  }

  async findShortcutByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('shortcutByPk', selectionSet, { id });
    return data.shortcutByPk;
  }

  async insertShortcut(selectionSet: string[], objects: Array<ShortcutInsertInput>, onConflict?: ShortcutOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Shortcut.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertShortcut', selectionSet, objects, onConflict);

    for (const inserted of data.insertShortcut.returning) {
      const shortcut = await this.shortcutRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Shortcut, shortcut);
    }

    // Custom logic
    return data.insertShortcut;
  }

  async updateShortcutMany(selectionSet: string[], updates: Array<ShortcutUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const shortcuts = await this.shortcutRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const shortcut = shortcuts.find((shortcut) => shortcut.id === update.where.id._eq);
        if (!shortcut) throw new NotFoundException(`Shortcut (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, shortcut);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update Shortcut (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateShortcutMany', selectionSet, updates);

    await Promise.all(
      shortcuts.map(async (shortcut) => {
        const update = updates.find((update) => update.where.id._eq === shortcut.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Shortcut, shortcut, update._set);
      }),
    );

    // Custom logic
    return data.updateShortcutMany;
  }

  async updateShortcutByPk(selectionSet: string[], pkColumns: ShortcutPkColumnsInput, _set: ShortcutSetInput) {
    const shortcut = await this.shortcutRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, shortcut);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Shortcut (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateShortcutByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Shortcut, shortcut, _set);

    // Custom logic
    return data.updateShortcutByPk;
  }

  async deleteShortcut(selectionSet: string[], where: ShortcutBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const shortcuts = await this.shortcutRepository.findByIds(where.id._in);

    await Promise.all(
      shortcuts.map(async (shortcut) => {
        const canDelete = await this.checkPermsDelete(shortcut);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Shortcut (${shortcut.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateShortcut', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      shortcuts.map(async (shortcut) => {
        await this.logsService.deleteLog(EntityName.Shortcut, shortcut.id);
      }),
    );

    // Custom logic
    return data.updateShortcut;
  }

  async deleteShortcutByPk(selectionSet: string[], id: string) {
    const shortcut = await this.shortcutRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(shortcut);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Shortcut (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateShortcutByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.Shortcut, id);
    // Custom logic
    return data.updateShortcutByPk;
  }

  async aggregateShortcut(
    selectionSet: string[],
    where: ShortcutBoolExp,
    orderBy?: Array<ShortcutOrderBy>,
    distinctOn?: Array<ShortcutSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'shortcutAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.shortcutAggregate;
  }
}
