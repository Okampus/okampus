import { VideoUploadRepository } from './video-upload.repository';
import { FileUpload } from '../file-upload.entity';
import { Entity, Property } from '@mikro-orm/core';
// import { Paginated } from '@api/dal/shards/abstract/pagination';
import { FileUploadKind } from '@okampus/shared/enums';
import type { VideoUploadOptions } from './video-upload.options';

@Entity({ customRepository: () => VideoUploadRepository })
export class VideoUpload extends FileUpload {
  @Property({ type: 'int', nullable: true })
  duration: number | null = null;

  @Property({ type: 'smallint', nullable: true })
  width: number | null = null;

  @Property({ type: 'smallint', nullable: true })
  height: number | null = null;

  constructor(options: VideoUploadOptions) {
    super({ ...options, fileUploadKind: FileUploadKind.VideoUpload });
    this.assign(options);
  }
}
