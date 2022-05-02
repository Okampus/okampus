import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { client } from '../../shared/configs/typesense.config';
import RequireTypesense from '../../shared/lib/decorators/require-typesense.decorator';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { authorizeNotFound, SearchService } from '../../shared/modules/search/search.service';
import { Team } from './team.entity';

export interface IndexedTeam {
  name: string;
  description?: string;
  kind: string;
  id: string;
}

@Injectable()
export class TeamSearchService extends SearchService<Team, IndexedTeam> {
  private static readonly schema: CollectionCreateSchema = {
    name: 'teams',
    fields: [
      { name: 'name', type: 'string' },
      { name: 'kind', type: 'string' },
      { name: 'description', type: 'string', optional: true },
    ],
  };

  private readonly documents = client.collections<IndexedTeam>('teams').documents();

  constructor(
    @InjectRepository(Team) private readonly teamRepository: BaseRepository<Team>,
  ) { super(TeamSearchService.schema, 'teams'); }

  @RequireTypesense()
  public async init(): Promise<void> {
    const teams = await this.teamRepository.findAll();
    await super.init(teams, entity => this.toIndexedEntity(entity));
  }

  @RequireTypesense()
  public async add(team: Team): Promise<void> {
    await this.documents.create(this.toIndexedEntity(team));
  }

  @RequireTypesense()
  public async update(team: Team): Promise<void> {
    await this.documents.update(this.toIndexedEntity(team)).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async remove(teamId: string): Promise<void> {
    await this.documents.delete(teamId).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async search(queries: SearchParams): Promise<SearchResponse<IndexedTeam>> {
    return await this.documents.search(queries);
  }

  @RequireTypesense()
  public async searchAndPopulate(queries: SearchParams): Promise<SearchResponse<Team>> {
    const results = await this.documents.search(queries);

    if (results.hits?.length) {
      const teamIds = results.hits.map(hit => hit.document.id).map(Number);
      const teams = await this.teamRepository.find({ teamId: { $in: teamIds } });
      for (const hit of results.hits)
        // @ts-expect-error: This works, TypeScript... I know there is a mismatch between IndexedTeam.id and
        // Team.teamId. I know.
        hit.document = teams.find(team => team.teamId === hit.document.id)!;
    }
    // @ts-expect-error: Ditto.
    return results;
  }

  public toIndexedEntity(team: Team): IndexedTeam {
    return {
      name: team.name,
      description: team.description,
      kind: team.kind,
      id: team.teamId.toString(),
    };
  }
}
