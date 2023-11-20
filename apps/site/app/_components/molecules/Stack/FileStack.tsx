import Stack from './Stack';
import FileIcon from '../../atoms/Icon/FileIcon';
import FilePreviewer from '../../organisms/FilePreviewer';
import { useBottomSheet } from '../../../_hooks/context/useBottomSheet';

import type { ExternalFile } from '@okampus/shared/types';

export type FileStackProps = {
  files: (File | ExternalFile)[];
  limit?: number;
  size?: number;
};

export default function FileStack({ files, limit = 3, size = 10 }: FileStackProps) {
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  return (
    <Stack
      className="space-x-[-0.5rem]"
      items={files}
      limit={limit}
      render={(file) => {
        return (
          <div
            onClick={() =>
              openBottomSheet({
                node: <FilePreviewer file={file} onClose={closeBottomSheet} />,
                header: `Aperçu de ${file.name}`,
              })
            }
          >
            <FileIcon
              type={file.type}
              name={file.name}
              className="aspect-square"
              style={{ height: `${size / 4}rem` }}
            />
          </div>
        );
      }}
    />
  );
}
