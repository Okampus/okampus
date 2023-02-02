import { Field, ObjectType } from '@nestjs/graphql';
import { IEventJoin, ITeamAction, ITenantEvent } from '@okampus/shared/dtos';
import { RegistrationStatus } from '@okampus/shared/enums';
import { Paginated } from '../../../../shards/types/paginated.type';
import { JoinModel } from '../../abstract/join.model';
// eslint-disable-next-line import/no-cycle
import { TeamActionModel } from '../teams/team-action.model';
// eslint-disable-next-line import/no-cycle
import { TenantEventModel } from './event.model';

@ObjectType()
export class EventJoinModel extends JoinModel implements IEventJoin {
  @Field(() => TenantEventModel, { nullable: true })
  event?: ITenantEvent;

  @Field(() => Boolean, { nullable: true })
  participated!: boolean | null;

  @Field(() => TeamActionModel, { nullable: true })
  teamAction?: ITeamAction | null;

  @Field(() => RegistrationStatus)
  presenceStatus!: RegistrationStatus;

  constructor(eventJoin: IEventJoin) {
    super(eventJoin);
    this.assign(eventJoin);
  }
}

@ObjectType()
export class PaginatedEventJoinModel extends Paginated(EventJoinModel) {}
