import { InjectRepository, MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { BadgeUnlock } from '../badges/entities/badge-unlock.entity';
import { FileUploadsModule } from '../files/file-uploads/file-uploads.module';
import { ProfileImage } from '../files/profile-images/profile-image.entity';
import { ProfileImagesModule } from '../files/profile-images/profile-images.module';
import { config } from '../shared/configs/config';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { Role } from '../shared/modules/authorization/types/role.enum';
import { SchoolRole } from '../shared/modules/authorization/types/school-role.enum';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Statistics } from '../statistics/statistics.entity';
import { StatisticsModule } from '../statistics/statistics.module';
import { UserSearchService } from './user-search.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import './user.subscriber';

@Module({
  imports: [
    MikroOrmModule.forFeature([ProfileImage, User, Statistics, BadgeUnlock]),
    StatisticsModule,
    ProfileImagesModule,
    FileUploadsModule,
  ],
  controllers: [UsersController],
  providers: [CaslAbilityFactory, UsersService, UserSearchService],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    private readonly userSearchService: UserSearchService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.userSearchService.init();

    const admin = await this.userRepository.count({ userId: config.get('adminAccount.username') });
    if (admin === 0) {
      const user = new User({
        userId: config.get('adminAccount.username'),
        firstname: config.get('adminAccount.firstName'),
        lastname: config.get('adminAccount.lastName'),
        email: config.get('adminAccount.username'),
        schoolRole: SchoolRole.Admin,
      });
      await user.setPassword(config.get('adminAccount.password'));
      user.roles.push(Role.Moderator, Role.Admin);
      await this.userRepository.persistAndFlush(user);
      await this.userSearchService.add(user);
    }
  }
}
