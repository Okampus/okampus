import { InjectRepository, MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { BadgeUnlock } from '../badges/badge-unlock.entity';
import { config } from '../config';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { Role } from '../shared/modules/authorization/types/role.enum';
import { Statistics } from '../statistics/statistics.entity';
import { StatisticsModule } from '../statistics/statistics.module';
import { UserSearchService } from './user-search.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import './user.subscriber';

@Module({
  imports: [
    MikroOrmModule.forFeature([User, Statistics, BadgeUnlock]),
    StatisticsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserSearchService],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    private readonly userSearchService: UserSearchService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.userSearchService.init();

    const admin = await this.userRepository.count({ userId: config.get('adminAccountUsername') });
    if (admin === 0) {
      const user = new User({
        username: config.get('adminAccountUsername'),
        firstname: config.get('adminAccountFirstName'),
        lastname: config.get('adminAccountLastName'),
        email: config.get('adminAccountUsername'),
        fullname: `${config.get('adminAccountFirstName')} ${config.get('adminAccountLastName')}`,
      });
      await user.setPassword(config.get('adminAccountPassword'));
      user.roles.push(Role.Moderator, Role.Admin);
      await this.userRepository.persistAndFlush(user);
      await this.userSearchService.add(user);
    }
  }
}
