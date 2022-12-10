import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Class } from '@classes/class.entity';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { Subject } from './subject.entity';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Subject, Class]),
  ],
  controllers: [SubjectsController],
  providers: [CaslAbilityFactory, SubjectsService],
  exports: [SubjectsService],
})
export class SubjectsModule {}
