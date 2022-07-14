import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { FileUploadsService } from '../files/file-uploads/file-uploads.service';
import { ProfileImage } from '../files/profile-images/profile-image.entity';
import { ProfileImagesService } from '../files/profile-images/profile-images.service';
import { simpleImageMimeTypeRegex } from '../shared/configs/mime-type';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '../shared/lib/decorators/upload-interceptor.decorator';
import { TypesenseEnabledGuard } from '../shared/lib/guards/typesense-enabled.guard';
import { FileKind } from '../shared/lib/types/enums/file-kind.enum';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { normalizePagination, PaginateDto } from '../shared/modules/pagination';
import type { PaginatedResult } from '../shared/modules/pagination';
import { SearchDto } from '../shared/modules/search/search.dto';
import type { Statistics } from '../statistics/statistics.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { GdprService } from './gdpr/gdpr.service';
import { UserSearchService } from './user-search.service';
import type { IndexedUser } from './user-search.service';
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

    private readonly userSearchService: UserSearchService,
  ) {}

  @Get('/gdpr-dump')
  public async getGdprDump(@CurrentUser() user: User): Promise<object> {
    return await this.gdprService.getGdprDump(user);
  }

  @Get(':userId')
  public async findOne(@Param('userId') userId: string): Promise<User> {
    return await this.usersService.findOneById(userId);
  }

  @UseGuards(TypesenseEnabledGuard)
  @Get('/search')
  public async search(
    @Query('full') full: boolean,
    @Query() query: SearchDto,
  ): Promise<SearchResponse<IndexedUser> | SearchResponse<User>> {
    if (full)
      return await this.userSearchService.searchAndPopulate(query);
    return await this.userSearchService.search(query);
  }

  @Get()
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<User>> {
    return await this.usersService.findAll(normalizePagination(query));
  }

  @Delete(':userId')
  @CheckPolicies(ability => ability.can(Action.Delete, User))
  public async delete(@Param('userId') userId: string): Promise<void> {
    await this.usersService.delete(userId);
  }

  @Get('/:userId/statistics')
  public async getUserStats(@Param('userId') userId: string): Promise<Statistics | null> {
    return await this.usersService.getUserStats(userId);
  }

  @Patch('/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, User))
  public async update(
    @CurrentUser() user: User,
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(user, userId, updateUserDto);
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

    const fileUpload = await this.filesService.create(user, file, FileKind.ProfileImage);
    const profileImage = await this.profileImagesService.create(fileUpload);

    return await this.usersService.updateProfileImage(user, 'avatar', profileImage);
  }

  @Put('/banner')
  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @CheckPolicies(
    ability => ability.can(Action.Create, ProfileImage),
    ability => ability.can(Action.Update, User),
  )
  public async updateBanner(
    @CurrentUser() user: User,
    @UploadedFile() banner: Express.Multer.File,
  ): Promise<User> {
    if (!banner)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(user, banner, FileKind.ProfileImage);
    const profileImage = await this.profileImagesService.create(fileUpload);

    return await this.usersService.updateProfileImage(user, 'banner', profileImage);
  }
}
