import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { DailyInfo } from './daily-info/daily-info.entity';
import { DailyMenu } from './daily-menus/daily-menu.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(DailyMenu) private readonly dailyMenuRepository: BaseRepository<DailyMenu>,
    @InjectRepository(DailyInfo) private readonly dailyInfoRepository: BaseRepository<DailyInfo>,
  ) {}

  public async findOneDateMenu(date: Date): Promise<DailyMenu | null> {
    return await this.dailyMenuRepository.findOne({ date: this.getDayQuery(date) }, { populate: ['starters', 'dishes', 'desserts'] });
  }

  public async findAllDateInfo(date: Date): Promise<DailyInfo | null> {
    return await this.dailyInfoRepository.findOne({ date: this.getDayQuery(date) });
  }

  private getDayQuery(date: Date): { $gte: Date; $lt: Date } {
    const dayMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    const dayEvening = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    return { $gte: dayMidnight, $lt: dayEvening };
  }
}
