import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { Paginated } from '@common/modules/pagination';
import { BaseFileEntity } from '@lib/entities/base-file.entity';
import { TeamFileType } from '@lib/types/enums/team-file-type.enum';
import { Team } from '@teams/team.entity';
import type { FileUpload } from '@upload/file-uploads/file-upload.entity';

@ObjectType()
@Entity()
export class TeamFile extends BaseFileEntity {
  @Field(() => String)
  @PrimaryKey()
  id: string = nanoid(32);

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
    super();
    this.assign(options);
  }
}

@ObjectType()
export class PaginatedTeamFile extends Paginated(TeamFile) {}
