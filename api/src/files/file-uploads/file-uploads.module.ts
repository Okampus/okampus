import { promises as fs } from 'node:fs';
import path from 'node:path';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Logger, Module } from '@nestjs/common';
import { config } from '../../config';
import { FileKind } from '../../shared/lib/types/file-kind.enum';
import { enumKeys } from '../../shared/lib/utils/enumKeys';
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
    if (config.get('nodeEnv') === 'development') {
      new Logger('Files').log('Running in development mode, uploading to local file system.');
      const base = path.join(path.resolve('./'), config.get('uploadPath'));

      const dirs: Array<Promise<string | undefined>> = [];
      for (const value of enumKeys(FileKind))
        dirs.push(fs.mkdir(path.join(base, FileKind[value]), { recursive: true }));

      await Promise.all(dirs);
    }
  }
}
