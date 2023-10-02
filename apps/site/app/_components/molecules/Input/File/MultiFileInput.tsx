import { ReactComponent as CloudIcon } from '@okampus/assets/svg/icons/cloud.svg';

import clsx from 'clsx';
import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';

type RenderedFile = {
  file: File;
  previewImageSrc: string;
  isImage: boolean;
};

type DropFileInputProps = {
  onFileAdd?: (files: RenderedFile[]) => void;
  onFileRemove?: (file: RenderedFile) => void;
  onFileClick?: (file: RenderedFile) => void;
};

export default function MultiFileInput({ onFileAdd, onFileRemove, onFileClick }: DropFileInputProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [renderedFileList, setRenderedFileList] = useState<RenderedFile[]>([]);

  const onDragEnter = () => {
    if (wrapperRef.current) wrapperRef.current.classList.add('dragover');
  };
  const onDragLeave = () => {
    if (wrapperRef.current) wrapperRef.current.classList.remove('dragover');
  };
  const onDrop = () => {
    if (wrapperRef.current) wrapperRef.current.classList.remove('dragover');
  };

  const onFileDrop = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log('TODO: update file list', renderedFileList);
      // const updatedList = [
      //   ...renderedFileList,
      //   ...[...e.target.files].map((file) => {
      //     const isImage = checkImage(file);
      //     return {
      //       file,
      //       isImage,
      //       previewImageSrc: isImage ? URL.createObjectURL(file) : getFileTypeIcon(file),
      //     };
      //   }),
      // ];
      // setRenderedFileList(updatedList);
      // onFileAdd?.(updatedList);
    }
  };

  const fileRemove = (file: RenderedFile) => {
    const updatedList = renderedFileList.filter((f) => f !== file);
    setRenderedFileList(updatedList);
    onFileRemove?.(file);
  };

  return (
    <div
      ref={wrapperRef}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={clsx('relative p-8 text-0 rounded-2xl bg-1', renderedFileList.length === 0 && 'file-uploader')}
    >
      <div className="relative text-center">{/* <p>Drag & Drop your files here</p> */}</div>
      <input
        type="file"
        value=""
        className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer"
        onChange={onFileDrop}
      />
      {renderedFileList.length > 0 ? (
        <div className="text-0">
          {/* <p>Ready to upload</p> */}
          <div className="flex flex-wrap gap-4">
            {renderedFileList.map((renderedFile, idx) => (
              <div key={idx}>{renderedFile.file.name}</div>
              // <FileItem
              //   onClick={() => onFileClick?.(renderedFile)}
              //   onRemove={() => {
              //     fileRemove(renderedFile);
              //   }}
              //   file={renderedFile.file}
              //   key={idx}
              // />
              // <ImageGradient
              //   onClick={() => onFileClick?.(renderedFile)}
              //   key={index}
              //   src={renderedFile.previewImageSrc}
              //   className={clsx('cursor-pointer', !renderedFile.isImage && 'bg-1 p-5')}
              // >
              //   <div className="flex gap-2.5 py-1.5 px-3 items-center">
              //     <div
              //       onClick={(e) => {
              //         fileRemove(renderedFile);
              //         e.stopPropagation();
              //       }}
              //       className="cursor-pointer p-1.5 outline outline-gray-200 flex-shrink-0 rounded-[50%]"
              //     >
              //       <CloseIcon height="17" className="text-white " />
              //     </div>
              //     {/* <div className="flex flex-col"> */}
              //     <div className="overflow-hidden whitespace-nowrap">
              //       <div className="text-white overflow-hidden text-ellipsis">{renderedFile.file.name}</div>
              //       <div className="text-gray-200 text-xs">{bytes(renderedFile.file.size)}</div>
              //     </div>
              //     {/* <div className="text-gray-200 text-xs">{file.size}</div>
              //             </div> */}
              //   </div>
              // </ImageGradient>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center text-0 flex-col gap-3">
          <CloudIcon className="text-1" height="78" />
          <div className="flex flex-col gap-2 items-center">
            <div className="text-1 text-lg font-medium">Glissez-déposez des fichiers ici</div>
            <div className="mb-0.5 w-full flex items-center gap-1.5 text-sm text-2 opacity-50 before:h-[1px] before:flex-1 before:bg-gray-300 after:h-[1px] after:flex-1 after:bg-gray-300">
              OU
            </div>
            <button className="button bg-opposite text-opposite">Parcourir...</button>
          </div>
        </div>
      )}
    </div>
  );
}
