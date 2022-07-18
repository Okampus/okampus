import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
// Import { Expose } from 'class-transformer';
// import { TEAMFORM_TEAM_INCLUDED } from '../../shared/lib/constants';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { User } from '../../users/user.entity';
import { Team } from '../teams/team.entity';

@Entity()
export class TeamForm extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property({ type: 'text' })
  description?: string;

  @Property({ type: 'json' })
  form!: object;

  @ManyToOne()
  createdBy!: User;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  // @Expose({ groups: [TEAMFORM_TEAM_INCLUDED] })
  team!: Team;

  @Property()
  isTemplate: boolean;

  constructor(options: {
    name: string;
    form: object;
    isTemplate: boolean;
    createdBy: User;
    team: Team;
    description?: string;
  }) {
    super();
    this.name = options.name;
    this.form = options.form;
    this.createdBy = options.createdBy;
    this.team = options.team;
    this.isTemplate = options.isTemplate;

    if (options.description)
      this.description = options.description;
  }
}
