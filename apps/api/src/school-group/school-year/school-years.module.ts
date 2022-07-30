import { InjectRepository, MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { SchoolYear } from './school-year.entity';
import { SchoolYearsController } from './school-years.controller';
import { SchoolYearsResolver } from './school-years.resolver';
import { SchoolYearsService } from './school-years.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([SchoolYear]),
  ],
  controllers: [SchoolYearsController],
  providers: [SchoolYearsResolver, SchoolYearsService, CaslAbilityFactory],
  exports: [SchoolYearsService],
})
export class SchoolYearsModule implements OnModuleInit {
  constructor(
    @InjectRepository(SchoolYear) private readonly schoolYearRepository: BaseRepository<SchoolYear>,
  ) {}

  public async onModuleInit(): Promise<void> {
    const schoolYear = await this.schoolYearRepository.count({ id: 'school-year-test' });
    if (schoolYear === 0) {
      const schoolYearEntity = new SchoolYear({
        id: 'school-year-test',
        name: '2020-2021',
      });
      await this.schoolYearRepository.persistAndFlush(schoolYearEntity);
    }
  }
}
