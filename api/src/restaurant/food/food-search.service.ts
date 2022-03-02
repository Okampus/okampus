import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { SearchParams } from 'typesense/lib/Typesense/Documents';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { client } from '../../shared/configs/typesense.config';
import RequireTypesense from '../../shared/lib/decorators/require-typesense.decorator';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import { authorizeNotFound, SearchService } from '../../shared/modules/search/search.service';
import { Food } from './food.entity';

export interface IndexedFood {
  name: string;
  id: string;
}

@Injectable()
export class FoodSearchService extends SearchService<Food, IndexedFood> {
  private static readonly schema: CollectionCreateSchema = {
    name: 'foods',
    fields: [
      { name: 'name', type: 'string' },
    ],
  };

  private readonly documents = client.collections<IndexedFood>('foods').documents();

  constructor(
    @InjectRepository(Food) private readonly foodRepository: BaseRepository<Food>,
  ) { super(FoodSearchService.schema, 'foods'); }

  @RequireTypesense()
  public async init(): Promise<void> {
    const foods = await this.foodRepository.findAll();
    await super.init(foods, entity => this.toIndexedEntity(entity));
  }

  @RequireTypesense()
  public async add(food: Food): Promise<void> {
    await this.documents.create(this.toIndexedEntity(food));
  }

  @RequireTypesense()
  public async update(food: Food): Promise<void> {
    await this.documents.update(this.toIndexedEntity(food)).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async remove(foodId: string): Promise<void> {
    await this.documents.delete(foodId).catch(authorizeNotFound);
  }

  @RequireTypesense()
  public async search(queries: SearchParams): Promise<SearchResponse<IndexedFood>> {
    return await this.documents.search(queries);
  }

  @RequireTypesense()
  public async searchAndPopulate(queries: SearchParams): Promise<SearchResponse<Food>> {
    const results = await this.documents.search(queries);

    if (results.hits?.length) {
      const foodIds = results.hits.map(hit => hit.document.id).map(Number);
      const foods = await this.foodRepository.find({ foodId: { $in: foodIds } });
      for (const hit of results.hits)
        // @ts-expect-error: This works, TypeScript... I know there is a mismatch between IndexedFood.id and
        // Food.foodId. I know.
        hit.document = foods.find(food => food.foodId === hit.document.id)!;
    }
    // @ts-expect-error: Ditto.
    return results;
  }

  public toIndexedEntity(food: Food): IndexedFood {
    return {
      name: food.name,
      id: food.foodId.toString(),
    };
  }
}
