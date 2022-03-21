import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import type { PaginatedResult, PaginateDto } from '../../shared/modules/pagination';
import { DailyInfo } from './daily-info.entity';
import type { CreateDailyInfoDto } from './dto/create-daily-info.dto';
import type { UpdateDailyInfoDto } from './dto/update-daily-info.dto';

type NormalizedDate<T> = Omit<T, 'date'> & { date: Date };

@Injectable()
export class DailyInfoService {
  constructor(
    @InjectRepository(DailyInfo) private readonly dailyInfoRepository: BaseRepository<DailyInfo>,
  ) {}

  public async create(createDailyInfoDto: NormalizedDate<CreateDailyInfoDto>): Promise<DailyInfo> {
    const info = new DailyInfo(createDailyInfoDto);
    try {
      await this.dailyInfoRepository.persistAndFlush(info);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Daily info for date already exists');
      throw error;
    }
    return info;
  }

  public async findOne(date: Date): Promise<DailyInfo> {
    return await this.dailyInfoRepository.findOneOrFail({ date });
  }

  public async findAll(paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<DailyInfo>> {
    return await this.dailyInfoRepository.findWithPagination(
      paginationOptions,
      {},
      { orderBy: { date: 'ASC' } },
    );
  }

  public async update(date: Date, updateDailyInfoDto: Partial<NormalizedDate<UpdateDailyInfoDto>>): Promise<DailyInfo> {
    const info = await this.dailyInfoRepository.findOneOrFail({ date });
    wrap(info).assign(updateDailyInfoDto);
    await this.dailyInfoRepository.flush();
    return info;
  }

  public async remove(date: Date): Promise<void> {
    const dailyInfo = await this.dailyInfoRepository.findOneOrFail({ date });
    await this.dailyInfoRepository.removeAndFlush(dailyInfo);
  }
}
