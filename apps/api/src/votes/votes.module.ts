import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Content } from '../contents/entities/content.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Vote } from './vote.entity';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Content, Vote]),
  ],
  controllers: [VotesController],
  providers: [CaslAbilityFactory, VotesService],
  exports: [],
})
export class VotesModule {}
