import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@meta/shared/lib/orm/base.repository';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '@meta/shared/modules/pagination';
import type { CreateWikiPageDto } from '@modules/create/wikis/dto/create-wiki-page.dto';
import type { User } from '@modules/uua/users/user.entity';
import type { UpdateWikiPageDto } from './dto/update-wiki-page.dto';
import { Wiki } from './wiki.entity';

@Injectable()
export class WikisService {
  constructor(
    @InjectRepository(Wiki) private readonly wikiPageRepository: BaseRepository<Wiki>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(createWikiPageDto: CreateWikiPageDto): Promise<Wiki> {
    const wiki = new Wiki(createWikiPageDto);
    await this.wikiPageRepository.persistAndFlush(wiki);
    return wiki;
  }

  public async findAll(user: User, paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<Wiki>> {
    const canSeeHiddenContent = this.caslAbilityFactory.isModOrAdmin(user);
    const visibilityQuery = canSeeHiddenContent ? {} : { hidden: false };
    return await this.wikiPageRepository.findWithPagination(
      paginationOptions,
      visibilityQuery,
      { orderBy: { createdAt: 'DESC' } },
    );
  }

  public async findAllByCategory(
    user: User,
    category: string,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<Wiki>> {
    const canSeeHiddenContent = this.caslAbilityFactory.isModOrAdmin(user);
    const visibilityQuery = canSeeHiddenContent ? {} : { hidden: false };
    return await this.wikiPageRepository.findWithPagination(
      paginationOptions,
      { category, ...visibilityQuery },
      { orderBy: { createdAt: 'DESC' } },
    );
  }

  public async findOne(id: number): Promise<Wiki> {
    return await this.wikiPageRepository.findOneOrFail({ id });
  }

  public async update(id: number, updateWikiDto: UpdateWikiPageDto): Promise<Wiki> {
    const wiki = await this.wikiPageRepository.findOneOrFail({ id });

    wrap(wiki).assign(updateWikiDto);
    await this.wikiPageRepository.flush();
    return wiki;
  }

  public async remove(id: number): Promise<void> {
    const wiki = await this.wikiPageRepository.findOneOrFail({ id });
    await this.wikiPageRepository.removeAndFlush(wiki);
  }
}
