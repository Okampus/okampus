import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TeamEventsModule } from './events/events.module';
import { TeamMembersModule } from './members/members.module';
import { TeamMembershipsModule } from './memberships/memberships.module';
import { TeamMetricsModule } from './metrics/metrics.module';
import { TeamMembershipRequestsModule } from './requests/requests.module';
import { CoreTeamsModule } from './teams/teams.module';

@Module({
  imports: [
    RouterModule.register([{
      path: 'teams',
      children: [
        { path: 'teams', module: CoreTeamsModule },
        { path: 'events', module: TeamEventsModule },
        { path: 'memberships', module: TeamMembershipsModule },
        { path: 'members', module: TeamMembersModule },
        { path: 'metrics', module: TeamMetricsModule },
        { path: 'requests', module: TeamMembershipRequestsModule },
      ],
    }]),
    CoreTeamsModule,
    TeamEventsModule,
    TeamMembershipsModule,
    TeamMembersModule,
    TeamMetricsModule,
    TeamMembershipRequestsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class TeamsModule {}
