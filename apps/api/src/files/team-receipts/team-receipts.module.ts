import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { NotificationsModule } from '../../shared/modules/notifications/notifications.module';
import { Team } from '../../teams/teams/team.entity';
import { FileUploadsModule } from '../file-uploads/file-uploads.module';
import { TeamReceiptsController } from './team-receipts.controller';
import { TeamReceipt } from './team-receipts.entity';
import { TeamReceiptsService } from './team-receipts.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamReceipt, Team]),
    FileUploadsModule,
    NotificationsModule,
  ],
  controllers: [TeamReceiptsController],
  providers: [CaslAbilityFactory, TeamReceiptsService],
  exports: [TeamReceiptsService],
})
export class TeamReceiptsModule {}
