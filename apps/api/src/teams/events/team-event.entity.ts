import {
  Cascade,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamEventState } from '../../shared/lib/types/enums/team-event-state.enum';
import { User } from '../../users/user.entity';
import type { TeamForm } from '../forms/team-form.entity';
import { Team } from '../teams/team.entity';

@Entity()
export class TeamEvent extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  start!: Date;

  @Property()
  end!: Date;

  @Property()
  name!: string;

  @Property({ type: 'text' })
  description!: string;

  @Property()
  price = 0;

  @ManyToOne()
  createdBy!: User;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  team!: Team;

  @Property({ type: 'text' })
  place!: string;

  @ManyToOne()
  supervisor?: User;

  @Property()
  @Index()
  private = false;

  @Enum({ items: () => TeamEventState, default: TeamEventState.Published })
  state = TeamEventState.Published;

  @OneToOne({ cascade: [Cascade.ALL] })
  form?: TeamForm | null = null;

  @ManyToOne()
  usedTemplate?: TeamEvent | null = null;

  @Property({ type: 'json' })
  meta: object = {};

  constructor(options: {
    start: Date;
    end: Date;
    name: string;
    description: string;
    createdBy: User;
    team: Team;
    place: string;
    usedTemplate?: TeamEvent;
    meta?: object;
    form?: TeamForm;
    state?: TeamEventState;
    price?: number;
    supervisor?: User;
    private?: boolean;
  }) {
    super();
    this.start = options.start;
    this.end = options.end;
    this.name = options.name;
    this.description = options.description;
    this.createdBy = options.createdBy;
    this.team = options.team;
    this.place = options.place;

    if (options.usedTemplate)
      this.usedTemplate = options.usedTemplate;
    if (options.meta)
      this.meta = options.meta;
    if (options.form)
      this.form = options.form;
    if (options.state)
      this.state = options.state;
    if (typeof options.price !== 'undefined')
      this.price = options.price;
    if (options.supervisor)
      this.supervisor = options.supervisor;
    if (typeof options.private !== 'undefined')
      this.private = options.private;
  }

  public canEdit(user: User): boolean {
    return this.createdBy.id === user.id
      || this.supervisor?.id === user.id
      || this.team.canAdminister(user);
  }
}
