import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '../../shared/lib/decorators/upload-interceptor.decorator';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { normalizePagination } from '../../shared/modules/pagination';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { User } from '../../users/user.entity';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
import { CreateGalleryImageDto } from './dto/create-gallery-image.dto';
import { GalleryImageListOptions } from './dto/gallery-image-list-options.dto';
import { UpdateGalleryImageDto } from './dto/update-gallery-image.dto';
import { GalleryImage } from './gallery-image.entity';
import { GalleriesService } from './gallery.service';

@ApiTags('Galleries')
@Controller()
export class GalleriesController {
  constructor(
    private readonly galleriesService: GalleriesService,
    private readonly filesService: FileUploadsService,
  ) {}

  @UploadInterceptor()
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, GalleryImage))
  public async create(
    @CurrentUser() user: User,
    @Body() createAttachmentDto: CreateGalleryImageDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<GalleryImage> {
    if (!file)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(
      user,
      file,
      FileKind.GalleryImage,
      createAttachmentDto.fileLastModifiedAt,
    );
    return await this.galleriesService.create(user, createAttachmentDto, fileUpload);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, GalleryImage))
  public async findAll(
    @Query() options: GalleryImageListOptions,
  ): Promise<PaginatedResult<GalleryImage>> {
    return await this.galleriesService.findAll(normalizePagination(options));
  }

  @Get(':imageId')
  @CheckPolicies(ability => ability.can(Action.Read, GalleryImage))
  public async findOne(
    @Param('imageId') imageId: string,
  ): Promise<GalleryImage> {
    return await this.galleriesService.findOne(imageId);
  }

  @Patch(':imageId')
  @CheckPolicies(ability => ability.can(Action.Update, GalleryImage))
  public async update(
    @Param('imageId') imageId: string,
    @Body() updateGalleryImageDto: UpdateGalleryImageDto,
    @CurrentUser() user: User,
  ): Promise<GalleryImage> {
    return await this.galleriesService.update(user, imageId, updateGalleryImageDto);
  }

  @Delete(':imageId')
  @CheckPolicies(ability => ability.can(Action.Delete, GalleryImage))
  public async remove(
    @Param('imageId') imageId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.galleriesService.remove(user, imageId);
  }
}
