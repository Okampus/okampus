import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { nanoid } from 'nanoid';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamFileType } from '../../shared/lib/types/enums/team-file-type.enum';
import { Team } from '../../teams/teams/team.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@Entity()
export class TeamFile extends BaseEntity {
  @PrimaryKey()
  id: string = nanoid(32);

  @OneToOne({ onDelete: 'CASCADE' })
  file!: FileUpload;

  @ManyToOne()
  team!: Team;

  @Enum(() => TeamFileType)
  type!: TeamFileType;

  @Property({ type: 'text' })
  description?: string;

  constructor(options: {
    team: Team;
    file: FileUpload;
    type: TeamFileType;
    description?: string;
  }) {
    super();
    this.file = options.file;
    this.team = options.team;
    this.type = options.type;
    if (options.description)
      this.description = options.description;
  }
}
