import {
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
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { PaginationOptions } from '@common/modules/pagination';
import type { PaginatedNodes } from '@common/modules/pagination';
import type { IndexedEntity } from '@common/modules/search/indexed-entity.interface';
import { simpleImageMimeTypeRegex } from '@configs/mime-type';
import { CurrentTenant } from '@lib/decorators/current-tenant.decorator';
import { CurrentUser } from '@lib/decorators/current-user.decorator';
import { UploadInterceptor } from '@lib/decorators/upload-interceptor.decorator';
import { UserImageType } from '@lib/types/enums/user-image-type.enum';
import type { FullPageInfo } from '@lib/types/interfaces/full-page-info.interface';
import { Tenant } from '@tenants/tenant.entity';
import { GdprService } from '@uaa/gdpr/gdpr.service';
import type { Statistics } from '@uaa/statistics/statistics.entity';
import type { CreateUserImageDto } from '@uaa/user-images/dto/create-user-image.dto';
import { UserImage } from '@uaa/user-images/user-image.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller({ path: 'users' })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly gdprService: GdprService,
  ) {}

  @CacheTTL(60 * 60 * 24 * 3) // 3 days in seconds
  @UseInterceptors(CacheInterceptor)
  @Get('gdpr-dump')
  public async getGdprDump(@CurrentUser() user: User): Promise<object> {
    return await this.gdprService.getGdprDump(user);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Get()
  public async findAll(@Query() query: PaginationOptions): Promise<PaginatedNodes<User>> {
    return await this.usersService.findAll(query);
  }

  @Get('all/search')
  public async search(
    @CurrentTenant() tenant: Tenant,
    @Query() query: PaginationOptions & { search: string },
  ): Promise<FullPageInfo<IndexedEntity>> {
    return await this.usersService.search(tenant, query);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, User))
  public async delete(@Param('id') id: string): Promise<void> {
    await this.usersService.delete(id);
  }

  @Get(':id/statistics')
  public async getUserStats(@Param('id') id: string): Promise<Omit<Statistics, 'assign'> | null> {
    return await this.usersService.getStats(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, User))
  public async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Put('avatar')
  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @CheckPolicies(
    ability => ability.can(Action.Create, UserImage),
    ability => ability.can(Action.Update, User),
  )
  public async updateAvatar(
    @UploadedFile() avatar: MulterFile,
    @Body() createUserImage: Omit<CreateUserImageDto, 'type'>,
  ): Promise<User> {
    return await this.usersService.addImage(avatar, { ...createUserImage, type: UserImageType.Avatar });
  }

  @Put('banner')
  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @CheckPolicies(
    ability => ability.can(Action.Create, UserImage),
    ability => ability.can(Action.Update, User),
  )
  public async updateBanner(
    @UploadedFile() banner: MulterFile,
    @Body() createUserImage: Omit<CreateUserImageDto, 'type'>,
  ): Promise<User> {
    return await this.usersService.addImage(banner, { ...createUserImage, type: UserImageType.Banner });
  }
}
