import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '../shared/modules/pagination';
import type { User } from '../users/user.entity';
import type { CreateWikiPageDto } from './dto/create-wiki-page.dto';
import type { UpdateWikiPageDto } from './dto/update-wiki-page.dto';
import { WikiPage } from './wiki-page.entity';

@Injectable()
export class WikisService {
  constructor(
    @InjectRepository(WikiPage) private readonly wikiPageRepository: BaseRepository<WikiPage>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(createWikiPageDto: CreateWikiPageDto): Promise<WikiPage> {
    const wiki = new WikiPage(createWikiPageDto);
    await this.wikiPageRepository.persistAndFlush(wiki);
    return wiki;
  }

  public async findAll(user: User, paginationOptions?: Required<PaginateDto>): Promise<PaginatedResult<WikiPage>> {
    const canSeeHiddenContent = this.caslAbilityFactory.canSeeHiddenContent(user);
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
  ): Promise<PaginatedResult<WikiPage>> {
    const canSeeHiddenContent = this.caslAbilityFactory.canSeeHiddenContent(user);
    const visibilityQuery = canSeeHiddenContent ? {} : { hidden: false };
    return await this.wikiPageRepository.findWithPagination(
      paginationOptions,
      { category, ...visibilityQuery },
      { orderBy: { createdAt: 'DESC' } },
    );
  }

  public async findOne(wikiId: number): Promise<WikiPage> {
    return await this.wikiPageRepository.findOneOrFail({ wikiPageId: wikiId });
  }

  public async update(wikiId: number, updateWikiDto: UpdateWikiPageDto): Promise<WikiPage> {
    const wiki = await this.wikiPageRepository.findOneOrFail({ wikiPageId: wikiId });

    wrap(wiki).assign(updateWikiDto);
    await this.wikiPageRepository.flush();
    return wiki;
  }

  public async remove(wikiId: number): Promise<void> {
    const wiki = await this.wikiPageRepository.findOneOrFail({ wikiPageId: wikiId });
    await this.wikiPageRepository.removeAndFlush(wiki);
  }
}
