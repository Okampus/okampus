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
import { Action, CheckPolicies } from '@common/modules/authorization';
import { simpleImageMimeTypeRegex } from '@configs/mime-type';
import { UploadInterceptor } from '@lib/decorators/upload-interceptor.decorator';
import { CreateUserImageDto } from './dto/create-user-image.dto';
import { UserImage } from './user-image.entity';
import { UserImagesService } from './user-images.service';

// TODO: improve check policies
@ApiTags('User Images')
@Controller('users/images')
export class UserImagesController {
  constructor(
    private readonly userImagesService: UserImagesService,
  ) {}

  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, UserImage))
  public async createUserImage(
    @UploadedFile() file: MulterFile,
    @Body() createUserImageDto: CreateUserImageDto,
  ): Promise<UserImage> {
    return await this.userImagesService.create(file, createUserImageDto);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, UserImage))
  public async findUserImage(@Param('id') id: string): Promise<UserImage> {
    return await this.userImagesService.findOne(id);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Update, UserImage))
  public async removeUserImage(@Param('id') id: string): Promise<void> {
    await this.userImagesService.remove(id);
  }
}
