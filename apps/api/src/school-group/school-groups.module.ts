import { InjectRepository, MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { schoolGroups } from '../shared/configs/strings';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { SchoolGroup } from './school-group.entity';
import { SchoolGroupsController } from './school-groups.controller';
import { SchoolGroupsService } from './school-groups.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([SchoolGroup]),
  ],
  controllers: [SchoolGroupsController],
  providers: [CaslAbilityFactory, SchoolGroupsService],
  exports: [SchoolGroupsService],
})

export class SchoolGroupsModule implements OnModuleInit {
  constructor(
    @InjectRepository(SchoolGroup) private readonly schoolGroupRepository: BaseRepository<SchoolGroup>,
  ) {}

  public async onModuleInit(): Promise<void> {
    const everyone = await this.schoolGroupRepository.count({ id: 'everyone' });
    if (everyone === 0) {
      const group = new SchoolGroup({
        id: 'everyone',
        name: schoolGroups.everyoneName,
        description: schoolGroups.everyoneDescription,
      });
      await this.schoolGroupRepository.persistAndFlush(group);
    }
  }
}
