import { ContentRepository } from './content.repository';
import { Ugc } from '../ugc.entity';
import { ContentEdit } from '../../edit/content-edit/content-edit.entity';
import { Collection, Entity, ManyToMany, ManyToOne } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import { UgcKind } from '@okampus/shared/enums';

import { diffChars } from 'diff';

import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { ContentOptions } from './content.options';

@Entity({ customRepository: () => ContentRepository })
export class Content extends Ugc {
  @ManyToMany({ type: 'FileUpload' })
  @TransformCollection()
  attachments = new Collection<FileUpload>(this);

  @ManyToOne({ type: 'Ugc', nullable: true })
  parent: Ugc | null = null;

  constructor(options: ContentOptions) {
    super({ ...options, ugcKind: UgcKind.Content });
    this.assign({ ...options, ugcKind: UgcKind.Content });

    this.edits.add([
      new ContentEdit({
        newVersion: options.description,
        addedDiff: diffChars('', options.description),
        createdBy: options.createdBy,
        linkedUgc: this,
        tenant: options.tenant,
      }),
    ]);
  }
}
