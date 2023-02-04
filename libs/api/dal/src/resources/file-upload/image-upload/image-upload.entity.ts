import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';
import { FileUpload } from '../file-upload.entity';
import type { ImageUploadOptions } from './image-upload.options';
import { FileUploadKind } from '@okampus/shared/enums';

import { ImageUploadRepository } from './image-upload.repository';

@Entity({ customRepository: () => ImageUploadRepository })
export class ImageUpload extends FileUpload {
  [EntityRepositoryType]!: ImageUploadRepository;

  @Property({ type: 'smallint', nullable: true })
  width: number | null = null;

  @Property({ type: 'smallint', nullable: true })
  height: number | null = null;

  constructor(options: ImageUploadOptions) {
    super({ ...options, fileUploadKind: FileUploadKind.ImageUpload });
    this.assign(options);
  }
}
