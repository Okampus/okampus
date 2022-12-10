import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Food } from '@canteens/foods/food.entity';
import type { CreateMenuDto } from '@canteens/menus/dto/create-menu.dto';
import type { PaginatedNodes, PaginationOptions } from '@common/modules/pagination';
import { BaseRepository } from '@lib/orm/base.repository';
import { FoodType } from '@lib/types/enums/food-type.enum';
import type { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './menu.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: BaseRepository<Menu>,
    @InjectRepository(Food) private readonly foodRepository: BaseRepository<Food>,
  ) {}

  public async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const menu = new Menu(createMenuDto);

    const food = await this.foodRepository.find({ id: { $in: createMenuDto.food } });

    menu.starters.set(food.filter(f => f.type === FoodType.Starter));
    menu.dishes.set(food.filter(f => f.type === FoodType.Dish));
    menu.desserts.set(food.filter(f => f.type === FoodType.Dessert));

    try {
      await this.menuRepository.persistAndFlush(menu);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Daily menu for date already exists');
      throw error;
    }
    return menu;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedNodes<Menu>> {
    return await this.menuRepository.findWithPagination(
      paginationOptions,
      {},
      {
        populate: ['starters', 'dishes', 'desserts'],
        // FIXME: Enable orderBy with pagination
        // orderBy: { date: 'DESC' },
      },
    );
  }

  public async findOne(date: Date): Promise<Menu> {
    return await this.menuRepository.findOneOrFail({ date }, { populate: ['starters', 'dishes', 'desserts'] });
  }

  public async update(id: number, updateMenuDto: Partial<UpdateMenuDto>): Promise<Menu> {
    const menu = await this.menuRepository.findOneOrFail({ id });

    const { food: wantedFood, ...dto } = updateMenuDto;

    wrap(menu).assign(dto);

    const food = await this.foodRepository.find({ id: { $in: wantedFood } });

    menu.starters.set(food.filter(f => f.type === FoodType.Starter));
    menu.dishes.set(food.filter(f => f.type === FoodType.Dish));
    menu.desserts.set(food.filter(f => f.type === FoodType.Dessert));

    await this.menuRepository.flush();
    return menu;
  }

  public async remove(id: number): Promise<void> {
    const menu = await this.menuRepository.findOneOrFail({ id });
    await this.menuRepository.removeAndFlush(menu);
  }
}
