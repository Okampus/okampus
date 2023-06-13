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

  async checkPermsCreate(props: ValueTypes['TagInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const tag = await this.tagRepository.findOneOrFail(id);
    if (tag.deletedAt) throw new NotFoundException(`Tag was deleted on ${tag.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['TagSetInput'], tag: Tag) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (tag.deletedAt) throw new NotFoundException(`Tag was deleted on ${tag.deletedAt}.`);
    if (tag.hiddenAt) throw new NotFoundException('Tag must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return tag.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['TagSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['TagInsertInput']) {
    // Custom logic
    return true;
  }

  async insertTag(
    selectionSet: string[],
    objects: Array<ValueTypes['TagInsertInput']>,
    onConflict?: ValueTypes['TagOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await Promise.all(
      objects.map(async (props) => {
        const canCreate = await this.checkPermsCreate(props);
        if (!canCreate) throw new ForbiddenException('You are not allowed to insert Tag.');

        const arePropsValid = await this.checkPropsConstraints(props);
        if (!arePropsValid) throw new BadRequestException('Props are not valid.');

        const areRelationshipsValid = await this.checkCreateRelationships(props);
        if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

        return canCreate && arePropsValid && areRelationshipsValid;
      })
    ).then((results) => results.every(Boolean));

    if (!arePropsValid) throw new ForbiddenException('You are not allowed to insert Tag.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insert('insertTag', selectionSet, objects, onConflict, insertOne);

    for (const inserted of data.insertTag.returning) {
      const tag = await this.tagRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Tag, tag);
    }

    // Custom logic
    return data.insertTag;
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

  async updateTagByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['TagPkColumnsInput'],
    _set: ValueTypes['TagSetInput']
  ) {
    const tag = await this.tagRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, tag);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Tag (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateTagByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Tag, tag, _set);

    // Custom logic
    return data.updateTagByPk;
  }

  async deleteTagByPk(selectionSet: string[], pkColumns: ValueTypes['TagPkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
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
