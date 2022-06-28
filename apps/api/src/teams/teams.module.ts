import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TeamEventRegistrationsModule } from './event-registrations/event-registrations.module';
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
        // Endpoints to manage the core team concept
        { path: 'teams', module: CoreTeamsModule },
        // Endpoint to manage team members
        { path: 'members', module: TeamMembersModule },
        // Endpoint to fetch team metrics
        { path: 'metrics', module: TeamMetricsModule },
        // Endpoints to manage the team events
        { path: 'events', module: TeamEventsModule },
        // Endpoints to manage the team event registrations
        { path: 'event-registrations', module: TeamEventRegistrationsModule },
        // Endpoint to fetch data on a user's team memberships
        { path: 'memberships', module: TeamMembershipsModule },
        // Endpoint to manage team membership requests
        { path: 'requests', module: TeamMembershipRequestsModule },
      ],
    }]),
    CoreTeamsModule,
    TeamEventRegistrationsModule,
    TeamEventsModule,
    TeamMembershipRequestsModule,
    TeamMembershipsModule,
    TeamMembersModule,
    TeamMetricsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class TeamsModule {}
