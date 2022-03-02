import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import type { PaginateDto } from '../../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import { Food } from '../food/food.entity';
import { DailyMenu } from './daily-menu.entity';
import type { CreateDailyMenuDto } from './dto/create-daily-menu.dto';
import type { UpdateDailyMenuDto } from './dto/update-daily-menu.dto';

type NormalizedDate<T> = Omit<T, 'date'> & { date: Date };

@Injectable()
export class DailyMenusService {
  constructor(
    @InjectRepository(DailyMenu) private readonly dailyMenuRepository: BaseRepository<DailyMenu>,
    @InjectRepository(Food) private readonly foodRepository: BaseRepository<Food>,
  ) {}

  public async create(createDailyMenuDto: NormalizedDate<CreateDailyMenuDto>): Promise<DailyMenu> {
    const menu = new DailyMenu(createDailyMenuDto);
    const starters = await this.foodRepository.find({ foodId: { $in: createDailyMenuDto.starters } });
    const dishes = await this.foodRepository.find({ foodId: { $in: createDailyMenuDto.dishes } });
    const desserts = await this.foodRepository.find({ foodId: { $in: createDailyMenuDto.desserts } });

    menu.starters.set(starters);
    menu.dishes.set(dishes);
    menu.desserts.set(desserts);

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

  public async update(date: Date, updateDailyMenuDto: Partial<NormalizedDate<UpdateDailyMenuDto>>): Promise<DailyMenu> {
    const menu = await this.dailyMenuRepository.findOneOrFail({ date });

    const {
      starters: wantedStarters,
      dishes: wantedDishes,
      desserts: wantedDesserts,
      ...dto
    } = updateDailyMenuDto;

    wrap(menu).assign(dto);

    // TODO: Making you puke is the only thing this code is efficient about.
    const starters = wantedStarters
      ? await this.foodRepository.find({ foodId: { $in: wantedStarters } })
      : [];
    const dishes = wantedDishes
      ? await this.foodRepository.find({ foodId: { $in: wantedDishes } })
      : [];
    const desserts = wantedDesserts
      ? await this.foodRepository.find({ foodId: { $in: wantedDesserts } })
      : [];

    menu.starters.set(starters);
    menu.dishes.set(dishes);
    menu.desserts.set(desserts);

    await this.dailyMenuRepository.flush();
    return menu;
  }

  public async remove(date: Date): Promise<void> {
    const menu = await this.dailyMenuRepository.findOneOrFail({ date });
    await this.dailyMenuRepository.removeAndFlush(menu);
  }
}
