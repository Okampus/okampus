import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TeamLabelsModule } from '@catalog/labels/labels.module';
import { EventApprovalsModule } from '@plan/approvals/approvals.module';
import { EventsModule } from '@plan/events/events.module';
import { TeamICalModule } from '@plan/ical/ical.module';
import { EventRegistrationsModule } from '@plan/registrations/registrations.module';
import { TeamFinancesModule } from '@teams/finances/finances.module';
import { TeamFormsModule } from '@teams/forms/forms.module';
import { CoreTeamsModule } from './core-teams.module';
import { TeamHistoriesModule } from './histories/histories.module';
import { TeamMembersModule } from './members/members.module';
import { TeamMembershipsModule } from './memberships/memberships.module';
import { TeamMembershipRequestsModule } from './requests/requests.module';
import { TeamImagesModule } from './team-images/team-images.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'teams',
        children: [
          { path: 'org', module: CoreTeamsModule },
          { path: 'histories', module: TeamHistoriesModule },
          { path: 'images', module: TeamImagesModule },
          { path: 'members', module: TeamMembersModule },
          { path: 'forms', module: TeamFormsModule },
          { path: 'finances', module: TeamFinancesModule },
          { path: 'ical', module: TeamICalModule },
          { path: 'memberships', module: TeamMembershipsModule },
          { path: 'requests', module: TeamMembershipRequestsModule },
          { path: 'labels', module: TeamLabelsModule },
          // TODO: move events to their own module
          { path: 'events', module: EventsModule },
          { path: 'event-registrations', module: EventRegistrationsModule },
          { path: 'event-approvals', module: EventApprovalsModule },
        ],
      },
    ]),
    CoreTeamsModule,
    EventRegistrationsModule,
    EventApprovalsModule,
    EventsModule,
    TeamFinancesModule,
    TeamFormsModule,
    TeamImagesModule,
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
