import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Content } from '../../contents/entities/content.entity';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import { ContentKind } from '../../shared/lib/types/enums/content-kind.enum';
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

  public async assertCanCreateAttachment(user: User, createAttachmentDto: CreateAttachmentDto): Promise<boolean> {
    const content = await this.contentRepository.findOneOrFail({ contentId: createAttachmentDto.contentId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, content);

    if (content.kind === ContentKind.Comment)
      throw new BadRequestException('Content is a comment');

    return true;
  }

  public async create(createAttachmentDto: CreateAttachmentDto, file: FileUpload): Promise<Attachment> {
    const content = await this.contentRepository.findOneOrFail({ contentId: createAttachmentDto.contentId });

    const attachment = new Attachment({ ...createAttachmentDto, content, file });
    await this.attachmentRepository.persistAndFlush(attachment);
    return attachment;
  }

  public async findOne(user: User, attachmentId: string): Promise<Attachment> {
    const attachment = await this.attachmentRepository.findOneOrFail(
      { attachmentId },
      { populate: ['file', 'file.user', 'content'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, attachment);

    return attachment;
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
