import { ItemGroup } from './ItemGroup';
import { FileTypeIcon } from '@okampus/ui/atoms';
import type { FileLike } from '@okampus/shared/types';

export type FileGroupProps = {
  files: FileLike[];
  limit?: number;
  size?: number;
};

export function FileGroup({ files, limit = 3, size = 14 }: FileGroupProps) {
  return (
    <ItemGroup
      className="space-x-[-0.5rem]"
      items={files}
      limit={limit}
      size={size}
      render={(file) => {
        return <FileTypeIcon file={file} size={size} />;
      }}
    />
  );
}
