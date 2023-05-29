// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadsService } from '../../uploads/uploads.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { NotificationsService } from '../../../global/notifications/notifications.service';
import { RequestContext } from '../../../shards/abstract/request-context';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventJoinRepository } from '@okampus/api/dal';
import { EVENT_MANAGE_TAB_ROUTE, EVENT_MANAGE_ROUTES } from '@okampus/shared/consts';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class EventJoinsService extends RequestContext {
  constructor(
    private readonly configService: ConfigService,
    private readonly eventJoinRepository: EventJoinRepository,
    private readonly hasuraService: HasuraService,
    private readonly uploadsService: UploadsService,
    private readonly notificationsService: NotificationsService
  ) {
    super();
  }

  async validateProps(props: ValueTypes['EventJoinInsertInput']) {
    // TODO: add expect relationships
    const joinerId = props.userInfo?.data?.id || props.joinerId;
    if (!joinerId) throw new BadRequestException('Cannot insert EventJoin without joinerId or userInfo.data.id.');

    const eventId = props.event?.data?.id || props.eventId;
    if (!eventId) throw new BadRequestException('Cannot insert EventJoin without eventId or event.data.id.');

    const alreadyExists = await this.eventJoinRepository.findOne({ joiner: { id: joinerId }, event: { id: eventId } });
    if (alreadyExists) throw new BadRequestException('Cannot insert EventJoin that already exists.');

    delete props.userInfo;
    delete props.event;

    props.joinerId = joinerId;
    props.eventId = eventId;

    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertEventJoin(
    selectionSet: string[],
    objects: Array<ValueTypes['EventJoinInsertInput']>,
    onConflict?: ValueTypes['EventJoinOnConflict'],
    insertOne?: boolean
  ) {
    // eslint-disable-next-line unicorn/no-await-expression-member
    const arePropsValid = (await Promise.all(objects.map((object) => this.validateProps(object)))).every(Boolean);
    if (!arePropsValid) throw new BadRequestException('Cannot insert EventJoin with invalid props.');

    const data = await this.hasuraService.insert('insertEventJoin', selectionSet, objects, onConflict, insertOne);
    const returning = data.insertEventJoin.returning;

    if (this.notificationsService.novu && returning?.length) {
      const eventJoins = await this.eventJoinRepository.findByIds(
        returning.map((object: { id: unknown }) => object.id) as string[],
        { populate: ['event', 'event.contentMaster', 'event.address', 'joiner'] }
      );

      for (const eventJoin of eventJoins) {
        const attendanceValidation = `${this.configService.get('network.frontendUrl')}/${EVENT_MANAGE_TAB_ROUTE({
          slug: eventJoin.event.contentMaster?.slug,
          tab: EVENT_MANAGE_ROUTES.CONFIRM_PRESENCE,
        })}/${eventJoin.id}`;

        const qrCode = await this.uploadsService.createQRUpload(attendanceValidation, eventJoin.id);
        eventJoin.qrCode = qrCode;

        await this.notificationsService.novu.trigger('eventjoin', {
          payload: {
            eventAddress: eventJoin.event.address?.name,
            eventName: eventJoin.event.contentMaster?.name,
            eventDate: eventJoin.event.start.toLocaleDateString('fr-FR'),
            firstName: eventJoin.joiner.firstName,
            qrCode: eventJoin.qrCode.url,
          },
          to: {
            subscriberId: this.requester().id,
            email: this.requester().actor.primaryEmail || undefined,
          },
        });
      }

      await this.eventJoinRepository.getEntityManager().flush();
    }

    // Custom logic
    return data.insertEventJoin;
  }

  async updateEventJoin(
    selectionSet: string[],
    where: ValueTypes['EventJoinBoolExp'],
    _set: ValueTypes['EventJoinSetInput']
  ) {
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update EventJoin with invalid props.');

    const data = await this.hasuraService.update('updateEventJoin', selectionSet, where, _set);
    // Custom logic
    return data.updateEventJoin;
  }

  async findEventJoin(
    selectionSet: string[],
    where: ValueTypes['EventJoinBoolExp'],
    orderBy?: Array<ValueTypes['EventJoinOrderBy']>,
    distinctOn?: Array<ValueTypes['EventJoinSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('eventJoin', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.eventJoin;
  }

  async findEventJoinByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('eventJoinByPk', selectionSet, { id });
    return data.eventJoinByPk;
  }

  async updateEventJoinByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['EventJoinPkColumnsInput'],
    _set: ValueTypes['EventJoinSetInput']
  ) {
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update EventJoin with invalid props.');

    const data = await this.hasuraService.updateByPk('updateEventJoinByPk', selectionSet, pkColumns, _set);
    // Custom logic
    return data.updateEventJoinByPk;
  }

  async aggregateEventJoin(
    selectionSet: string[],
    where: ValueTypes['EventJoinBoolExp'],
    orderBy?: Array<ValueTypes['EventJoinOrderBy']>,
    distinctOn?: Array<ValueTypes['EventJoinSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'eventJoinAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.eventJoinAggregate;
  }
}
