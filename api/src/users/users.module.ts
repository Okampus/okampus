import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { BadgeUnlock } from '../badges/badge-unlock.entity';
import { UserSearchService } from './user-search.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([User, BadgeUnlock]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserSearchService],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  constructor(
    private readonly userSearchService: UserSearchService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.userSearchService.init();
  }
}
