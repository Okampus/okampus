import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TeamLabelsModule } from '@modules/catalog/labels/labels.module';
import { TeamFinancesModule } from '@modules/org/teams/finances/finances.module';
import { TeamFormsModule } from '@modules/org/teams/forms/forms.module';
import { EventApprovalsModule } from '@modules/plan/approvals/approvals.module';
import { EventsModule } from '@modules/plan/events/events.module';
import { TeamICalModule } from '@modules/plan/ical/ical.module';
import { EventRegistrationsModule } from '@modules/plan/registrations/registrations.module';
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
