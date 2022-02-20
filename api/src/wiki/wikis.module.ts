import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { WikiPage } from './wiki-page.entity';
import { WikisController } from './wikis.controller';
import { WikisService } from './wikis.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([WikiPage]),
  ],
  controllers: [WikisController],
  providers: [CaslAbilityFactory, WikisService],
  exports: [WikisService],
})
export class WikisModule {}
