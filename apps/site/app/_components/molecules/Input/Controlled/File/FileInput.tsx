'use client';

import Field from '../../Field';

import { xhrUploadFile as upload } from '../../../../../../utils/xhr-upload';

import { PercentProgress } from '../../../../atoms/Decoration/PercentProgress';
import { formatFileSize } from '../../../../../../utils/format/format-file-size';
import { MAX_FILE_SIZE } from '@okampus/shared/consts';

import { FileArrowUp, FileText, Paperclip, Trash } from '@phosphor-icons/react';
import clsx from 'clsx';
import { useLocale } from 'next-intl';

import { useRef, forwardRef, memo, useState } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Controller } from 'react-hook-form';

import type { S3BucketNames } from '@okampus/shared/enums';
import type { ControlledInput } from '@okampus/shared/types';
import type { Locale } from '../../../../../../server/ssr/getLang';
// import type { ControlledInput } from '@okampus/shared/types';

export type FileInputProps = ControlledInput<bigint, false> & {
  domain: string;
  bucketName: S3BucketNames;
  className?: string;
  allowedFormats?: string[];
};

type OnChangeFactoryOptions = {
  onUpload: (file: File) => void;
  localRef: React.MutableRefObject<HTMLInputElement | undefined>;
};
const onChangeFactory =
  ({ onUpload, localRef }: OnChangeFactoryOptions) =>
  (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    onUpload(event.target.files[0]);
    if (localRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(event.target.files[0]);
      localRef.current.files = dataTransfer.files;
    }
  };

type InputState = { error: string | null; file: File | null; isDragging: boolean; progress: number };

type FileInputInnerProps = {
  onUpload: (file: File) => void;
  input: React.ReactNode;
  inputState: InputState;
  setInputState: React.Dispatch<React.SetStateAction<InputState>>;
  localRef: React.MutableRefObject<HTMLInputElement | undefined>;
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
};

const iconClassName = 'h-8 w-8 p-2 border border-[var(--border-1)]';
function FileInputInner({
  onUpload,
  input,
  inputState,
  setInputState,
  localRef,
  handleDragEnter,
  handleDragLeave,
  handleDrop,
}: FileInputInnerProps) {
  const locale = useLocale() as Locale;

  const icon = inputState.file ? <FileText className={iconClassName} /> : <Paperclip className={iconClassName} />;
  const name = inputState.file ? inputState.file.name : 'Ajouter un fichier (cliquer ou glisser)';
  const subtitle = inputState.file
    ? formatFileSize(locale, inputState.file.size)
    : `Taille max. ${formatFileSize(locale, MAX_FILE_SIZE)}`;

  return (
    <span className="flex items-stretch">
      {input}
      <div
        className={clsx('input', inputState.isDragging ? 'border-blue-400' : 'border-dashed')}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {icon}
        <div>
          <span className="hover:underline text-0">{name}</span>
          {inputState.progress > 0 ? (
            <PercentProgress value={inputState.progress} />
          ) : (
            <span className="text-sm font-medium text-2">{subtitle}</span>
          )}
        </div>
      </div>
      {inputState.file ? (
        <FileArrowUp
          onClick={() => localRef.current?.click()}
          className="h-10 w-10 p-2 hover:bg-[var(--bg-3)] rounded-lg text-0"
        />
      ) : (
        <Trash
          onClick={() => {
            if (localRef.current) localRef.current.files = new FileList();
            setInputState((state) => ({ ...state, file: null }));
          }}
          className="h-10 w-10 p-2 hover:bg-[var(--bg-3)] text-0 rounded-lg"
        />
      )}
    </span>
  );
}

// TODO: use JSON payload to contain fileUploadId, but also filename, size, type, etc.

const initialState = { error: null, file: null, isDragging: false, progress: 0 };
export default memo(
  forwardRef<HTMLInputElement, FileInputProps>(function FileInput(props, ref) {
    const localRef = useRef<HTMLInputElement>();

    const [inputState, setInputState] = useState<InputState>(initialState);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setInputState((state) => ({ ...state, isDragging: true }));
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setInputState((state) => ({ ...state, isDragging: false }));
    };

    const onProgress = (progress: number) => setInputState((state) => ({ ...state, progress }));
    const onError = (error: Error) => setInputState((state) => ({ ...state, error: error.message }));

    const a11yProps = { 'aria-invalid': typeof inputState.error === 'string', 'aria-description': props.description };
    const inputProps = { className: 'hidden', ref: mergeRefs([ref, localRef]), ...a11yProps };

    const handleDropFactory = (onUpload: (file: File) => void) => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setInputState((state) => ({ ...state, isDragging: false }));
      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) onUpload(droppedFiles[0]);
    };

    if (props.control) {
      const { control, name, bucketName, domain, disabled, ...otherProps } = props;
      return (
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange } }) => {
            const onUploaded = (fileUploadId: string) => onChange(BigInt(fileUploadId));
            const onUpload = (file: File) => upload({ file, onProgress, onError, onUploaded, bucketName, domain });
            const input = (
              <input {...inputProps} disabled={disabled} onChange={onChangeFactory({ onUpload, localRef })} />
            );

            const handleDrop = handleDropFactory(onUpload);
            const innerProps = { onUpload, input, localRef, handleDragEnter, handleDragLeave, handleDrop };
            return (
              <Field {...otherProps}>
                <FileInputInner {...{ ...innerProps, inputState, setInputState }} />
              </Field>
            );
          }}
        />
      );
    }

    const { onChange, bucketName, domain, disabled, ...otherProps } = props;
    const onUploaded = (fileUploadId: string) => onChange(BigInt(fileUploadId));
    const onUpload = (file: File) => upload({ file, onProgress, onError, onUploaded, bucketName, domain });
    const input = <input {...inputProps} disabled={disabled} onChange={onChangeFactory({ onUpload, localRef })} />;

    const handleDrop = handleDropFactory(onUpload);
    const innerProps = { onUpload, input, localRef, handleDragEnter, handleDragLeave, handleDrop };

    return (
      <Field {...otherProps}>
        <FileInputInner {...{ ...innerProps, inputState, setInputState }} />
      </Field>
    );
  }),
);
