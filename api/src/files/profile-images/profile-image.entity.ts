import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { User } from '../../users/user.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class ProfileImage extends BaseEntity {
  @PrimaryKey()
  profileImageId: string = nanoid(32);

  @OneToOne({ onDelete: 'CASCADE' })
  file!: FileUpload;

  @ManyToOne({ onDelete: 'CASCADE' })
  user!: User;

  constructor(options: { user: User; file: FileUpload }) {
    super();
    this.file = options.file;
    this.user = options.user;
  }
}
