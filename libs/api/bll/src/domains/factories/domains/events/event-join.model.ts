// eslint-disable-next-line import/no-cycle
import { EventRoleModel, TenantEventModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';
import { JoinModel } from '../../index';
import { TeamActionModel } from '../../index';
import { Field, ObjectType } from '@nestjs/graphql';
import { RegistrationStatus } from '@okampus/shared/enums';
import type { IEventJoin, ITeamAction, ITenantEvent } from '@okampus/shared/dtos';

@ObjectType()
export class EventJoinModel extends JoinModel implements IEventJoin {
  @Field(() => TenantEventModel, { nullable: true })
  linkedEvent?: ITenantEvent;

  @Field(() => EventRoleModel, { nullable: true })
  eventRole?: EventRoleModel | null;

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
