// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventAttendancesService } from './event-attendances.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  InsertOneEventAttendanceArgsType,
  UpdateByPkEventAttendanceArgsType,
  FindEventAttendanceArgsType,
  FindByPkEventAttendanceArgsType,
  AggregateEventAttendanceArgsType,
} from './event-attendances.types';

import type { GraphQLResolveInfo } from 'graphql';

@Resolver('EventAttendance')
export class EventAttendancesQueryResolver {
  constructor(private readonly eventAttendancesService: EventAttendancesService) {}

  @Query()
  async eventAttendance(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindEventAttendanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventAttendancesService.findEventAttendance(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }

  @Mutation()
  async insertEventAttendanceOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneEventAttendanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    const data = await this.eventAttendancesService.insertEventAttendanceOne(getSelectionSet(info), object, onConflict);
    return data.returning[0];
  }

  @Query()
  async eventAttendanceByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkEventAttendanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventAttendancesService.findEventAttendanceByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateEventAttendanceByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkEventAttendanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventAttendancesService.updateEventAttendanceByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteEventAttendanceByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkEventAttendanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventAttendancesService.deleteEventAttendanceByPk(getSelectionSet(info), pkColumns);
  }
}

@Resolver('EventAttendanceAggregate')
export class EventAttendancesQueryAggregateResolver {
  constructor(private readonly eventAttendancesService: EventAttendancesService) {}

  @Query()
  async eventAttendanceAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateEventAttendanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventAttendancesService.aggregateEventAttendance(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
