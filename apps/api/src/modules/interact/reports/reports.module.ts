import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import { NotificationsModule } from '@meta/shared/modules/notifications/notifications.module';
import { Content } from '@modules/create/contents/entities/content.entity';
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
  providers: [CaslAbilityFactory, ReportsService, ReportsResolver],
  exports: [ReportsService],
})
export class ReportsModule {}
