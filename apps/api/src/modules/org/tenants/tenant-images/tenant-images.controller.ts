import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { simpleImageMimeTypeRegex } from '@common/configs/mime-type';
import { UploadInterceptor } from '@common/lib/decorators/upload-interceptor.decorator';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { CreateTenantImageDto } from './dto/create-tenant-image.dto';
import { TenantImage } from './tenant-image.entity';
import { TenantImagesService } from './tenant-images.service';


// TODO: improve check policies
@ApiTags('Tenant Images')
@Controller()
export class TenantImagesController {
  constructor(
    private readonly tenantImagesService: TenantImagesService,
  ) {}

  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, TenantImage))
  public async createTenantImage(
    @UploadedFile() file: MulterFile,
    @Body() createTenantImageDto: CreateTenantImageDto,
  ): Promise<TenantImage> {
    return await this.tenantImagesService.create(file, createTenantImageDto);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, TenantImage))
  public async findTenantImage(@Param('id') id: string): Promise<TenantImage> {
    return await this.tenantImagesService.findOne(id);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Update, TenantImage))
  public async removeTenantImage(@Param('id') id: string): Promise<void> {
    await this.tenantImagesService.remove(id);
  }
}
