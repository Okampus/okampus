import { ReactComponent as UploadFileicon } from '@okampus/assets/svg/icons/outlined/upload.svg';
import { ReactComponent as CloseIcon } from '@okampus/assets/svg/icons/close.svg';
import { FileTypeIcon } from '@okampus/ui/atoms';
import { bytes } from '@okampus/shared/utils';

import React, { useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import clsx from 'clsx';

import type { ChangeEvent } from 'react';

export type SingleFileInputProps = {
  value: File | null;
  onChange: (file: File | null) => void;
};

export function SingleFileInputInner(
  { value, onChange }: SingleFileInputProps,
  propRef: React.ForwardedRef<HTMLDivElement>
) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      onChange(e.target.files[0]);
    }
  };

  return (
    <div
      className={clsx('relative h-24 w-full bg-1 rounded-2xl flex items-center px-8', value ? '' : 'file-uploader')}
      ref={mergeRefs([wrapperRef, propRef])}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        value=""
        className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer z-0"
        onChange={onFileDrop}
      />
      {value ? (
        <div className="flex justify-between w-full">
          <div className="relative flex gap-6 z-10">
            <FileTypeIcon size={24} file={value} />
            <div>
              <div className="text-2 text-lg font-medium">{value.name}</div>
              <div className="text-1 text-sm">{bytes(value.size)}</div>
            </div>
          </div>
          <div className="relative z-10 hover:bg-gray-700 p-0.5 rounded-lg h-fit cursor-pointer">
            <CloseIcon height="36" className="text-red-600" onClick={() => onChange(null)} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-4 w-full">
          <UploadFileicon height="42" className="text-0" />
          <div className="text-2 text-lg font-medium">
            Glissez-déposez un document ou{' '}
            <span
              className="relative text-blue-400 hover:underline cursor-pointer z-10"
              onClick={() => fileInputRef.current?.click()}
            >
              séléctionnez un fichier
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export const SingleFileInput = React.forwardRef(SingleFileInputInner);
