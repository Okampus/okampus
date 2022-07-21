import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { AnnouncementState } from '../shared/lib/types/enums/announcement-state.enum';
import { User } from '../users/user.entity';

@Entity()
export class Announcement extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property({ type: 'text' })
  shortDescription!: string;

  @Property({ type: 'text' })
  longDescription?: string;

  @Enum(() => AnnouncementState)
  state: AnnouncementState = AnnouncementState.Draft;

  @Property()
  displayFrom: Date;

  @Property()
  displayUntil: Date;

  @Property({ type: 'smallint' })
  priority!: number;

  @ManyToOne()
  createdBy!: User;

  constructor(options: {
    title: string;
    shortDescription: string;
    createdBy: User;
    priority: number;
    displayFrom: Date;
    displayUntil: Date;
    state?: AnnouncementState;
    longDescription?: string;
  }) {
    super();
    this.title = options.title;
    this.shortDescription = options.shortDescription;
    this.createdBy = options.createdBy;
    this.priority = options.priority;
    this.displayFrom = options.displayFrom;
    this.displayUntil = options.displayUntil;

    if (options.state)
      this.state = options.state;
    if (options.longDescription)
      this.longDescription = options.longDescription;
  }
}
