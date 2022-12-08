import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { Label } from './label.entity';
import { LabelsController } from './labels.controller';
import { LabelsService } from './labels.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Label]),
  ],
  controllers: [LabelsController],
  providers: [CaslAbilityFactory, LabelsService],
  exports: [LabelsService],
})
export class TeamLabelsModule {}
