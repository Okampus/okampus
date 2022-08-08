import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { SchoolGroup } from '../school-group/school-group.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Subject } from './subject.entity';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Subject, SchoolGroup]),
  ],
  controllers: [SubjectsController],
  providers: [CaslAbilityFactory, SubjectsService],
  exports: [SubjectsService],
})
export class SubjectsModule {}
