import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { SubjectSearchService } from './subject-search.service';
import { Subject } from './subject.entity';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Subject]),
  ],
  controllers: [SubjectsController],
  providers: [CaslAbilityFactory, SubjectsService, SubjectSearchService],
  exports: [SubjectsService],
})
export class SubjectsModule implements OnModuleInit {
  constructor(
    private readonly subjectSearchService: SubjectSearchService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.subjectSearchService.init();
  }
}
