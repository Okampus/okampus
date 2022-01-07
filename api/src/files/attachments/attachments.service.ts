import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Post } from '../../posts/entities/post.entity';
import { Reply } from '../../replies/entities/reply.entity';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import { assertPermissions } from '../../shared/lib/utils/assertPermission';
import { Action } from '../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { User } from '../../users/user.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';
import { Attachment } from './attachment.entity';
import type { ContentOptions } from './content-options-xor.type';
import type { ValidCreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment) private readonly attachmentRepository: BaseRepository<Attachment>,
    @InjectRepository(Post) private readonly postRepository: BaseRepository<Post>,
    @InjectRepository(Reply) private readonly replyRepository: BaseRepository<Reply>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(createAttachmentDto: ValidCreateAttachmentDto, file: FileUpload): Promise<Attachment> {
    let options: ContentOptions | undefined;
    if (createAttachmentDto.postId) {
      const post = await this.postRepository.findOneOrFail({ postId: createAttachmentDto.postId });
      options = { post };
    } else if (createAttachmentDto.replyId) {
      const reply = await this.replyRepository.findOneOrFail({ replyId: createAttachmentDto.replyId });
      options = { reply };
    }

    const attachment = new Attachment({ ...createAttachmentDto, ...options!, file });
    await this.attachmentRepository.persistAndFlush(attachment);
    return attachment;
  }

  public async findOne(attachmentId: string): Promise<Attachment> {
    // TODO: Maybe the user won't have access to this post/reply. There can be some restrictions
    // (i.e. "personal"/"sensitive" posts/replies)
    return await this.attachmentRepository.findOneOrFail({ attachmentId }, ['file', 'post']);
  }

  public async remove(user: User, attachmentId: string): Promise<void> {
    const attachment = await this.attachmentRepository.findOneOrFail({ attachmentId }, ['file', 'post']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, attachment);

    await this.attachmentRepository.removeAndFlush(attachment);
  }
}
