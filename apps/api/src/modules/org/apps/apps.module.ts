import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { App } from './app.entity';
import { AppsController } from './apps.controller';
import { AppsResolver } from './apps.resolver';
import { AppsService } from './apps.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([App]),
  ],
  controllers: [AppsController],
  providers: [CaslAbilityFactory, AppsService, AppsResolver],
  exports: [AppsService],
})
export class AppsModule {}
