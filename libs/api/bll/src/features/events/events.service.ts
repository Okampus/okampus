import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
import { BadRequestException, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventRepository } from '@okampus/api/dal';
import { ContentMasterType } from '@okampus/shared/enums';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class EventsService extends RequestContext {
  constructor(private readonly eventRepository: EventRepository, private readonly hasuraService: HasuraService) {
    super();
  }

  validateProps(props: ValueTypes['EventInsertInput']) {
    return true;
  }

  async insertEvent(
    selectionSet: string[],
    objects: Array<ValueTypes['EventInsertInput']>,
    onConflict?: ValueTypes['EventOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await objects.every((object) => {
      object = this.hasuraService.applyData(object, { price: 0 });
      this.hasuraService.expectData(object, 'contentMaster', {}, { type: ContentMasterType.Event });
      this.hasuraService.expectData(object, 'contentMaster.data.content', { text: '', isAnonymous: false });

      this.validateProps(object);
    });
    if (!arePropsValid) throw new BadRequestException('Cannot insert Event with invalid props.');

    const data = await this.hasuraService.insert('insertEvent', selectionSet, objects, onConflict, insertOne);
    // Custom logic
    return data.insertEvent;
  }

  async updateEvent(selectionSet: string[], where: ValueTypes['EventBoolExp'], _set: ValueTypes['EventSetInput']) {
    const arePropsValid = this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Event with invalid props.');

    const data = await this.hasuraService.update('updateEvent', selectionSet, where, _set);
    // Custom logic
    return data.updateEvent;
  }

  async findEvent(
    selectionSet: string[],
    where: ValueTypes['EventBoolExp'],
    orderBy?: Array<ValueTypes['EventOrderBy']>,
    distinctOn?: Array<ValueTypes['EventSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('event', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.event;
  }

  async findEventByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('eventByPk', selectionSet, { id });
    return data.eventByPk;
  }

  async updateEventByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['EventPkColumnsInput'],
    _set: ValueTypes['EventSetInput']
  ) {
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Event with invalid props.');

    const data = await this.hasuraService.updateByPk('updateEventByPk', selectionSet, pkColumns, _set);
    // Custom logic
    return data.updateEventByPk;
  }

  async aggregateEvent(
    selectionSet: string[],
    where: ValueTypes['EventBoolExp'],
    orderBy?: Array<ValueTypes['EventOrderBy']>,
    distinctOn?: Array<ValueTypes['EventSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'eventAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.eventAggregate;
  }
}
