import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Content } from '../../contents/content.entity';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import { ContentKind } from '../../shared/lib/types/content-kind.enum';
import { assertPermissions } from '../../shared/lib/utils/assert-permission';
import { Action } from '../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { User } from '../../users/user.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';
import { Attachment } from './attachment.entity';
import type { CreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment) private readonly attachmentRepository: BaseRepository<Attachment>,
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(createAttachmentDto: CreateAttachmentDto, file: FileUpload): Promise<Attachment> {
    const content = await this.contentRepository.findOneOrFail({ contentId: createAttachmentDto.contentId });
    if (content.kind === ContentKind.Comment)
      throw new BadRequestException('Content is a comment');

    const attachment = new Attachment({ ...createAttachmentDto, content, file });
    await this.attachmentRepository.persistAndFlush(attachment);
    return attachment;
  }

  public async findOne(attachmentId: string): Promise<Attachment> {
    // TODO: Maybe the user won't have access to this post/reply. There can be some restrictions
    // (i.e. "personal"/"sensitive" contents)
    return await this.attachmentRepository.findOneOrFail(
      { attachmentId },
      { populate: ['file', 'file.user', 'content'] },
    );
  }

  public async remove(user: User, attachmentId: string): Promise<void> {
    const attachment = await this.attachmentRepository.findOneOrFail(
      { attachmentId },
      { populate: ['file', 'file.user', 'content'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, attachment);

    await this.attachmentRepository.removeAndFlush(attachment);
  }
}
