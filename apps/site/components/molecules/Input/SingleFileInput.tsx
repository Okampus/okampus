// import ActionButton from '../Button/ActionButton';
import FileIcon from '../../atoms/Icon/FileIcon';

import { singleUploadMutation } from '@okampus/shared/graphql';
// import { ActionType } from '@okampus/shared/types';
import { bytes } from '@okampus/shared/utils';

import { useMutation } from '@apollo/client';
import { IconFileUpload } from '@tabler/icons-react';

import clsx from 'clsx';
import { forwardRef, useRef, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';

import type { Buckets, EntityName } from '@okampus/shared/enums';
import type { InputOptions } from '@okampus/shared/types';
import type { ChangeEvent } from 'react';

type ForwardRef = React.ForwardedRef<HTMLDivElement>;

const defaultAbort = () => {
  console.log('No abortHandler provided. Cannot abort!');
};

export type SingleFileInputProps = {
  onChange: (id: string | null) => void;
  uploadContext: { bucket: Buckets; entityName: EntityName; entityId?: string };
  options: InputOptions;
};
// eslint-disable-next-line react/display-name
export default forwardRef(({ onChange, options }: SingleFileInputProps, propRef: ForwardRef) => {
  const [, setAbort] = useState<() => void>(defaultAbort);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const onAbortPossible = (abortHandler: () => void) => setAbort(() => abortHandler);
  const onProgress = (event: ProgressEvent) => setProgress(Math.floor((event.loaded / event.total) * 10_000) / 100);
  const context = { fetchOptions: { credentials: 'include', useUpload: true, onAbortPossible, onProgress } };

  const [insertUpload] = useMutation(singleUploadMutation, { context });

  const uploadFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    const variables = { file: uploadedFile, ...options };
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
  // const variables = { object: uploadedFile };
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
      <FileIcon type={file.type} name={file.name} className="h-10" />
      <div>
        <div className="text-0 text-lg font-medium">{file.name}</div>
        <div className="text-2 text-base">
          {bytes(file.size)} — {progress} %
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-4 w-full">
      <IconFileUpload className="text-1 h-10 pb-0.5 shrink-0" />
      <div className="text-2 opacity-90 text-2 text-sm text-justify pr-2">
        Glissez-déposez ou cliquez pour ajouter un fichier {}
      </div>
    </div>
  );

  // const button =
  //   progress !== 0 &&
  //   (progress === 100 ? (
  //     <ActionButton
  //       className="z-20"
  //       action={{
  //         type: ActionType.Action,
  //         iconOrSwitch: <DeleteFilledIcon />,
  //         linkOrActionOrMenu: resetFile,
  //       }}
  //     />
  //   ) : (
  //     <ActionButton
  //       className="z-20"
  //       action={{
  //         type: ActionType.Action,
  //         iconOrSwitch: <CloseFilledicon />,
  //         linkOrActionOrMenu: () => (abort(), resetFile()),
  //       }}
  //     />
  //   ));

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
      {/* {button ? (
        <div className="flex gap-4">
          {button}
          <button className="button bg-3 text-1">Parcourir...</button>
        </div>
      ) : (
        <button className="button bg-3 text-1">Parcourir...</button>
      )} */}

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
