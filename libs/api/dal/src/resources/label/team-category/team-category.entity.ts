
import { TeamCategoryRepository } from './team-category.repository';
import { Tag } from '../tag/tag.entity';
import { Collection, Entity, ManyToMany } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import type { TeamCategoryOptions } from './team-category.options';
import type { Team } from '../../org/team/team.entity';

@Entity({
  customRepository: () => TeamCategoryRepository,
})
export class TeamCategory extends Tag {
  @ManyToMany({ type: 'Team' })
  @TransformCollection()
  teams = new Collection<Team>(this);

  constructor(options: TeamCategoryOptions) {
    super(options);
    this.assign(options);
  }
}
