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
import { BaseFileEntity } from '../../shared/lib/entities/base-file-entity';
import { TeamFileType } from '../../shared/lib/types/enums/team-file-type.enum';
import { Team } from '../../teams/teams/team.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@ObjectType()
@Entity()
export class TeamFile extends BaseFileEntity {
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

  @Field(() => String)
  @Property({ type: 'text' })
  specialType: string | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  description: string | null = null;

  constructor(options: {
    team: Team;
    file: FileUpload;
    type: string;
    specialType?: string | null;
    description?: string | null;
    active?: boolean;
  }) {
    console.log('options', options);
    super();
    this.assign(options);
  }
}
