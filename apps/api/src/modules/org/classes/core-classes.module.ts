import { InjectRepository, MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { schoolGroups } from '@meta/shared/configs/strings';
import { BaseRepository } from '@meta/shared/lib/orm/base.repository';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import { ClassesController } from './class.controller';
import { Class } from './class.entity';
import { ClassesResolver } from './class.resolver';
import { ClassesService } from './class.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Class]),
  ],
  controllers: [ClassesController],
  providers: [CaslAbilityFactory, ClassesService, ClassesResolver],
  exports: [ClassesService],
})

export class CoreClassesModule implements OnModuleInit {
  constructor(
    @InjectRepository(Class) private readonly schoolGroupRepository: BaseRepository<Class>,
  ) {}

  public async onModuleInit(): Promise<void> {
    // TODO: Remove or hide in production
    for (const schoolGroup of schoolGroups) {
      // eslint-disable-next-line no-await-in-loop
      const schoolGroupEntity = await this.schoolGroupRepository.count({ id: schoolGroup.id });
      if (schoolGroupEntity === 0) {
        // eslint-disable-next-line no-await-in-loop
        const parent = await this.schoolGroupRepository.findOne({ id: schoolGroup.parentId });
        const newClass = new Class({ ...schoolGroup, parent });
        this.schoolGroupRepository.persist(newClass);
      }
    }

    await this.schoolGroupRepository.flush();
  }
}
