import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { BaseFileEntity } from '@common/lib/entities/base-file-entity';
import { Team } from '@modules/org/teams/team.entity';
import { TeamEvent } from '@modules/plan/events/team-event.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';

@ObjectType()
@Entity()
export class TeamGallery extends BaseFileEntity {
  @Field(() => String)
  @PrimaryKey()
  id: string = nanoid(32);

  @Field(() => Team)
  @ManyToOne()
  team!: Team;

  @Field(() => TeamEvent, { nullable: true })
  @OneToOne({ type: TeamEvent, nullable: true, onDelete: 'CASCADE' })
  event: TeamEvent | null = null;

  @Field(() => Int)
  @Property()
  order: number;

  constructor(options: {
    team: Team;
    file: FileUpload;
    order: number;
    event?: TeamEvent | null;
    active?: boolean;
  }) {
    super();
    this.assign(options);
  }
}
