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
import { CreateTeamImageDto } from './dto/create-team-image.dto';
import { TeamImage } from './team-image.entity';
import { TeamImagesService } from './team-images.service';


// TODO: improve check policies
@ApiTags('Team Images')
@Controller()
export class TeamImagesController {
  constructor(
    private readonly userImagesService: TeamImagesService,
  ) {}

  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, TeamImage))
  public async createTeamImage(
    @UploadedFile() file: MulterFile,
    @Body() createTeamImageDto: CreateTeamImageDto,
  ): Promise<TeamImage> {
    return await this.userImagesService.create(file, createTeamImageDto);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, TeamImage))
  public async findTeamImage(@Param('id') id: string): Promise<TeamImage> {
    return await this.userImagesService.findOne(id);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Update, TeamImage))
  public async removeTeamImage(@Param('id') id: string): Promise<void> {
    await this.userImagesService.remove(id);
  }
}
