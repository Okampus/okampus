import { ProjectsService } from './projects.service';
import { ProjectsQueryAggregateResolver, ProjectsQueryResolver } from './projects.resolver';
import { HasuraModule } from '../../global/graphql/hasura.module';
import { LogsModule } from '../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Project } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Project])],
  providers: [ProjectsQueryResolver, ProjectsQueryAggregateResolver, ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
