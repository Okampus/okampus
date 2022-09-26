import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { NotificationsModule } from '../../shared/modules/notifications/notifications.module';
import { Team } from '../../teams/teams/team.entity';
import { User } from '../../users/user.entity';
import { FileUploadsModule } from '../file-uploads/file-uploads.module';
import { TeamReceipt } from './team-receipt.entity';
import { TeamReceiptsController } from './team-receipts.controller';
import { TeamReceiptsResolver } from './team-receipts.resolver';
import { TeamReceiptsService } from './team-receipts.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([TeamReceipt, Team, User]),
    FileUploadsModule,
    NotificationsModule,
  ],
  controllers: [TeamReceiptsController],
  providers: [CaslAbilityFactory, TeamReceiptsService, TeamReceiptsResolver],
  exports: [TeamReceiptsService],
})
export class TeamReceiptsModule {}
