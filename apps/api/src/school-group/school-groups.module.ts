import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { SchoolGroup } from './school-group.entity';
import { SchoolGroupsController } from './school-groups.controller';
import { SchoolGroupsService } from './school-groups.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([SchoolGroup]),
  ],
  controllers: [SchoolGroupsController],
  providers: [CaslAbilityFactory, SchoolGroupsService],
  exports: [SchoolGroupsService],
})
export class SchoolGroupsModule {}
