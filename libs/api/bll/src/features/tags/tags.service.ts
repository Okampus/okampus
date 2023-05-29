import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
import { BadRequestException, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TagRepository } from '@okampus/api/dal';
import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class TagsService extends RequestContext {
  constructor(private readonly tagRepository: TagRepository, private readonly hasuraService: HasuraService) {
    super();
  }

  validateProps(props: ValueTypes['TagInsertInput']) {
    // Custom logic
    return true;
  }

  async insertTag(
    selectionSet: string[],
    objects: Array<ValueTypes['TagInsertInput']>,
    onConflict?: ValueTypes['TagOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await objects.every((object) => this.validateProps(object));
    if (!arePropsValid) throw new BadRequestException('Cannot insert Tag with invalid props.');

    const data = await this.hasuraService.insert('insertTag', selectionSet, objects, onConflict, insertOne);
    // Custom logic
    return data.insertTag;
  }

  async updateTag(selectionSet: string[], where: ValueTypes['TagBoolExp'], _set: ValueTypes['TagSetInput']) {
    const arePropsValid = this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Tag with invalid props.');

    const data = await this.hasuraService.update('updateTag', selectionSet, where, _set);
    // Custom logic
    return data.updateTag;
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
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Tag with invalid props.');

    const data = await this.hasuraService.updateByPk('updateTagByPk', selectionSet, pkColumns, _set);
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
