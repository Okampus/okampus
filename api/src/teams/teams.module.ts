import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { MembersModule } from './members/members.module';
import { MembershipsModule } from './memberships/memberships.module';
import { RequestsModule } from './requests/requests.module';
import { CoreTeamsModule } from './teams/teams.module';

@Module({
  imports: [
    RouterModule.register([{
      path: 'teams',
      module: CoreTeamsModule,
      children: [
        { path: 'memberships', module: MembershipsModule },
        { path: ':teamId/members', module: MembersModule },
        { path: ':teamId/requests', module: RequestsModule },
      ],
    }]),
    CoreTeamsModule,
    MembershipsModule,
    MembersModule,
    RequestsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class TeamsModule {}
