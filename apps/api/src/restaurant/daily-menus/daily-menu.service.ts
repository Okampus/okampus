import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { FoodType } from '../../shared/lib/types/enums/food-type.enum';
import type { PaginatedResult, PaginateDto } from '../../shared/modules/pagination';
import { Food } from '../food/food.entity';
import { DailyMenu } from './daily-menu.entity';
import type { CreateDailyMenuDto } from './dto/create-daily-menu.dto';
import type { UpdateDailyMenuDto } from './dto/update-daily-menu.dto';

@Injectable()
export class DailyMenusService {
  constructor(
    @InjectRepository(DailyMenu) private readonly dailyMenuRepository: BaseRepository<DailyMenu>,
    @InjectRepository(Food) private readonly foodRepository: BaseRepository<Food>,
  ) {}

  public async create(createDailyMenuDto: CreateDailyMenuDto): Promise<DailyMenu> {
    const menu = new DailyMenu(createDailyMenuDto);

    const food = await this.foodRepository.find({ id: { $in: createDailyMenuDto.food } });

    menu.starters.set(food.filter(f => f.type === FoodType.Starter));
    menu.dishes.set(food.filter(f => f.type === FoodType.Dish));
    menu.desserts.set(food.filter(f => f.type === FoodType.Dessert));

    try {
      await this.dailyMenuRepository.persistAndFlush(menu);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Daily menu for date already exists');
      throw error;
    }
    return menu;
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<DailyMenu>> {
    return await this.dailyMenuRepository.findWithPagination(
      paginationOptions,
      {},
      {
        populate: ['starters', 'dishes', 'desserts'],
        orderBy: { date: 'DESC' },
      },
    );
  }

  public async findOne(date: Date): Promise<DailyMenu> {
    return await this.dailyMenuRepository.findOneOrFail({ date }, { populate: ['starters', 'dishes', 'desserts'] });
  }

  public async update(id: number, updateDailyMenuDto: Partial<UpdateDailyMenuDto>): Promise<DailyMenu> {
    const menu = await this.dailyMenuRepository.findOneOrFail({ id });

    const { food: wantedFood, ...dto } = updateDailyMenuDto;

    wrap(menu).assign(dto);

    const food = await this.foodRepository.find({ id: { $in: wantedFood } });

    menu.starters.set(food.filter(f => f.type === FoodType.Starter));
    menu.dishes.set(food.filter(f => f.type === FoodType.Dish));
    menu.desserts.set(food.filter(f => f.type === FoodType.Dessert));

    await this.dailyMenuRepository.flush();
    return menu;
  }

  public async remove(id: number): Promise<void> {
    const menu = await this.dailyMenuRepository.findOneOrFail({ id });
    await this.dailyMenuRepository.removeAndFlush(menu);
  }
}
