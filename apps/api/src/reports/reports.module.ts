import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { Content } from '../contents/entities/content.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { NotificationsModule } from '../shared/modules/notifications/notifications.module';
import { ReportSearchService } from './report-search.service';
import { Report } from './report.entity';
import { ReportsController } from './reports.controller';
import { ReportsResolver } from './reports.resolver';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Report, Content]),
    NotificationsModule,
  ],
  controllers: [ReportsController],
  providers: [CaslAbilityFactory, ReportsService, ReportSearchService, ReportsResolver],
  exports: [ReportsService],
})
export class ReportsModule implements OnModuleInit {
  constructor(
    private readonly reportSearchService: ReportSearchService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.reportSearchService.init();
  }
}
