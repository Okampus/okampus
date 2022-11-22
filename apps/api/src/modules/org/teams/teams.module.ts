import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TeamLabelsModule } from '@modules/assort/labels/labels.module';
import { TeamFinancesModule } from '@modules/manage/finances/finances.module';
import { TeamFormsModule } from '@modules/manage/forms/forms.module';
import { TeamEventRegistrationsModule } from '@modules/plan/event-registrations/event-registrations.module';
import { TeamEventValidationsModule } from '@modules/plan/event-validations/event-validations.module';
import { TeamEventsModule } from '@modules/plan/events/events.module';
import { TeamICalModule } from '@modules/plan/ical/ical.module';
import { CoreTeamsModule } from './core-teams.module';
import { TeamHistoriesModule } from './histories/histories.module';
import { TeamMembersModule } from './members/members.module';
import { TeamMembershipsModule } from './memberships/memberships.module';
import { TeamMembershipRequestsModule } from './requests/requests.module';

@Module({
  imports: [
    RouterModule.register([{
      path: 'teams',
      children: [
        // Endpoints to manage the core team concept
        { path: 'org', module: CoreTeamsModule },
        // Endpoints to manage team histories
        { path: 'histories', module: TeamHistoriesModule },
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
        // Endpoint to manage team labels
        { path: 'labels', module: TeamLabelsModule },
      ],
    }]),
    CoreTeamsModule,
    TeamEventRegistrationsModule,
    TeamEventValidationsModule,
    TeamEventsModule,
    TeamFinancesModule,
    TeamFormsModule,
    TeamICalModule,
    TeamLabelsModule,
    TeamMembershipRequestsModule,
    TeamMembershipsModule,
    TeamMembersModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class TeamsModule {}
