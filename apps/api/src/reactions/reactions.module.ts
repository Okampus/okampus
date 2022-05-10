import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Content } from '../contents/entities/content.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Reaction } from './reaction.entity';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Content, Reaction]),
  ],
  controllers: [ReactionsController],
  providers: [CaslAbilityFactory, ReactionsService],
  exports: [],
})
export class ReactionsModule {}
