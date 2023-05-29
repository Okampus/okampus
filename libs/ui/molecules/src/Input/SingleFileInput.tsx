import { ActionButton } from '../Button/ActionButton';
import { ReactComponent as UploadOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/upload.svg';
import { ReactComponent as DeleteFilledIcon } from '@okampus/assets/svg/icons/material/filled/delete.svg';
import { ReactComponent as CloseFilledicon } from '@okampus/assets/svg/icons/material/filled/close.svg';

import { singleUploadMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';
import { bytes } from '@okampus/shared/utils';

import { FileIcon } from '@okampus/ui/atoms';

import { useMutation } from '@apollo/client';

import { clsx } from 'clsx';
import { forwardRef, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

import type { InputOptions } from '@okampus/shared/types';
import type { ChangeEvent } from 'react';

type ForwardRef = React.ForwardedRef<HTMLDivElement>;

const defaultAbort = () => {
  console.log('No abortHandler provided. Cannot abort!');
};

export type SingleFileInputProps = { onChange: (id: string | null) => void; options: InputOptions };
export const SingleFileInput = forwardRef(({ onChange, options }: SingleFileInputProps, propRef: ForwardRef) => {
  const [abort, setAbort] = useState<() => void>(defaultAbort);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const onAbortPossible = (abortHandler: () => void) => setAbort(() => abortHandler);
  const onProgress = (event: ProgressEvent) => setProgress(Math.floor((event.loaded / event.total) * 10_000) / 100);
  const context = { fetchOptions: { credentials: 'include', useUpload: true, onAbortPossible, onProgress } };
  const [insertUpload] = useMutation(singleUploadMutation, { context });

  const uploadFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    const variables = { insert: uploadedFile };
    insertUpload({ variables, onCompleted: ({ singleUpload }) => onChange(singleUpload?.id as string) });
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resetFile = () => {
    onChange(null);
    setFile(null);
    setProgress(0);
    fileInputRef.current && (fileInputRef.current.value = '');
  };

  // const onUpload = (uploadedFile: File | null) => {
  //   if (uploadedFile) {
  // setFile(uploadedFile);
  // const variables = { insert: uploadedFile };
  // insertUpload({ variables, onCompleted: ({ singleUpload }) => onChange(singleUpload?.id as string) });
  //   } else {
  //     onChange(null);
  //     setFile(null);
  //   }
  // };

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const refs = mergeRefs([wrapperRef, propRef]);

  const onDragEnter = () => wrapperRef.current && wrapperRef.current.classList.add('dragover');
  const onDragLeave = () => wrapperRef.current && wrapperRef.current.classList.remove('dragover');
  const onDrop = () => wrapperRef.current && wrapperRef.current.classList.remove('dragover');

  const onFileDrop = (e: ChangeEvent<HTMLInputElement>) =>
    e.target.files && e.target.files.length > 0 && uploadFile(e.target.files[0]);

  const hiddenInputClass = 'absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer z-10';
  // const wrapperClass = clsx('relative h-24 w-full bg-1 rounded-2xl flex items-center px-8', value && 'file-uploader');
  const wrapperClass = clsx('relative input !h-fit !px-4 !py-4 justify-between gap-8');

  const innerRender = file ? (
    <div className="flex gap-4">
      <FileIcon file={file} className="h-14" />
      <div>
        <div className="text-0 text-lg font-medium">{file.name}</div>
        <div className="text-2 text-base">
          {bytes(file.size)} — {progress} %
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-4 w-full">
      <UploadOutlinedIcon className="text-0 h-14 pb-0.5" />
      <div className="text-1 text-lg font-medium opacity-90">Glissez-déposez ou cliquez pour ajouter un fichier</div>
    </div>
  );

  const button =
    progress !== 0 &&
    (progress === 100 ? (
      <ActionButton
        className="z-20"
        action={{
          type: ActionType.Action,
          iconOrSwitch: <DeleteFilledIcon />,
          linkOrActionOrMenu: resetFile,
        }}
      />
    ) : (
      <ActionButton
        className="z-20"
        action={{
          type: ActionType.Action,
          iconOrSwitch: <CloseFilledicon />,
          linkOrActionOrMenu: () => (abort(), resetFile()),
        }}
      />
    ));

  const wrapper = (
    <div className={wrapperClass} ref={refs} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop}>
      <input
        ref={fileInputRef}
        type="file"
        className={hiddenInputClass}
        onChange={onFileDrop}
        id={options.name}
        name={options.name}
      />
      {innerRender}
      {button ? (
        <div className="flex gap-4">
          {button}
          <button className="button bg-3 text-1">Parcourir l'ordinateur...</button>
        </div>
      ) : (
        <button className="button bg-3 text-1">Parcourir l'ordinateur...</button>
      )}

      <div className="absolute bottom-0 left-0 h-1 w-full z-20">
        <div className="h-full bg-[var(--success)]" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );

  return options.label ? (
    <label htmlFor={options.name}>
      <span className="font-medium text-1 text-lg opacity-90 flex px-2.5 mb-2">
        {options.label}
        {options.required && <span className="text-red-500">*</span>}
      </span>
      {wrapper}
    </label>
  ) : (
    wrapper
  );
});
