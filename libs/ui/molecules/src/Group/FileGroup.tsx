import { ItemGroup } from './ItemGroup';
import { FileIcon } from '@okampus/ui/atoms';
import { useContext } from 'react';
import { NavigationContext } from '@okampus/ui/hooks';

import type { FileLike } from '@okampus/shared/types';

export type FileGroupProps = {
  files: FileLike[];
  limit?: number;
  size?: number;
};

export function FileGroup({ files, limit = 3, size = 14 }: FileGroupProps) {
  const { previewFile } = useContext(NavigationContext);

  return (
    <ItemGroup
      className="space-x-[-0.5rem]"
      items={files}
      limit={limit}
      size={size}
      rounded={12}
      render={(file) => {
        return (
          <div onClick={() => previewFile(file)}>
            <FileIcon file={file} className="h-12 aspect-square" />
          </div>
        );
      }}
    />
  );
}
