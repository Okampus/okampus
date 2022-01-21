import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import RequireTypesense from '../shared/lib/decorators/require-typesense.decorator';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { authorizeNotFound, SearchService } from '../shared/modules/search/search.service';
import { client } from '../typesense.config';
import { User } from './user.entity';

export interface IndexedUser {
  userId: string;
  roles: string[];
  id: string;
  createdAt: string;
}

@Injectable()
export class UserSearchService extends SearchService<User, IndexedUser> {
  private static readonly schema: CollectionCreateSchema = {
    name: 'users',
    fields: [
      { name: 'userId', type: 'string' },
      { name: 'roles', type: 'string[]' },
      { name: 'createdAt', type: 'string' },
    ],
  };

  private readonly documents = client.collections<IndexedUser>('users').documents();

  constructor(
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
  ) { super(UserSearchService.schema, 'users'); }

  @RequireTypesense()
  public async init(): Promise<void> {
    const users = await this.userRepository.findAll();
    await super.init(users, entity => this.toIndexedEntity(entity));
  }

  @RequireTypesense()
  public async add(user: User): Promise<void> {
    await this.documents.create(this.toIndexedEntity(user));
  }

  @RequireTypesense()
  public async update(user: User): Promise<void> {
    await this.documents.update(this.toIndexedEntity(user)).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async remove(userId: string): Promise<void> {
    await this.documents.delete(userId).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async search(queries: SearchParams<IndexedUser>): Promise<SearchResponse<IndexedUser>> {
    return await this.documents.search(queries);
  }

  @RequireTypesense()
  public async searchAndPopulate(queries: SearchParams<IndexedUser>): Promise<SearchResponse<User>> {
    const results = await this.documents.search(queries);

    if (results.hits?.length) {
      const userIds = results.hits.map(hit => hit.document.id);
      const users = await this.userRepository.find({ userId: { $in: userIds } });
      for (const hit of results.hits)
        // @ts-expect-error: This works, TypeScript... I know there is a mismatch between IndexedUser.id and
        // User.userId. I know.
        hit.document = users.find(user => user.userId === hit.document.id)!;
    }
    // @ts-expect-error: Ditto.
    return results;
  }

  public toIndexedEntity(user: User): IndexedUser {
    return {
      userId: user.userId,
      roles: user.roles,
      id: user.userId,
      createdAt: user.createdAt.toString(),
    };
  }
}
