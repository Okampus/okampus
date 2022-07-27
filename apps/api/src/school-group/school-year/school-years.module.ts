import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
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
export class SchoolYearsModule {}
