import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TenantEventFactory } from '../../../../factories/events/event.factory';
import { TenantEventModel } from '../../../../factories/events/event.model';
import { GetEventByIdQuery } from './get-event-by-id.query';

@QueryHandler(GetEventByIdQuery)
export class GetEventByIdHandler implements IQueryHandler<GetEventByIdQuery> {
  constructor(private readonly eventFactory: TenantEventFactory) {}

  async execute(query: GetEventByIdQuery): Promise<TenantEventModel> {
    return await this.eventFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
