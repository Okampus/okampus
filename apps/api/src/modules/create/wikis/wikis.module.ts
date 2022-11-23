import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { Wiki } from './wiki.entity';
import { WikisController } from './wikis.controller';
import { WikisService } from './wikis.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Wiki]),
  ],
  controllers: [WikisController],
  providers: [CaslAbilityFactory, WikisService],
  exports: [WikisService],
})
export class WikisModule {}
