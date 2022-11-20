import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { DailyInfoController } from './daily-info.controller';
import { DailyInfo } from './daily-info.entity';
import { DailyInfoService } from './daily-info.service';

@Module({
  imports: [MikroOrmModule.forFeature([DailyInfo])],
  controllers: [DailyInfoController],
  providers: [DailyInfoService],
  exports: [DailyInfoService],
})
export class DailyInfoModule {}
