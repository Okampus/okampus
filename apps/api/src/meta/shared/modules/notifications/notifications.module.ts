// Import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
// Import { User } from '../../../users/user.entity';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    // MikroOrmModule.forFeature([User]),
  ],
  controllers: [],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
