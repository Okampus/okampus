import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import type { Club } from '../../clubs/entities/club.entity';
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

  @ManyToOne({ onDelete: 'CASCADE' })
  club?: Club | null;

  constructor(options: { file: FileUpload; user?: User; team?: Team; club?: Club }) {
    super();
    this.file = options.file;
    if (options.user)
      this.user = options.user;
    if (options.team)
      this.team = options.team;
    if (options.club)
      this.club = options.club;
  }

  public isAvailableFor(type: 'club' | 'team' | 'user', id?: number | string): boolean {
    const isAvailable = !this.team && !this.user && !this.club;
    if (type === 'club' && id)
      return isAvailable || this.club?.clubId === id;

    if (type === 'team' && id)
      return isAvailable || this.team?.teamId === id;

    if (type === 'user' && id)
      return isAvailable || this.user?.userId === id;

    return isAvailable;
  }
}
