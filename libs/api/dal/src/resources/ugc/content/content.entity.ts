import { Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import { UgcKind } from '@okampus/shared/enums';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import { Ugc } from '../ugc.entity';
import type { ContentOptions } from './content.options';

import { ContentRepository } from './content.repository';

@Entity({
  customRepository: () => ContentRepository,
})
export class Content extends Ugc {
  @Property({ type: 'text' })
  text!: string;

  @ManyToMany({ type: 'FileUpload' })
  @TransformCollection()
  attachments = new Collection<FileUpload>(this);

  @ManyToOne({ type: 'Ugc', nullable: true })
  parent: Ugc | null = null;

  constructor(options: ContentOptions) {
    super({ ...options, ugcKind: UgcKind.Content });
    this.assign({ ...options, ugcKind: UgcKind.Content });
  }
}
