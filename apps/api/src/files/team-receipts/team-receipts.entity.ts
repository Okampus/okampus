import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { BaseFileEntity } from '../../shared/lib/entities/base-file-entity';
import { Team } from '../../teams/teams/team.entity';
import { User } from '../../users/user.entity';
import { FileUpload } from '../file-uploads/file-upload.entity';

@ObjectType()
@Entity()
export class TeamReceipt extends BaseFileEntity {
  @Field(() => String)
  @PrimaryKey()
  id: string = nanoid(32);

  @Field(() => FileUpload)
  @OneToOne({ onDelete: 'CASCADE' })
  file!: FileUpload;

  @Field(() => Team)
  @ManyToOne()
  team!: Team;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  description: string | null = null;

  @Field(() => GraphQLISODateTime)
  @Property({ type: 'date' })
  payedAt: Date;

  @Field(() => User)
  @ManyToOne()
  payedBy: User;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text' })
  paymentLocation: string;

  constructor(options: {
    team: Team;
    file: FileUpload;
    description?: string | null;
    payedAt?: Date;
    payedBy?: Date;
    paymentLocation?: string | null;
    active?: boolean;
  }) {
    super();
    this.assign(options);
  }
}
