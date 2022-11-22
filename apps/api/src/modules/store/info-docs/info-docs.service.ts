import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@meta/shared/lib/orm/base.repository';
import type { InfoDocFilter } from '@meta/shared/lib/types/enums/docs-filters.enum';
import { assertPermissions } from '@meta/shared/lib/utils/assert-permission';
import type { Categories, GroupFilters } from '@meta/shared/lib/utils/compute-document-categories';
import { computeDocumentCategories } from '@meta/shared/lib/utils/compute-document-categories';
import { Action } from '@meta/shared/modules/authorization';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '@meta/shared/modules/pagination';
import { Class } from '@modules/org/classes/class.entity';
import type { CreateInfoDocDto } from '@modules/store/info-docs/dto/create-info-doc.dto';
import type { User } from '@modules/uua/users/user.entity';
import { DocSeries } from '../doc-series/doc-series.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';
import type { DocsFilterDto } from './dto/docs-filter.dto';
import type { UpdateInfoDocDto } from './dto/update-info-doc.dto';
import { InfoDoc } from './info-doc.entity';

@Injectable()
export class InfoDocsService {
  constructor(
    @InjectRepository(InfoDoc) private readonly infoDocRepository: BaseRepository<InfoDoc>,
    @InjectRepository(DocSeries) private readonly docSeriesRepository: BaseRepository<DocSeries>,
    @InjectRepository(Class) private readonly classRepository: BaseRepository<Class>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(createInfoDocDto: CreateInfoDocDto, file: FileUpload): Promise<InfoDoc> {
    const docSeries = await this.docSeriesRepository.findOne({ id: createInfoDocDto.docSeries });
    const schoolClass = (typeof createInfoDocDto.classId === 'string')
      ? await this.classRepository.findOneOrFail({ id: createInfoDocDto.classId })
      : null;

    const infoDoc = new InfoDoc({
      ...createInfoDocDto,
      ...(schoolClass ? { schoolClass } : {}),
      file,
      docSeries,
    });
    await this.infoDocRepository.persistAndFlush(infoDoc);
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
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Year: elt => ({ key: elt.year.toString(), metadata: null }),
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

    const schoolClass = (typeof updateCourseDto.classId === 'string')
      ? await this.classRepository.findOneOrFail({ id: updateCourseDto.classId })
      : infoDoc.schoolClass;

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, infoDoc);

    const docSeries = await this.docSeriesRepository.findOneOrFail({ id: updateCourseDto.docSeries });

    wrap(infoDoc).assign({
      ...updateCourseDto,
      ...(schoolClass ? { schoolClass } : {}),
      docSeries,
    });

    await this.infoDocRepository.flush();
    return infoDoc;
  }

  public async remove(user: User, id: string): Promise<void> {
    const infoDoc = await this.infoDocRepository.findOneOrFail({ id }, { populate: ['file'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, infoDoc);

    await this.infoDocRepository.removeAndFlush(infoDoc);
  }
}
