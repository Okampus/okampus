import { GetEventByIdQuery } from './get-event-by-id.query';
import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler} from '@nestjs/cqrs';
import type { TenantEventFactory } from '../../../../factories/domains/events/event.factory';
import type { TenantEventModel } from '../../../../factories/domains/events/event.model';

@QueryHandler(GetEventByIdQuery)
export class GetEventByIdHandler implements IQueryHandler<GetEventByIdQuery> {
  constructor(private readonly eventFactory: TenantEventFactory) {}

  async execute(query: GetEventByIdQuery): Promise<TenantEventModel> {
    return await this.eventFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
