/* eslint-disable unicorn/explicit-length-check */
import { ReactComponent as UploadFileIcon } from '@okampus/assets/svg/icons/material/filled/upload.svg';
import { bytes, formatDateStandard } from '@okampus/shared/utils';
import { FileIcon } from '@okampus/ui/atoms';

import { useRef } from 'react';
import clsx from 'clsx';

import type { FileLike } from '@okampus/shared/types';
import type { ChangeEvent } from 'react';
import type { DocumentProps } from '@okampus/shared/dtos';

export type BaseDocumentType = DocumentProps & {
  createdAt: string;
  file: FileLike;
};

export type DocumentWithEdits = {
  current: BaseDocumentType;
  edits: BaseDocumentType[];
};

export type DocumentInputProps = {
  document?: DocumentWithEdits | null;
  onUpload?: (file: File) => void;
  onClick?: (document: DocumentWithEdits) => void;
};

export function DocumentInput({ document, onUpload, onClick }: DocumentInputProps) {
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
      onUpload?.(e.target.files[0]);
    }
  };

  return (
    <div
      className={clsx(
        'relative p-6 min-w-[20rem] h-[20rem] rounded-2xl flex flex-col gap-6 items-center bg-1 justify-center overflow-hidden',
        document ? 'border border-transparent hover:border-blue-500' : 'file-uploader'
      )}
      ref={wrapperRef}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => (document ? onClick?.(document) : fileInputRef.current?.click())}
    >
      <input
        ref={fileInputRef}
        type="file"
        value=""
        className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer z-0"
        onChange={onFileDrop}
      />
      {document ? (
        <>
          <div className="flex flex-col justify-center items-center grow gap-4 text-0">
            <FileIcon className="h-12 aspect-square" file={document.current.file} />
            <div className="text-0 font-bold text-lg text-center">{document.current.name}</div>
          </div>
          <div className="w-full flex flex-col gap-2 text-gray-400">
            {/* <div>Version {document.current.yearVersion ?? 'inconnue'}</div> */}
            <hr className="border-color-3 w-full" />
          </div>
          <div className="flex justify-between items-center gap-6 text-0 w-full">
            {document.current.file.size && (
              <div className="flex flex-col">
                <div className="text-2">Taille</div>
                <div className="whitespace-nowrap">{bytes(document.current.file.size)}</div>
              </div>
            )}
            <div className="flex flex-col items-end">
              {document.edits.length > 1 && <div className="text-blue-400">{document.edits.length} versions</div>}
              <div className="text-2">Dernière mise à jour</div>
              <div>{formatDateStandard(document.current.createdAt)}</div>
            </div>
            {/* <div className="flex flex-col">
              <div className="text-2">Créé</div>
              <div>{formatDate(document.current.createdAt)}</div>
            </div> */}
          </div>
        </>
      ) : (
        <>
          <UploadFileIcon height="72" className="text-0" />
          <div className="flex flex-col gap-2">
            <div className="text-1 text-lg font-medium">Glissez-déposez un document</div>
            <div className="px-8 mb-0.5 w-full flex items-center gap-1.5 text-sm text-2 opacity-50 before:h-[1px] before:flex-1 before:bg-gray-300 after:h-[1px] after:flex-1 after:bg-gray-300">
              OU
            </div>
            <button className="button bg-opposite text-opposite">Parcourir l'ordinateur...</button>
          </div>
        </>
      )}
    </div>
  );
}
