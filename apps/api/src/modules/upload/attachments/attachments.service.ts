import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { ContentKind } from '@common/lib/types/enums/content-kind.enum';
import { assertPermissions } from '@common/lib/utils/assert-permission';
import { Action } from '@common/modules/authorization';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { Content } from '@modules/create/contents/entities/content.entity';
import type { User } from '@modules/uua/users/user.entity';
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
    if (!createAttachmentDto.id)
      return true;

    const content = await this.contentRepository.findOneOrFail({ id: createAttachmentDto.id });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, content);

    if (content.kind === ContentKind.Comment)
      throw new BadRequestException('Content is a comment');

    return true;
  }

  public async create(createAttachmentDto: CreateAttachmentDto, file: FileUpload): Promise<Attachment> {
    let content: Content | undefined;

    if (createAttachmentDto.id)
      content = await this.contentRepository.findOneOrFail({ id: createAttachmentDto.id });

    const attachment = new Attachment({ ...createAttachmentDto, content, file });
    await this.attachmentRepository.persistAndFlush(attachment);
    return attachment;
  }

  public async findOne(user: User, id: string): Promise<Attachment> {
    const attachment = await this.attachmentRepository.findOneOrFail(
      { id },
      { populate: ['file', 'file.user', 'content'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, attachment);

    return attachment;
  }

  public async remove(user: User, id: string): Promise<void> {
    const attachment = await this.attachmentRepository.findOneOrFail(
      { id },
      { populate: ['file', 'file.user', 'content'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, attachment);

    await this.attachmentRepository.removeAndFlush(attachment);
  }
}
