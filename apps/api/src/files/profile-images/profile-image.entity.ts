import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import type { Team } from '../../teams/teams/team.entity';
import type { User } from '../../users/user.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class ProfileImage extends BaseEntity {
  @PrimaryKey()
  id: string = nanoid(32);

  @OneToOne({ onDelete: 'CASCADE' })
  file!: FileUpload;

  @ManyToOne({ onDelete: 'CASCADE' })
  user: User | null = null;

  @ManyToOne({ onDelete: 'CASCADE' })
  team: Team | null = null;

  constructor(options: {
    file: FileUpload;
    user?: User | null;
    team?: Team | null;
  }) {
    super();
    this.assign(options);
  }

  public isAvailableFor(type: 'team' | 'user', id?: number | string): boolean {
    const isAvailable = !this.team && !this.user;
    if (type === 'team' && id)
      return isAvailable || this.team?.id === id;

    if (type === 'user' && id)
      return isAvailable || this.user?.id === id;

    return isAvailable;
  }
}
