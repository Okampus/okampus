import { ItemGroup } from './ItemGroup';
import { Tag } from '@okampus/ui/atoms';
import type { TagItem } from '@okampus/ui/atoms';

export type TagGroupProps = {
  tags: TagItem[];
  limit?: number;
  size?: number;
};

export function TagGroup({ tags: users, limit = 2, size = 14 }: TagGroupProps) {
  return (
    <ItemGroup
      className="flex gap-1 flex-wrap"
      items={users}
      limit={limit}
      size={size}
      render={(item) => <Tag {...item} />}
      renderListElement={(item) => <Tag {...item} />}
      renderMore={(items) => <Tag label={`+${items}`} />}
    />
  );
}
