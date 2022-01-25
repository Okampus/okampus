import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToOne,
  PrimaryKey,
} from '@mikro-orm/core';
// eslint-disable-next-line import/no-cycle
import { Content } from '../../../contents/content.entity';
import type { User } from '../../../users/user.entity';
import { TransformCollection } from '../decorators/transform-collection.decorator';
import { ContentMasterType } from '../types/content-master-type.enum';
import { BaseEntity } from './base.entity';

@Entity({
  discriminatorColumn: 'kind',
  abstract: true,
})
export abstract class ContentMaster extends BaseEntity {
  @PrimaryKey()
  contentMasterId!: number;

  @OneToOne({ onDelete: 'CASCADE' })
  post?: Content;

  @ManyToMany()
  @TransformCollection()
  contributors = new Collection<User>(this);

  @Enum(() => ContentMasterType)
  kind: ContentMasterType;

  constructor(options: { post?: Content }) {
    super();
    if (options.post)
      this.post = options.post;
  }
}
