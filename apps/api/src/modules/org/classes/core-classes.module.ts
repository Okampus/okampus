import { InjectRepository, MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { classes } from '@common/configs/strings';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
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
    @InjectRepository(Class) private readonly classRepository: BaseRepository<Class>,
  ) {}

  public async onModuleInit(): Promise<void> {
    // TODO: Remove or hide in production
    for (const schoolClass of classes) {
      // eslint-disable-next-line no-await-in-loop
      const classEntity = await this.classRepository.count({ id: schoolClass.id });
      if (classEntity === 0) {
        // eslint-disable-next-line no-await-in-loop
        const parent = await this.classRepository.findOne({ id: schoolClass.parentId });
        const newClass = new Class({ ...schoolClass, parent });
        this.classRepository.persist(newClass);
      }
    }

    await this.classRepository.flush();
  }
}
