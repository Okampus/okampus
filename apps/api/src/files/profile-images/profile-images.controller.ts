import {
  BadRequestException,
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
import { Tenant } from '../../org/tenants/tenants/tenant.entity';
import { simpleImageMimeTypeRegex } from '../../shared/configs/mime-type';
import { CurrentTenant } from '../../shared/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '../../shared/lib/decorators/upload-interceptor.decorator';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { User } from '../../uua/users/user.entity';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
import { CreateProfileImageDto } from './dto/create-profile-image.dto';
import { ProfileImage } from './profile-image.entity';
import { ProfileImagesService } from './profile-images.service';


// TODO: improve check policies
@ApiTags('ProfileImages')
@Controller()
export class ProfileImagesController {
  constructor(
    private readonly profileImagesService: ProfileImagesService,
    private readonly filesService: FileUploadsService,
  ) {}

  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, ProfileImage))
  public async createProfileImage(
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() user: User,
    @Body() createProfileImageDto: CreateProfileImageDto,
    @UploadedFile() file: MulterFile,
  ): Promise<ProfileImage> {
    if (!file)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(
      tenant,
      user,
      file,
      FileKind.ProfileImage,
      createProfileImageDto.fileLastModifiedAt,
    );
    return await this.profileImagesService.create(fileUpload, createProfileImageDto.type);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, ProfileImage))
  public async findOneProfileImage(@Param('id') id: string): Promise<ProfileImage> {
    return await this.profileImagesService.findOne(id);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Update, ProfileImage))
  public async removeProfileImage(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.profileImagesService.remove(user, id);
  }
}
