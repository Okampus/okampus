import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamFileType } from '../../shared/lib/types/enums/team-file-type.enum';
import { Team } from '../../teams/teams/team.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@ObjectType()
@Entity()
export class TeamFile extends BaseEntity {
  @Field(() => String)
  @PrimaryKey()
  id: string = nanoid(32);

  @Field(() => FileUpload)
  @OneToOne({ onDelete: 'CASCADE' })
  file!: FileUpload;

  @Field(() => Team)
  @ManyToOne()
  team!: Team;

  @Field(() => TeamFileType)
  @Enum(() => TeamFileType)
  type!: TeamFileType;

  @Field(() => String, { nullable: true })
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
