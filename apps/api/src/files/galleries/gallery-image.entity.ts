import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { Team } from '../../teams/teams/team.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class GalleryImage extends BaseEntity {
  @PrimaryKey()
  galleryImageId: string = nanoid(32);

  @OneToOne({ onDelete: 'CASCADE' })
  file!: FileUpload;

  @ManyToOne()
  team!: Team;

  @Property({ type: 'text' })
  caption?: string;

  constructor(options: {
    team: Team;
    file: FileUpload;
    caption?: string;
  }) {
    super();
    this.file = options.file;
    this.team = options.team;
    if (options.caption)
      this.caption = options.caption;
  }
}
