import { ItemGroup } from './ItemGroup';
import { TagBadge } from '@okampus/ui/atoms';
import type { TagBadgeProps } from '@okampus/ui/atoms';

export type TagGroupProps = {
  tags: TagBadgeProps[];
  limit?: number;
  size?: number;
};

export function TagGroup({ tags, limit = 2, size = 14 }: TagGroupProps) {
  return (
    <ItemGroup
      className="flex gap-2.5 flex-wrap"
      title="Tags"
      items={tags}
      limit={limit}
      size={size}
      rounded={50}
      render={(item) => <TagBadge {...item} />}
      renderListElement={(item) => <TagBadge {...item} />}
      renderMore={(items) => <TagBadge label={`+${items}`} />}
    />
  );
}
