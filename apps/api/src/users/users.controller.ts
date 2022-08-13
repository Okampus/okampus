import {
  BadRequestException,
  Body,
  CacheInterceptor,
  CacheTTL,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { FileUploadsService } from '../files/file-uploads/file-uploads.service';
import { ProfileImage } from '../files/profile-images/profile-image.entity';
import { ProfileImagesService } from '../files/profile-images/profile-images.service';
import { simpleImageMimeTypeRegex } from '../shared/configs/mime-type';
import { CurrentTenant } from '../shared/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '../shared/lib/decorators/upload-interceptor.decorator';
import { FileKind } from '../shared/lib/types/enums/file-kind.enum';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { normalizePagination, PaginateDto } from '../shared/modules/pagination';
import type { PaginatedResult } from '../shared/modules/pagination';
import type { IndexedEntity } from '../shared/modules/search/meilisearch.global';
import type { Statistics } from '../statistics/statistics.entity';
import { Tenant } from '../tenants/tenants/tenant.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { GdprService } from './gdpr/gdpr.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller({ path: 'users' })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profileImagesService: ProfileImagesService,
    private readonly filesService: FileUploadsService,
    private readonly gdprService: GdprService,
  ) {}

  @CacheTTL(60 * 60 * 24 * 3) // 3 days in seconds
  @UseInterceptors(CacheInterceptor)
  @Get('/gdpr-dump')
  public async getGdprDump(@CurrentUser() user: User): Promise<object> {
    return await this.gdprService.getGdprDump(user);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOneById(id);
  }

  @Get()
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<User>> {
    return await this.usersService.findAll(normalizePagination(query));
  }

  @Get('/all/search')
  public async search(
    @CurrentTenant() tenant: Tenant,
    @Query() query: PaginateDto & { search: string },
  ): Promise<PaginatedResult<IndexedEntity>> {
    return await this.usersService.search(tenant, query);
  }

  @Delete('/:id')
  @CheckPolicies(ability => ability.can(Action.Delete, User))
  public async delete(@Param('id') id: string): Promise<void> {
    await this.usersService.delete(id);
  }

  @Get('/:id/statistics')
  public async getUserStats(@Param('id') id: string): Promise<Omit<Statistics, 'assign'> | null> {
    return await this.usersService.getUserStats(id);
  }

  @Patch('/:id')
  @CheckPolicies(ability => ability.can(Action.Update, User))
  public async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(user, id, updateUserDto);
  }

  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @Put('/avatar')
  @CheckPolicies(
    ability => ability.can(Action.Create, ProfileImage),
    ability => ability.can(Action.Update, User),
  )
  public async updateAvatar(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    if (!file)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(user.tenant, user, file, FileKind.ProfileImage);
    const profileImage = await this.profileImagesService.create(fileUpload, 'avatar');

    return await this.usersService.updateProfileImage(user, 'avatar', profileImage);
  }

  @Put('/banner')
  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @CheckPolicies(
    ability => ability.can(Action.Create, ProfileImage),
    ability => ability.can(Action.Update, User),
  )
  public async updateBanner(
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() user: User,
    @UploadedFile() banner: Express.Multer.File,
  ): Promise<User> {
    if (!banner)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(tenant, user, banner, FileKind.ProfileImage);
    const profileImage = await this.profileImagesService.create(fileUpload, 'banner');

    return await this.usersService.updateProfileImage(user, 'banner', profileImage);
  }
}
