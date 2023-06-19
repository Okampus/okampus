import { TenantScopedEntity } from '../tenant-scoped.entity';

import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';

import type { Team } from '../team/team.entity';
import type { Favorite } from './favorite/favorite.entity';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { ContentOptions } from './content.options';
import type { Reaction } from './reaction/reaction.entity';
import type { Report } from './report/report.entity';
import type { Vote } from './vote/vote.entity';

@Entity()
export class Content extends TenantScopedEntity {
  @Property({ type: 'text' })
  text!: string;

  @Property({ type: 'boolean' })
  isAnonymous = false;

  @ManyToMany({ type: 'FileUpload' })
  @TransformCollection()
  attachments = new Collection<FileUpload>(this);

  @ManyToOne({ type: 'Content', nullable: true, default: null })
  parent: Content | null = null;

  @ManyToOne({ type: 'Content', nullable: true, default: null })
  replyingTo: Content | null = null;

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

  @ManyToOne({ type: 'Team' })
  @TransformCollection()
  team: Team | null = null;

  constructor(options: ContentOptions) {
    super(options);
    this.assign(options);
  }
}
