import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '../../shared/lib/decorators/upload-interceptor.decorator';
import { FileKind } from '../../shared/lib/types/file-kind.enum';
import { Action, CheckPolicies, PoliciesGuard } from '../../shared/modules/authorization';
import { User } from '../../users/user.entity';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
import { Attachment } from './attachment.entity';
import { AttachmentsService } from './attachments.service';
import type { ValidCreateAttachmentDto } from './dto/create-attachment.dto';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@ApiTags('Attachments')
@UseGuards(PoliciesGuard)
@Controller({ path: 'files/attachments' })
export class AttachmentsController {
  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly filesService: FileUploadsService,
  ) {}

  @UploadInterceptor()
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Attachment))
  public async createAttachment(
    @CurrentUser() user: User,
    @Body() createAttachmentDto: CreateAttachmentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Attachment> {
    if (!file)
      throw new BadRequestException('No file provided');

    if (typeof createAttachmentDto.postId?.toString() === typeof createAttachmentDto.replyId?.toString())
      throw new BadRequestException('One of postId and replyId must be entered');

    const fileUpload = await this.filesService.create(
      user,
      file,
      FileKind.Attachment,
      createAttachmentDto.fileLastModifiedAt,
    );
    return await this.attachmentsService.create(createAttachmentDto as ValidCreateAttachmentDto, fileUpload);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Attachment))
  public async findOneAttachment(@Param('id') id: string): Promise<Attachment> {
    return await this.attachmentsService.findOne(id);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Attachment))
  public async removeAttachment(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.attachmentsService.remove(user, id);
  }
}
