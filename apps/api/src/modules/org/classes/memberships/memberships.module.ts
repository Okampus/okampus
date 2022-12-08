import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { User } from '@modules/uaa/users/user.entity';
import { Class } from '../class.entity';
import { CoreClassesModule } from '../core-classes.module';
import { SchoolYear } from '../school-year/school-year.entity';
import { ClassMembership } from './class-membership.entity';
import { ClassMembershipsController } from './memberships.controller';
import { ClassMembershipsResolver } from './memberships.resolver';
import { ClassMembershipsService } from './memberships.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Class, ClassMembership, SchoolYear, User]),
    CoreClassesModule,
  ],
  controllers: [ClassMembershipsController],
  providers: [CaslAbilityFactory, ClassMembershipsService, ClassMembershipsResolver],
  exports: [ClassMembershipsService],
})
export class ClassMembershipsModule {}
