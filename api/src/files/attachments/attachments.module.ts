import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Post } from '../../posts/entities/post.entity';
import { Reply } from '../../replies/entities/reply.entity';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { FileUploadsModule } from '../file-uploads/file-uploads.module';
import { Attachment } from './attachment.entity';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Attachment, Post, Reply]),
    FileUploadsModule,
  ],
  controllers: [AttachmentsController],
  providers: [CaslAbilityFactory, AttachmentsService],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
