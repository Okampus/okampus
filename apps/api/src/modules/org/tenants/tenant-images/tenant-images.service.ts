import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { GlobalRequestService } from '@common/lib/helpers/global-request-service';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { FileKind } from '@common/lib/types/enums/file-kind.enum';
import type { TenantImageType } from '@common/lib/types/enums/tenant-image-type.enum';
import { assertPermissions } from '@common/lib/utils/assert-permission';
import { Action } from '@common/modules/authorization';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import type { PaginatedNodes, PaginationOptions } from '@common/modules/pagination';
import { FileUploadsService } from '@modules/upload/file-uploads/file-uploads.service';
import { Tenant } from '../tenant.entity';
import type { CreateTenantImageDto } from './dto/create-tenant-image.dto';
import { TenantImage } from './tenant-image.entity';

@Injectable()
export class TenantImagesService extends GlobalRequestService {
  constructor(
    @InjectRepository(TenantImage) private readonly tenantImageRepository: BaseRepository<TenantImage>,
    @InjectRepository(Tenant) private readonly tenantRepository: BaseRepository<Tenant>,
    private readonly filesService: FileUploadsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) { super(); }

  public async create(multerFile: MulterFile, createTenantImageDto: CreateTenantImageDto): Promise<TenantImage> {
    if (!multerFile)
      throw new BadRequestException('No file provided');

    const { tenantId, fileLastModifiedAt, ...createTenantImage } = createTenantImageDto;

    const ability = this.caslAbilityFactory.createForUser(this.currentUser());
    assertPermissions(ability, Action.Create, TenantImage);

    const tenant = await this.tenantRepository.findOneOrFail({ id: tenantId });
    const file = await this.filesService.create(
      tenant,
      this.currentUser(),
      multerFile,
      FileKind.TenantImage,
      fileLastModifiedAt,
    );

    const tenantImage = new TenantImage({ file, ...createTenantImage, tenant: this.currentTenant() });
    await this.tenantImageRepository.persistAndFlush(tenantImage);
    return tenantImage;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedNodes<TenantImage>> {
    return await this.tenantImageRepository.findWithPagination(paginationOptions, {}, { populate: ['file', 'tenant'] });
  }

  public async findOne(id: string): Promise<TenantImage> {
    return await this.tenantImageRepository.findOneOrFail({ id }, { populate: ['file', 'tenant'] });
  }

  public async findLastActive(tenantId: string, type: TenantImageType): Promise<TenantImage | null> {
    return await this.tenantImageRepository.findOne({ tenant: { id: tenantId }, active: true, type }, { populate: ['file', 'tenant'] });
  }

  public async setInactiveLastActive(tenantId: string, type: TenantImageType): Promise<void> {
    const tenantImage = await this.findLastActive(tenantId, type);
    if (tenantImage) {
      tenantImage.active = false;
      tenantImage.lastActiveDate = new Date();
      await this.tenantImageRepository.flush();
    }
  }

  public async remove(id: string): Promise<void> {
    const tenantImage = await this.tenantImageRepository.findOneOrFail({ id }, { populate: ['file'] });

    const ability = this.caslAbilityFactory.createForUser(this.currentUser());
    assertPermissions(ability, Action.Delete, tenantImage);

    await this.tenantImageRepository.removeAndFlush(tenantImage);
  }
}
