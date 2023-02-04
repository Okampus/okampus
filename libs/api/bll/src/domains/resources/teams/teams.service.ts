import { CreateTeamCommand } from './commands/create-team/create-team.command';
import { DeleteTeamCommand } from './commands/delete-team/delete-team.command';
import { UpdateTeamCommand } from './commands/update-team/update-team.command';
import { GetTeamByIdQuery } from './queries/get-team-by-id/get-team-by-id.query';
import { GetTeamBySlugQuery } from './queries/get-team-by-slug/get-team-by-slug.query';
import { GetTeamsQuery } from './queries/get-teams/get-teams.query';
import { RequestContext } from '../../../shards/request-context/request-context';
import { CreateOrgDocumentCommand } from '../org-documents/commands/create-org-document/create-org-document.command';
import { Injectable } from '@nestjs/common';
import type { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { ActorImageUploadProps } from '@okampus/api/dal';
import type { CreateOrgDocumentDto, CreateTeamDto, UpdateTeamDto } from '@okampus/shared/dtos';
import type { MulterFileType, Snowflake } from '@okampus/shared/types';
import type { PaginationOptions } from '../../../shards/types/pagination-options.type';
import type { TeamModel, PaginatedTeamModel } from '../../factories/domains/teams/team.model';

const defaultTeamPopulate = ['actor', 'actor.images', 'actor.socials', 'actor.tags'];

@Injectable()
export class TeamsService extends RequestContext {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
    super();
  }

  findOneById(id: Snowflake): Promise<TeamModel> {
    const query = new GetTeamByIdQuery(id, this.tenant(), this.autoGqlPopulate(defaultTeamPopulate));
    return this.queryBus.execute(query);
  }

  findOneBySlug(slug: Snowflake): Promise<TeamModel> {
    const query = new GetTeamBySlugQuery(slug, this.tenant(), this.autoGqlPopulate(defaultTeamPopulate));
    return this.queryBus.execute(query);
  }

  find(paginationOptions: PaginationOptions): Promise<PaginatedTeamModel> {
    const query = new GetTeamsQuery(paginationOptions, this.tenant(), this.autoGqlPopulate(defaultTeamPopulate));
    return this.queryBus.execute(query);
  }

  create(createTeam: CreateTeamDto, actorImages?: ActorImageUploadProps): Promise<TeamModel> {
    const command = new CreateTeamCommand(createTeam, this.requester(), this.tenant(), actorImages);
    return this.commandBus.execute(command);
  }

  teamAddDocument(tenantId: Snowflake, createOrgDocument: CreateOrgDocumentDto, documentFile: MulterFileType) {
    const command = new CreateOrgDocumentCommand(tenantId, createOrgDocument, documentFile, this.tenant());
    return this.commandBus.execute(command);
  }

  update(updateTeam: UpdateTeamDto): Promise<TeamModel> {
    const command = new UpdateTeamCommand(updateTeam, this.tenant(), this.autoGqlPopulate(defaultTeamPopulate));
    return this.commandBus.execute(command);
  }

  delete(id: Snowflake) {
    const command = new DeleteTeamCommand(id, this.tenant());
    return this.commandBus.execute(command);
  }
}
