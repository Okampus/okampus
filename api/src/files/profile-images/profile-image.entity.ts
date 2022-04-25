import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import type { Team } from '../../teams/entities/team.entity';
import type { User } from '../../users/user.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class ProfileImage extends BaseEntity {
  @PrimaryKey()
  profileImageId: string = nanoid(32);

  @OneToOne({ onDelete: 'CASCADE' })
  file!: FileUpload;

  @ManyToOne({ onDelete: 'CASCADE' })
  user?: User | null;

  @ManyToOne({ onDelete: 'CASCADE' })
  team?: Team | null;

  constructor(options: { file: FileUpload; user?: User; team?: Team }) {
    super();
    this.file = options.file;
    if (options.user)
      this.user = options.user;
    if (options.team)
      this.team = options.team;
  }

  public isAvailableFor(type: 'team' | 'user', id?: number | string): boolean {
    const isAvailable = !this.team && !this.user;
    if (type === 'team' && id)
      return isAvailable || this.team?.teamId === id;

    if (type === 'user' && id)
      return isAvailable || this.user?.userId === id;

    return isAvailable;
  }
}
