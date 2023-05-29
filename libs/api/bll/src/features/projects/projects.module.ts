import { ProjectsService } from './projects.service';
import { ProjectsMutationResolver, ProjectsQueryAggregateResolver, ProjectsQueryResolver } from './projects.resolver';
import { HasuraModule } from '../../global/graphql/hasura.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Project } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, MikroOrmModule.forFeature([Project])],
  providers: [ProjectsMutationResolver, ProjectsQueryResolver, ProjectsQueryAggregateResolver, ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
