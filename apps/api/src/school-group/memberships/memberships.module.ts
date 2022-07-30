import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { User } from '../../users/user.entity';
import { SchoolGroup } from '../school-group.entity';
import { SchoolGroupsModule } from '../school-groups.module';
import { SchoolYear } from '../school-year/school-year.entity';
import { SchoolGroupMembershipsController } from './memberships.controller';
import { SchoolGroupMembershipsResolver } from './memberships.resolver';
import { SchoolGroupMembershipsService } from './memberships.service';
import { SchoolGroupMembership } from './school-group-membership.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([SchoolGroup, SchoolGroupMembership, SchoolYear, User]),
    SchoolGroupsModule,
  ],
  controllers: [SchoolGroupMembershipsController],
  providers: [CaslAbilityFactory, SchoolGroupMembershipsService, SchoolGroupMembershipsResolver],
  exports: [SchoolGroupMembershipsService],
})
export class SchoolGroupMembershipsModule {}
