import FileIcon from '../../../atoms/Icon/FileIcon';
import ActionButton from '../../Button/ActionButton';

import { bytes } from '@okampus/shared/utils';
import { singleUploadMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import { useMutation } from '@apollo/client';
import { IconTrash, IconUpload, IconX } from '@tabler/icons-react';

import clsx from 'clsx';
import { useRef, useState } from 'react';
import type { Buckets, EntityName } from '@okampus/shared/enums';

import type { ChangeEvent } from 'react';

const defaultAbort = () => console.log('No abortHandler provided. Cannot abort!');

export type DocumentInputProps = {
  onChange: (id: string | null, file: File | null) => void;
  uploadContext: { bucket: Buckets; entityName: EntityName; entityId?: string };
  disabled?: boolean;
};
export default function DocumentInput({ onChange, uploadContext }: DocumentInputProps) {
  const [abort, setAbort] = useState<() => void>(defaultAbort);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const onAbortPossible = (abortHandler: () => void) => setAbort(() => abortHandler);
  const onProgress = (event: ProgressEvent) => setProgress(Math.floor((event.loaded / event.total) * 10_000) / 100);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onDragEnter = () => wrapperRef.current?.classList.add('dragover');
  const onDragLeave = () => wrapperRef.current?.classList.remove('dragover');
  const onDrop = () => wrapperRef.current?.classList.remove('dragover');

  const context = { fetchOptions: { credentials: 'include', useUpload: true, onAbortPossible, onProgress } };
  const [insertUpload] = useMutation(singleUploadMutation, { context });

  const uploadFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    const variables = { file: uploadedFile, ...uploadContext };
    insertUpload({ variables, onCompleted: ({ singleUpload }) => onChange(singleUpload?.id as string, uploadedFile) });
  };

  const onFileDrop = (e: ChangeEvent<HTMLInputElement>) =>
    e.target.files && e.target.files.length > 0 && uploadFile(e.target.files[0]);

  const resetFile = () => {
    onChange(null, null);
    setFile(null);
    setProgress(0);
    fileInputRef.current && (fileInputRef.current.value = '');
  };

  const button =
    progress !== 0 &&
    (progress === 100 ? (
      <ActionButton
        className="z-20"
        action={{
          type: ActionType.Action,
          iconOrSwitch: <IconTrash />,
          linkOrActionOrMenu: resetFile,
        }}
      />
    ) : (
      <ActionButton
        className="z-20"
        action={{
          type: ActionType.Action,
          iconOrSwitch: <IconX />,
          linkOrActionOrMenu: () => (abort(), resetFile()),
        }}
      />
    ));

  return (
    <div
      className={clsx(
        'relative p-5 h-[35rem] aspect-square rounded-sm flex flex-col gap-6 items-center bg-1 justify-center overflow-hidden',
        document ? 'border border-transparent hover:border-blue-500' : 'file-uploader'
      )}
      ref={wrapperRef}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer z-0"
        onChange={onFileDrop}
      />
      {file ? (
        <div className="w-full flex flex-col gap-4 text-gray-400" onClick={(e) => e.stopPropagation()}>
          <embed src={URL.createObjectURL(file)} className="z-20 rounded-lg h-[27rem] object-cover" />
          {/* <div>Version {document.current.yearVersion ?? 'inconnue'}</div> */}
          <hr className="border-color-3 w-full" />
          <div className="shrink-0 w-full flex gap-6 justify-between">
            <div className="min-w-0 flex gap-4">
              <FileIcon type={file.type} name={file.name} className="h-14" />
              <div className="overflow-hidden">
                <div className="text-0 text-lg font-medium line-clamp-1">{file.name}</div>
                <div className="text-2 text-base">
                  {bytes(file.size)} — {progress} %
                </div>
              </div>
            </div>
            {button}
          </div>

          <div className="absolute bottom-0 left-0 h-[3px] w-full z-20">
            <div className="h-full bg-[var(--success)]" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      ) : (
        <>
          <IconUpload height="72" className="text-0" />
          <div className="flex flex-col gap-2">
            <div className="text-1 text-lg font-medium">Glissez-déposez un document</div>
            <div className="px-8 mb-0.5 w-full flex items-center gap-1.5 text-sm text-2 opacity-50 before:h-[1px] before:flex-1 before:bg-gray-300 after:h-[1px] after:flex-1 after:bg-gray-300">
              OU
            </div>
            <button className="button bg-opposite text-opposite">Parcourir l&apos;ordinateur...</button>
          </div>
        </>
      )}
    </div>
  );
}
