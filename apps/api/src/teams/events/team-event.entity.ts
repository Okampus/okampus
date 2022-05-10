import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { User } from '../../users/user.entity';
import { Team } from '../teams/team.entity';

@Entity()
export class TeamEvent extends BaseEntity {
  @PrimaryKey()
  teamEventId!: number;

  @Property()
  start!: Date;

  @Property()
  end!: Date;

  @Property({ type: 'text' })
  shortDescription!: string;

  @Property({ type: 'text' })
  longDescription!: string;

  @Property()
  price = 0;

  @ManyToOne()
  createdBy!: User;

  @ManyToOne()
  @Index()
  team!: Team;

  @Property({ type: 'text' })
  place!: string;

  @Property({ type: 'text' })
  meetingPoint?: string;

  @ManyToOne()
  supervisor?: User;

  @Property()
  @Index()
  private = false;

  @Property({ type: 'text' })
  preconditions?: string;

  @Property({ type: 'text' })
  questionFallback?: string;

  @Property({ type: 'text' })
  link?: string;

  constructor(options: {
    start: Date;
    end: Date;
    shortDescription: string;
    longDescription: string;
    createdBy: User;
    team: Team;
    place: string;
    meetingPoint?: string;
    price?: number;
    supervisor?: User | null;
    private?: boolean;
    preconditions?: string;
    questionFallback?: string;
    link?: string;
  }) {
    super();
    this.start = options.start;
    this.end = options.end;
    this.shortDescription = options.shortDescription;
    this.longDescription = options.longDescription;
    this.createdBy = options.createdBy;
    this.team = options.team;
    this.place = options.place;

    if (options.meetingPoint)
      this.meetingPoint = options.meetingPoint;
    if (typeof options.price !== 'undefined')
      this.price = options.price;
    if (options.supervisor)
      this.supervisor = options.supervisor;
    if (typeof options.private !== 'undefined')
      this.private = options.private;
    if (options.preconditions)
      this.preconditions = options.preconditions;
    if (options.questionFallback)
      this.questionFallback = options.questionFallback;
    if (options.link)
      this.link = options.link;
  }

  public canEdit(user: User): boolean {
    return this.createdBy.userId === user.userId
      || this.supervisor?.userId === user.userId
      || this.team.canAdminister(user);
  }
}
