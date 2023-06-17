import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TagRepository, Tag } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class TagsService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly tagRepository: TagRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['TagInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(tag: Tag) {
    if (tag.deletedAt) throw new NotFoundException(`Tag was deleted on ${tag.deletedAt}.`);
    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['TagSetInput'], tag: Tag) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (tag.deletedAt) throw new NotFoundException(`Tag was deleted on ${tag.deletedAt}.`);
    if (tag.hiddenAt) throw new NotFoundException('Tag must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return tag.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['TagSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['TagInsertInput']) {
    // Custom logic
    return true;
  }

  async insertTagOne(
    selectionSet: string[],
    object: ValueTypes['TagInsertInput'],
    onConflict?: ValueTypes['TagOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Tag.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertTagOne', selectionSet, object, onConflict);

    const tag = await this.tagRepository.findOneOrFail(data.insertTagOne.id);
    await this.logsService.createLog(EntityName.Tag, tag);

    // Custom logic
    return data.insertTagOne;
  }

  async findTag(
    selectionSet: string[],
    where: ValueTypes['TagBoolExp'],
    orderBy?: Array<ValueTypes['TagOrderBy']>,
    distinctOn?: Array<ValueTypes['TagSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('tag', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.tag;
  }

  async findTagByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('tagByPk', selectionSet, { id });
    return data.tagByPk;
  }

  async insertTag(
    selectionSet: string[],
    objects: Array<ValueTypes['TagInsertInput']>,
    onConflict?: ValueTypes['TagOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Tag.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insert('insertTag', selectionSet, objects, onConflict);

    for (const inserted of data.insertTag.returning) {
      const tag = await this.tagRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Tag, tag);
    }

    // Custom logic
    return data.insertTag;
  }

  async updateTagMany(selectionSet: string[], updates: Array<ValueTypes['TagUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const tags = await this.tagRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const tag = tags.find((tag) => tag.id === update.where.id._eq);
      if (!tag) throw new NotFoundException(`Tag (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, tag);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Tag (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateTagMany', selectionSet, updates);

    await Promise.all(
      tags.map(async (tag) => {
        const update = updates.find((update) => update.where.id._eq === tag.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Tag, tag, update._set);
      })
    );

    // Custom logic
    return data.updateTagMany;
  }

  async updateTagByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['TagPkColumnsInput'],
    _set: ValueTypes['TagSetInput']
  ) {
    const tag = await this.tagRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, tag);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Tag (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTagByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Tag, tag, _set);

    // Custom logic
    return data.updateTagByPk;
  }

  async deleteTagByPk(selectionSet: string[], pkColumns: ValueTypes['TagPkColumnsInput']) {
    const tag = await this.tagRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(tag);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Tag (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateTagByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Tag, pkColumns.id);
    // Custom logic
    return data.updateTagByPk;
  }

  async aggregateTag(
    selectionSet: string[],
    where: ValueTypes['TagBoolExp'],
    orderBy?: Array<ValueTypes['TagOrderBy']>,
    distinctOn?: Array<ValueTypes['TagSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'tagAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.tagAggregate;
  }
}
