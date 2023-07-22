import Group from './Group';
import FileIcon from '../Icon/FileIcon';
import FilePreviewer from '../../organisms/FilePreviewer';
import { useBottomSheet } from '../../../hooks/context/useBottomSheet';

import type { FileLike } from '@okampus/shared/types';

export type FileGroupProps = {
  files: FileLike[];
  limit?: number;
  size?: number;
};

export default function FileGroup({ files, limit = 3, size = 10 }: FileGroupProps) {
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  return (
    <Group
      className="space-x-[-0.5rem]"
      items={files}
      limit={limit}
      size={size}
      rounded={12}
      render={(file) => {
        return (
          <div onClick={() => openBottomSheet(<FilePreviewer file={file} onClose={closeBottomSheet} />)}>
            <FileIcon file={file} className="aspect-square" style={{ height: `${size / 4}rem` }} />
          </div>
        );
      }}
    />
  );
}
