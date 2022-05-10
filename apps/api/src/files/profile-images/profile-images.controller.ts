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
import { Express } from 'express';
import { simpleImageMimeTypeRegex } from '../../shared/configs/mime-type';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '../../shared/lib/decorators/upload-interceptor.decorator';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { User } from '../../users/user.entity';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
import { CreateProfileImageDto } from './dto/create-profile-image.dto';
import { ProfileImage } from './profile-image.entity';
import { ProfileImagesService } from './profile-images.service';

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
    @CurrentUser() user: User,
    @Body() createProfileImageDto: CreateProfileImageDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProfileImage> {
    if (!file)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(
      user,
      file,
      FileKind.ProfileImage,
      createProfileImageDto.fileLastModifiedAt,
    );
    return await this.profileImagesService.create(fileUpload);
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
