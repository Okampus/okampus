import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@meta/shared/lib/orm/base.repository';
import type { PaginatedResult, PaginateDto } from '@meta/shared/modules/pagination';
import type { CreateFoodDto } from '@modules/org/canteens/foods/dto/create-food.dto';
import type { UpdateFoodDto } from './dto/update-food.dto';
import { Food } from './food.entity';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food) private readonly foodRepository: BaseRepository<Food>,
  ) {}

  public async create(createFoodDto: CreateFoodDto): Promise<Food> {
    const food = new Food(createFoodDto);
    await this.foodRepository.persistAndFlush(food);
    return food;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<Food>> {
    return await this.foodRepository.findWithPagination(paginationOptions, {}, { orderBy: { name: 'ASC' } });
  }

  public async findOne(id: number): Promise<Food> {
    return await this.foodRepository.findOneOrFail({ id });
  }

  public async update(id: number, updateFoodDto: UpdateFoodDto): Promise<Food> {
    const food = await this.foodRepository.findOneOrFail({ id });
    wrap(food).assign(updateFoodDto);
    await this.foodRepository.flush();
    return food;
  }

  public async remove(id: number): Promise<void> {
    const food = await this.foodRepository.findOneOrFail({ id });
    await this.foodRepository.removeAndFlush(food);
  }
}
