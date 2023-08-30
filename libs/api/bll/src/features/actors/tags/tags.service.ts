import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { TagRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { canAdminCreate, canAdminDelete, canAdminUpdate } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { Tag } from '@okampus/api/dal';
import type {
  TagInsertInput,
  TagOnConflict,
  TagBoolExp,
  TagOrderBy,
  TagSelectColumn,
  TagSetInput,
  TagUpdates,
  TagPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class TagsService extends RequestContext {
  private readonly logger = new Logger(TagsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly tagRepository: TagRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: TagInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminCreate(adminRole, this.tenant()))) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(tag: Tag) {
    if (tag.deletedAt) throw new NotFoundException(`Tag was deleted on ${tag.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminDelete(adminRole, tag))) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: TagSetInput, tag: Tag) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (tag.deletedAt) throw new NotFoundException(`Tag was deleted on ${tag.deletedAt}.`);
    if (tag.hiddenAt) throw new NotFoundException('Tag must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminUpdate(adminRole, tag))) return true;

    // Custom logic
    return tag.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: TagSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: TagInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertTagOne(selectionSet: string[], object: TagInsertInput, onConflict?: TagOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Tag.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
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
    where: TagBoolExp,
    orderBy?: Array<TagOrderBy>,
    distinctOn?: Array<TagSelectColumn>,
    limit?: number,
    offset?: number,
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

  async insertTag(selectionSet: string[], objects: Array<TagInsertInput>, onConflict?: TagOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Tag.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertTag', selectionSet, objects, onConflict);

    for (const inserted of data.insertTag.returning) {
      const tag = await this.tagRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Tag, tag);
    }

    // Custom logic
    return data.insertTag;
  }

  async updateTagMany(selectionSet: string[], updates: Array<TagUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const tags = await this.tagRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const tag = tags.find((tag) => tag.id === update.where.id._eq);
        if (!tag) throw new NotFoundException(`Tag (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, tag);
        if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Tag (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateTagMany', selectionSet, updates);

    await Promise.all(
      tags.map(async (tag) => {
        const update = updates.find((update) => update.where.id._eq === tag.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Tag, tag, update._set);
      }),
    );

    // Custom logic
    return data.updateTagMany;
  }

  async updateTagByPk(selectionSet: string[], pkColumns: TagPkColumnsInput, _set: TagSetInput) {
    const tag = await this.tagRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, tag);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Tag (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTagByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Tag, tag, _set);

    // Custom logic
    return data.updateTagByPk;
  }

  async deleteTag(selectionSet: string[], where: TagBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const tags = await this.tagRepository.findByIds(where.id._in);

    await Promise.all(
      tags.map(async (tag) => {
        const canDelete = await this.checkPermsDelete(tag);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Tag (${tag.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateTag', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      tags.map(async (tag) => {
        await this.logsService.deleteLog(EntityName.Tag, tag.id);
      }),
    );

    // Custom logic
    return data.updateTag;
  }

  async deleteTagByPk(selectionSet: string[], id: string) {
    const tag = await this.tagRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(tag);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Tag (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateTagByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.Tag, id);
    // Custom logic
    return data.updateTagByPk;
  }

  async aggregateTag(
    selectionSet: string[],
    where: TagBoolExp,
    orderBy?: Array<TagOrderBy>,
    distinctOn?: Array<TagSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'tagAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.tagAggregate;
  }
}
