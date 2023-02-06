import { ProjectsResolver } from './projects.resolver';
import { GetProjectByIdHandler } from './queries/get-project-by-id/get-project-by-id.handler';
import { GetProjectsByTeamHandler } from './queries/get-projects-by-team/get-projects-by-team.handler';
import { GetProjectsHandler } from './queries/get-projects/get-projects.handler';
import { UpdateProjectHandler } from './commands/update-project/update-project.handler';
import { ProjectsService } from './projects.service';
import { CreateProjectHandler } from './commands/create-project/create-project.handler';
import { DeleteFinanceHandler } from '../finances/commands/delete-finance/delete-finance.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

const commandHandlers = [CreateProjectHandler, UpdateProjectHandler, DeleteFinanceHandler];
const queryHandlers = [GetProjectByIdHandler, GetProjectsByTeamHandler, GetProjectsHandler];

@Module({
  imports: [CqrsModule],
  providers: [ProjectsResolver, ProjectsService, ...commandHandlers, ...queryHandlers],
  exports: [ProjectsService],
})
export class ProjectsModule {}
