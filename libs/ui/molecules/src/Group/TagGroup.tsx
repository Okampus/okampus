import { ItemGroup } from './ItemGroup';
import { Tag } from '@okampus/ui/atoms';
import type { TagItem } from '@okampus/ui/atoms';

export type TagGroupProps = {
  tags: TagItem[];
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
      render={(item) => <Tag {...item} />}
      renderListElement={(item) => <Tag {...item} />}
      renderMore={(items) => <Tag label={`+${items}`} />}
    />
  );
}
