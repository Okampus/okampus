import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { Settings } from './settings.entity';
import { SettingsResolver } from './settings.resolver';
import { SettingsService } from './settings.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Settings]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService, SettingsResolver],
  exports: [SettingsService],
})
export class SettingsModule {}
