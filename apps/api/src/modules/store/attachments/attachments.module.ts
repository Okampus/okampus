import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { Content } from '@modules/create/contents/entities/content.entity';
import { FileUploadsModule } from '../file-uploads/file-uploads.module';
import { Attachment } from './attachment.entity';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Attachment, Content]),
    FileUploadsModule,
  ],
  controllers: [AttachmentsController],
  providers: [CaslAbilityFactory, AttachmentsService],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
