import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { BaseFileEntity } from '../../shared/lib/entities/base-file-entity';
import { TeamEvent } from '../../teams/events/team-event.entity';
import { Team } from '../../teams/teams/team.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@ObjectType()
@Entity()
export class TeamGallery extends BaseFileEntity {
  @Field(() => String)
  @PrimaryKey()
  id: string = nanoid(32);

  @Field(() => FileUpload)
  @OneToOne({ onDelete: 'CASCADE' })
  file!: FileUpload;

  @Field(() => Team)
  @ManyToOne()
  team!: Team;

  @Field(() => TeamEvent, { nullable: true })
  @OneToOne()
  event: TeamEvent | null = null;

  @Field(() => Int, { nullable: true })
  @Property()
  order: number;

  @Field(() => Int, { nullable: true })
  @Property()
  width: number;

  @Field(() => Int, { nullable: true })
  @Property()
  height: number;

  constructor(options: {
    team: Team;
    file: FileUpload;
    order: number;
    width: number;
    height: number;
    event?: TeamEvent | null;
    active?: boolean;
  }) {
    super();
    this.assign(options);
  }
}