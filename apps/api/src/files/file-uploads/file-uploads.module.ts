import { promises as fs } from 'node:fs';
import path from 'node:path';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Logger, Module } from '@nestjs/common';
import { config } from '../../shared/configs/config';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import { enumKeys } from '../../shared/lib/utils/enum-keys';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { FilePersistanceService } from './file-persistance.service';
import { FileUpload } from './file-upload.entity';
import { FileUploadsService } from './file-uploads.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([FileUpload]),
  ],
  controllers: [],
  providers: [CaslAbilityFactory, FileUploadsService, FilePersistanceService],
  exports: [FileUploadsService],
})
export class FileUploadsModule implements OnModuleInit {
  public async onModuleInit(): Promise<void> {
    const logger = new Logger('Files');

    if (config.get('storage.enabled')) {
      logger.log(`Distant storage is enabled, uploading to ${config.get('storage.endpoint')}`);
      return;
    }

    logger.log('Distant storage is disabled, uploading to local file system.');
    const base = path.join(path.resolve('./'), config.get('upload.path'));

    const dirs: Array<Promise<string | undefined>> = [];
    for (const value of enumKeys(FileKind))
      dirs.push(fs.mkdir(path.join(base, FileKind[value]), { recursive: true }));

    await Promise.all(dirs);
  }
}
