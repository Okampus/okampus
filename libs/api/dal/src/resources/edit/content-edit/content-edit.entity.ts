import { Edit } from '../edit.entity';
import { Entity, Property } from '@mikro-orm/core';
import { EditKind } from '@okampus/shared/enums';

import type { ContentEditOptions } from './content-edit.options';

@Entity()
export class ContentEdit extends Edit {
  @Property({ type: 'text' })
  newVersion!: string;

  @Property({ type: 'text', nullable: true })
  note: string | null = null;

  constructor(options: ContentEditOptions) {
    super({ ...options, editKind: EditKind.ContentEdit });
    this.assign({ ...options, editKind: EditKind.ContentEdit });
  }
}
