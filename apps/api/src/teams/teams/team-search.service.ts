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
  shortDescription: string | null;
  kind: string;
  id: string;
  avatar: string | null;
}

@Injectable()
export class TeamSearchService extends SearchService<Team, IndexedTeam> {
  private static readonly schema: CollectionCreateSchema = {
    name: 'teams',
    fields: [
      { name: 'name', type: 'string' },
      { name: 'kind', type: 'string' },
      { name: 'shortDescription', type: 'string', optional: true },
      { name: 'avatar', type: 'string', optional: true },
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
  public async remove(id: string): Promise<void> {
    await this.documents.delete(id).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async search(queries: SearchParams): Promise<SearchResponse<IndexedTeam>> {
    return await this.documents.search(queries);
  }

  @RequireTypesense()
  public async searchAndPopulate(queries: SearchParams): Promise<SearchResponse<Team>> {
    const results = await this.documents.search(queries);

    if (results.hits?.length) {
      const ids = results.hits.map(hit => Number(hit.document.id));
      const teams = await this.teamRepository.find({ id: { $in: ids } });
      for (const hit of results.hits)
        // @ts-expect-error: hit.document is an IndexedTeam but we are overwriting it with a Team
        hit.document = teams.find(team => team.id.toString() === hit.document.id)!;
    }
    // @ts-expect-error: this is now a SearchResponse<Team>
    return results;
  }

  public toIndexedEntity(team: Team): IndexedTeam {
    return {
      name: team.name,
      shortDescription: team.shortDescription,
      kind: team.kind,
      avatar: team.avatar,
      id: team.id.toString(),
    };
  }
}
