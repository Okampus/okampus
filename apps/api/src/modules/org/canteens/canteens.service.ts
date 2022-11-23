import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { Menu } from './menus/menu.entity';

@Injectable()
export class CanteensService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: BaseRepository<Menu>,
  ) {}

  public async findOneDateMenu(date: Date): Promise<Menu | null> {
    return await this.menuRepository.findOne(
      { date: this.getDayQuery(date) },
      { populate: ['starters', 'dishes', 'desserts'] },
    );
  }

  private getDayQuery(date: Date): { $gte: Date; $lt: Date } {
    const dayMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    const dayEvening = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    return { $gte: dayMidnight, $lt: dayEvening };
  }
}
