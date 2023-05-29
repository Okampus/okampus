import { bytes, checkImage, downloadFile } from '@okampus/shared/utils';
import { getFileTypeIcon, GradientImage } from '@okampus/ui/atoms';
import { ReactComponent as CloseIcon } from '@okampus/assets/svg/icons/close.svg';
import { ReactComponent as DownloadIcon } from '@okampus/assets/svg/icons/download.svg';

import clsx from 'clsx';
import { motion } from 'framer-motion';

export type FileCardPreviewProps = {
  file: File;
  isImage?: boolean;
  previewImageSrc?: string;
  className?: string;
  onRemove?: (file?: File) => void;
  onClick?: (file?: File) => void;
};

export function FileItem({ file, isImage, previewImageSrc, onRemove, onClick }: FileCardPreviewProps) {
  isImage = isImage ?? checkImage(file);
  previewImageSrc = previewImageSrc ?? (isImage ? URL.createObjectURL(file) : getFileTypeIcon(file));

  return (
    <GradientImage
      onClick={() => onClick?.(file)}
      src={previewImageSrc}
      className={clsx('cursor-pointer border border-color-2 relative min-h-[8rem]', !isImage && 'bg-1 p-9')}
    >
      <div className="relative flex gap-2.5 py-1.5 px-3 items-center z-10">
        {onRemove && (
          <div
            onClick={(e) => {
              onRemove(file);
              e.stopPropagation();
            }}
            className="cursor-pointer p-1.5 outline outline-1 outline-gray-200 flex-shrink-0 rounded-[50%] bg-black"
          >
            <CloseIcon height="16" className="text-white" />
          </div>
        )}
        <div className="overflow-hidden whitespace-nowrap">
          <div className="text-white overflow-hidden text-ellipsis">{file.name}</div>
          <div className="text-gray-200 text-xs">{bytes(file.size)}</div>
        </div>
      </div>
      <motion.div
        className="absolute w-full h-full top-0 bg-gray-500 rounded-lg"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        <div className="absolute bottom-2 left-4 flex gap-2">
          <div
            className="w-9 h-7 rounded-lg bg-gray-800 hover:bg-gray-600 flex items-center justify-center"
            onClick={() => downloadFile(file)}
          >
            <DownloadIcon className="m-2" />
          </div>
          {/* <div className="w-9 h-7 rounded-lg bg-gray-800 hover:bg-gray-600 flex items-center justify-center">
            <DownloadIcon className="m-2" />
          </div>
          <div className="w-9 h-7 rounded-lg bg-gray-800 hover:bg-gray-600 flex items-center justify-center">
            <DownloadIcon className="m-2" />
          </div> */}
        </div>
      </motion.div>
    </GradientImage>
  );
}
