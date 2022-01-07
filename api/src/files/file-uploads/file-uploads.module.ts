import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { FileUpload } from './file-upload.entity';
import { FileUploadsController } from './file-uploads.controller';
import { FileUploadsService } from './file-uploads.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([FileUpload]),
  ],
  controllers: [FileUploadsController],
  providers: [CaslAbilityFactory, FileUploadsService],
  exports: [FileUploadsService],
})
export class FileUploadsModule {}
