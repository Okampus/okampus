import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import groupBy from 'lodash.groupby';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import type { Category, InfoDocCategoryType } from '../../shared/lib/types/docs-category.type';
import type { ValueOf } from '../../shared/lib/types/valueof.type';
import { assertPermissions } from '../../shared/lib/utils/assert-permission';
import { Action } from '../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { PaginateDto } from '../../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import type { User } from '../../users/user.entity';
import { DocSeries } from '../doc-series/doc-series.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';
import type { CreateInfoDocDto } from './dto/create-info-doc.dto';
import type { DocsFilterDto } from './dto/docs-filter.dto';
import type { UpdateInfoDocDto } from './dto/update-info-doc.dto';
import { InfoDoc } from './info-doc.entity';
import { InfoDocSearchService } from './info-docs-search.service';

@Injectable()
export class InfoDocsService {
  constructor(
    @InjectRepository(InfoDoc) private readonly infoDocRepository: BaseRepository<InfoDoc>,
    @InjectRepository(DocSeries) private readonly docSeriesRepository: BaseRepository<DocSeries>,
    private readonly infoDocSearchService: InfoDocSearchService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(createInfoDocDto: CreateInfoDocDto, file: FileUpload): Promise<InfoDoc> {
    const docSeries = await this.docSeriesRepository.findOne({ docSeriesId: createInfoDocDto.docSeries });
    const infoDoc = new InfoDoc({
      ...createInfoDocDto,
      file,
      docSeries,
    });
    await this.infoDocRepository.persistAndFlush(infoDoc);
    await this.infoDocSearchService.add(infoDoc);
    return infoDoc;
  }

  public async findAll(
    filters: DocsFilterDto,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<InfoDoc>> {
    // TODO: Maybe the user won't have access to all docs. There can be some restrictions
    // (i.e. "sensitive"/"deprecated" docs)
    let options: FilterQuery<InfoDoc> = {};
    if (typeof filters.schoolYear !== 'undefined')
      options = { ...options, schoolYear: filters.schoolYear };
    if (typeof filters.year !== 'undefined')
      options = { ...options, year: filters.year };

    return await this.infoDocRepository.findWithPagination(
      paginationOptions,
      options,
      { populate: ['file', 'file.user', 'docSeries'] },
    );
  }

  public async findCategories(baseFilters: InfoDocCategoryType[]): Promise<Array<Category<InfoDocCategoryType>>> {
    const allDocuments: InfoDoc[] = await this.infoDocRepository.findAll();

    const groupFilters: Record<InfoDocCategoryType, (elt: InfoDoc) => ValueOf<InfoDoc>> = {
      schoolYear: elt => elt.schoolYear,
      year: elt => elt.year,
    } as const;

    const computeChildren = (
      documents: InfoDoc[],
      filters: InfoDocCategoryType[],
    ): Array<Category<InfoDocCategoryType>> =>
      Object.entries(groupBy(documents, groupFilters[filters[0]]))
        .map(([title, value]) => ({
          title,
          context: filters[0],
          children: filters.length === 1 ? [] : computeChildren(value, filters.slice(1)),
        }));

    return computeChildren(allDocuments, baseFilters)
      .flatMap(category => (category.title === 'undefined' ? category.children : category));
  }

  public async findOne(infoDocId: string): Promise<InfoDoc> {
    // TODO: Maybe the user won't have access to this doc. There can be some restrictions
    // (i.e. "sensitive"/"deprecated" docs)
    return await this.infoDocRepository.findOneOrFail(
      { infoDocId },
      { populate: ['file', 'file.user', 'docSeries'] },
    );
  }

  public async update(user: User, infoDocId: string, updateCourseDto: UpdateInfoDocDto): Promise<InfoDoc> {
    const infoDoc = await this.infoDocRepository.findOneOrFail(
      { infoDocId },
      { populate: ['file', 'file.user', 'docSeries'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, infoDoc);

    const docSeries = await this.docSeriesRepository.findOneOrFail({ docSeriesId: updateCourseDto.docSeries });

    wrap(infoDoc).assign({ ...updateCourseDto, docSeries });
    await this.infoDocRepository.flush();
    await this.infoDocSearchService.update(infoDoc);
    return infoDoc;
  }

  public async remove(user: User, infoDocId: string): Promise<void> {
    const infoDoc = await this.infoDocRepository.findOneOrFail({ infoDocId }, { populate: ['file'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, infoDoc);

    await this.infoDocRepository.removeAndFlush(infoDoc);
    await this.infoDocSearchService.remove(infoDoc.infoDocId);
  }
}
