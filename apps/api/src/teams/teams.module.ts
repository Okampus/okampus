import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TeamEventRegistrationsModule } from './event-registrations/event-registrations.module';
import { TeamEventValidationsModule } from './event-validations/event-validations.module';
import { TeamEventsModule } from './events/events.module';
import { TeamFinancesModule } from './finances/finances.module';
import { TeamFormsModule } from './forms/forms.module';
import { TeamICalModule } from './ical/ical.module';
import { TeamMembersModule } from './members/members.module';
import { TeamMembershipsModule } from './memberships/memberships.module';
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
        // Endpoints to manage the team events
        { path: 'events', module: TeamEventsModule },
        // Endpoints to manage the team event registrations
        { path: 'event-registrations', module: TeamEventRegistrationsModule },
        // Endpoints to manage the team event registrations
        { path: 'event-validations', module: TeamEventValidationsModule },
        // Endpoints to manage forms
        { path: 'forms', module: TeamFormsModule },
        // Endpoints to manage finances
        { path: 'finances', module: TeamFinancesModule },
        // Endpoints to manage iCalendars
        { path: 'ical', module: TeamICalModule },
        // Endpoint to fetch data on a user's team memberships
        { path: 'memberships', module: TeamMembershipsModule },
        // Endpoint to manage team membership requests
        { path: 'requests', module: TeamMembershipRequestsModule },
      ],
    }]),
    CoreTeamsModule,
    TeamEventRegistrationsModule,
    TeamEventValidationsModule,
    TeamEventsModule,
    TeamFinancesModule,
    TeamFormsModule,
    TeamICalModule,
    TeamMembershipRequestsModule,
    TeamMembershipsModule,
    TeamMembersModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class TeamsModule {}
