import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Content } from '../../contents/entities/content.entity';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
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
