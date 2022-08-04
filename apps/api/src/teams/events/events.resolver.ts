import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { User } from '../../users/user.entity';
import { TeamEventRegistration } from '../event-registrations/team-event-registration.entity';
import { ListTeamEventsDto } from './dto/list-team-events.dto';
import { TeamEventsService } from './events.service';
import { TeamEvent } from './team-event.entity';

@Resolver(() => TeamEvent)
export class TeamEventsResolver {
  constructor(
    private readonly teamEventsService: TeamEventsService,
    @InjectRepository(TeamEventRegistration) private readonly teamEventRegistrationRepository:
      BaseRepository<TeamEventRegistration>,

  ) {}

  // TODO: Add permission checks
  @Query(() => TeamEvent)
  public async eventById(@CurrentUser() user: User, @Args('id', { type: () => Int }) id: number): Promise<TeamEvent> {
    return await this.teamEventsService.findOne(user, id);
  }

  @Query(() => [TeamEvent])
  public async events(@CurrentUser() user: User, @Args('filter') filter: ListTeamEventsDto): Promise<TeamEvent[]> {
    const paginatedEvents = await this.teamEventsService.findAll(user, filter);
    return paginatedEvents.items;
  }

  @ResolveField(() => TeamEventRegistration, { nullable: true })
  public async userRegistration(
    @CurrentUser() user: User,
    @Parent() event: TeamEvent,
  ): Promise<TeamEventRegistration | null> {
    return await this.teamEventRegistrationRepository.findOne({ user, event });
  }
}
