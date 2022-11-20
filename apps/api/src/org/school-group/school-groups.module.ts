import { InjectRepository, MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { schoolGroups } from '../../shared/configs/strings';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { SchoolGroup } from './school-group.entity';
import { SchoolGroupsController } from './school-groups.controller';
import { SchoolGroupsResolver } from './school-groups.resolver';
import { SchoolGroupsService } from './school-groups.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([SchoolGroup]),
  ],
  controllers: [SchoolGroupsController],
  providers: [CaslAbilityFactory, SchoolGroupsService, SchoolGroupsResolver],
  exports: [SchoolGroupsService],
})

export class SchoolGroupsModule implements OnModuleInit {
  constructor(
    @InjectRepository(SchoolGroup) private readonly schoolGroupRepository: BaseRepository<SchoolGroup>,
  ) {}

  public async onModuleInit(): Promise<void> {
    // TODO: Remove or hide in production
    for (const schoolGroup of schoolGroups) {
      // eslint-disable-next-line no-await-in-loop
      const schoolGroupEntity = await this.schoolGroupRepository.count({ id: schoolGroup.id });
      if (schoolGroupEntity === 0) {
        // eslint-disable-next-line no-await-in-loop
        const parent = await this.schoolGroupRepository.findOne({ id: schoolGroup.parentId });
        const newSchoolGroup = new SchoolGroup({ ...schoolGroup, parent });
        this.schoolGroupRepository.persist(newSchoolGroup);
      }
    }

    await this.schoolGroupRepository.flush();
  }
}
