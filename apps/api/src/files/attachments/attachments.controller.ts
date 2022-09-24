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
import { CurrentTenant } from '../../shared/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '../../shared/lib/decorators/upload-interceptor.decorator';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { Tenant } from '../../tenants/tenants/tenant.entity';
import { User } from '../../users/user.entity';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
import { Attachment } from './attachment.entity';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@ApiTags('Attachments')
@Controller()
export class AttachmentsController {
  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly filesService: FileUploadsService,
  ) {}

  @UploadInterceptor()
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Attachment))
  public async create(
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() user: User,
    @Body() createAttachmentDto: CreateAttachmentDto,
    @UploadedFile() file: MulterFile,
  ): Promise<Attachment> {
    if (!file)
      throw new BadRequestException('No file provided');

    await this.attachmentsService.assertCanCreateAttachment(user, createAttachmentDto);

    const fileUpload = await this.filesService.create(
      tenant,
      user,
      file,
      FileKind.Attachment,
      createAttachmentDto.fileLastModifiedAt,
    );
    return await this.attachmentsService.create(createAttachmentDto, fileUpload);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Attachment))
  public async findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<Attachment> {
    return await this.attachmentsService.findOne(user, id);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Attachment))
  public async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.attachmentsService.remove(user, id);
  }
}
