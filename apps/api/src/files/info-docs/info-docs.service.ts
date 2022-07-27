import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { SchoolGroup } from '../../school-group/school-group.entity';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import type { InfoDocFilter } from '../../shared/lib/types/enums/docs-filters.enum';
import { assertPermissions } from '../../shared/lib/utils/assert-permission';
import type { Categories, GroupFilters } from '../../shared/lib/utils/compute-document-categories';
import { computeDocumentCategories } from '../../shared/lib/utils/compute-document-categories';
import { Action } from '../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '../../shared/modules/pagination';
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
    @InjectRepository(SchoolGroup) private readonly schoolGroupRepository: BaseRepository<SchoolGroup>,
    private readonly infoDocSearchService: InfoDocSearchService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(createInfoDocDto: CreateInfoDocDto, file: FileUpload): Promise<InfoDoc> {
    const docSeries = await this.docSeriesRepository.findOne({ id: createInfoDocDto.docSeries });
    const schoolGroup = (typeof createInfoDocDto.schoolGroupId === 'number')
      ? await this.schoolGroupRepository.findOneOrFail({ id: createInfoDocDto.schoolGroupId })
      : null;

    const infoDoc = new InfoDoc({
      ...createInfoDocDto,
      ...(schoolGroup ? { schoolGroup } : {}),
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
    if (typeof filters.year !== 'undefined')
      options = { ...options, year: filters.year };

    return await this.infoDocRepository.findWithPagination(
      paginationOptions,
      options,
      { populate: ['file', 'file.user', 'docSeries'] },
    );
  }

  public async findCategories(baseFilters: InfoDocFilter[]): Promise<Categories<InfoDoc>> {
    const allDocuments: InfoDoc[] = await this.infoDocRepository.findAll();

    const groupFilters: GroupFilters<InfoDoc> = {
      year: elt => ({ key: elt.year.toString(), metadata: null }),
    } as const;

    const result = computeDocumentCategories(allDocuments, groupFilters, baseFilters);
    return result;
  }

  public async findOne(id: string): Promise<InfoDoc> {
    // TODO: Maybe the user won't have access to this doc. There can be some restrictions
    // (i.e. "sensitive"/"deprecated" docs)
    return await this.infoDocRepository.findOneOrFail(
      { id },
      { populate: ['file', 'file.user', 'docSeries'] },
    );
  }

  public async update(user: User, id: string, updateCourseDto: UpdateInfoDocDto): Promise<InfoDoc> {
    const infoDoc = await this.infoDocRepository.findOneOrFail(
      { id },
      { populate: ['file', 'file.user', 'docSeries'] },
    );

    const schoolGroup = (typeof updateCourseDto.schoolGroupId === 'number')
      ? await this.schoolGroupRepository.findOneOrFail({ id: updateCourseDto.schoolGroupId })
      : infoDoc.schoolGroup;

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, infoDoc);

    const docSeries = await this.docSeriesRepository.findOneOrFail({ id: updateCourseDto.docSeries });

    wrap(infoDoc).assign({
      ...updateCourseDto,
      ...(schoolGroup ? { schoolGroup } : {}),
      docSeries,
    });

    await this.infoDocRepository.flush();
    await this.infoDocSearchService.update(infoDoc);
    return infoDoc;
  }

  public async remove(user: User, id: string): Promise<void> {
    const infoDoc = await this.infoDocRepository.findOneOrFail({ id }, { populate: ['file'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, infoDoc);

    await this.infoDocRepository.removeAndFlush(infoDoc);
    await this.infoDocSearchService.remove(infoDoc.id);
  }
}
