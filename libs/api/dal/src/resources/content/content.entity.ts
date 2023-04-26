import { ContentEdit } from './content-edit/content-edit.entity';
import { TenantScopedEntity } from '../tenant-scoped.entity';

import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';

import { diffChars } from 'diff';

import type { Team } from '../team/team.entity';
import type { Favorite } from './favorite/favorite.entity';
import type { Upload } from '../upload/upload';
import type { ContentOptions } from './content.options';
import type { Reaction } from './reaction/reaction.entity';
import type { Report } from './report/report.entity';
import type { Vote } from './vote/vote.entity';
import type { Event } from '../event/event.entity';

@Entity()
export class Content extends TenantScopedEntity {
  @Property({ type: 'text' })
  text!: string;

  @Property({ type: 'boolean' })
  isAnonymous = false;

  @ManyToMany({ type: 'Upload' })
  @TransformCollection()
  attachments = new Collection<Upload>(this);

  @ManyToOne({ type: 'Content', nullable: true, default: null })
  parent: Content | null = null;

  @OneToMany({ type: 'Content', mappedBy: 'parent' })
  @TransformCollection()
  children = new Collection<Content>(this);

  @OneToMany({ type: 'Vote', mappedBy: 'content' })
  @TransformCollection()
  votes = new Collection<Vote>(this);

  @OneToMany({ type: 'Report', mappedBy: 'content' })
  @TransformCollection()
  reports = new Collection<Report>(this);

  @OneToMany({ type: 'Favorite', mappedBy: 'content' })
  @TransformCollection()
  favorites = new Collection<Favorite>(this);

  @OneToMany({ type: 'Reaction', mappedBy: 'content' })
  @TransformCollection()
  reactions = new Collection<Reaction>(this);

  @OneToMany({ type: 'ContentEdit', mappedBy: 'content' })
  @TransformCollection()
  edits = new Collection<ContentEdit>(this);

  @ManyToMany({ type: 'Team' })
  @TransformCollection()
  representingTeams = new Collection<Team>(this);

  @ManyToOne({ type: 'Event', nullable: true, default: null })
  event: Event | null = null;

  constructor(options: ContentOptions) {
    super(options);
    this.assign(options);

    this.edits.add([
      new ContentEdit({
        content: this,
        newVersion: options.text,
        addedDiff: diffChars('', options.text),
        createdBy: options.createdBy,
        tenant: options.tenant,
      }),
    ]);
  }
}
