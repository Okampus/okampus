import { UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GlobalRequestService } from '@common/lib/helpers/global-request-service';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { assertPermissions } from '@common/lib/utils/assert-permission';
import { Action } from '@common/modules/authorization';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '@common/modules/pagination';
import { App } from './app.entity';
import type { CreateAppDto } from './dto/create-app.dto';
import type { UpdateAppDto } from './dto/update-app.dto';

@Injectable()
export class AppsService extends GlobalRequestService {
  constructor(
    @InjectRepository(App) private readonly appRepository: BaseRepository<App>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) { super(); }

  public async create(createAppDto: CreateAppDto): Promise<App> {
    const owner = this.currentUser();
    if (!owner)
      throw new BadRequestException('You must be logged in to create an app');

    const app = new App({ ...createAppDto, owner });
    try {
      await this.appRepository.persistAndFlush(app);
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Tag name already exists');
      throw error;
    }
    return app;
  }

  public async findAll(
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<App>> {
    return await this.appRepository.findWithPagination(paginationOptions);
  }

  public async findOne(name: string): Promise<App> {
    return await this.appRepository.findOneOrFail({ name });
  }

  public async update(name: string, updateTagDto: UpdateAppDto): Promise<App> {
    const app = await this.appRepository.findOneOrFail({ name });

    wrap(app).assign(updateTagDto);
    await this.appRepository.flush();
    return app;
  }

  public async remove(name: string): Promise<void> {
    const app = await this.appRepository.findOneOrFail({ name });

    const ability = this.caslAbilityFactory.createForUser(this.currentUser());
    assertPermissions(ability, Action.Delete, app);

    await this.appRepository.removeAndFlush(app);
  }
}
