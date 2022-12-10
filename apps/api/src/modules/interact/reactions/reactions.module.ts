import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { Content } from '@create/contents/entities/content.entity';
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
