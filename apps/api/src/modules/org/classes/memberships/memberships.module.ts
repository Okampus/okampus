import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Class } from '@classes/class.entity';
import { CoreClassesModule } from '@classes/core-classes.module';
import { SchoolYear } from '@classes/school-year/school-year.entity';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { User } from '@uaa/users/user.entity';
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
