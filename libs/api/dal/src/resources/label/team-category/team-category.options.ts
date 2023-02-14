import type { TeamCategoryProps } from '@okampus/shared/dtos';
import type { Team } from '../../org/team/team.entity';
import type { TagOptions } from '../tag/tag.options';

export type TeamCategoryOptions = TeamCategoryProps &
  TagOptions & {
    teams?: Team[];
  };
