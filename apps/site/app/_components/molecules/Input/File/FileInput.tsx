'use client';

import Field from '../Field';
import FileIcon from '../../../../_components/atoms/Icon/FileIcon';

import { useTranslation } from '../../../../_hooks/context/useTranslation';

// import { trpcClient } from '../../../../_context/trpcClient';
import { useTenant } from '../../../../_context/navigation';
// import { initUploadRequest } from '../../../../../utils/xhr-upload';
import { sum } from '@okampus/shared/utils';

// import { S3BucketNames } from '@okampus/shared/enums';
import { FileArrowUp, Trash } from '@phosphor-icons/react';

import clsx from 'clsx';
import { mergeRefs } from 'react-merge-refs';
import {
  createRef,
  forwardRef,
  memo,
  // useEffect,
  useState,
} from 'react';

import type { ControlledInput } from '@okampus/shared/types';
import type { EntityNames } from '@okampus/shared/enums';

export type FileInputProps = ControlledInput<string | null> & {
  entityName: EntityNames;
  onChange: (fileUploadId: string | null) => void;
  multiple?: boolean;
  className?: string;
};

// TODO: TEMP
// TODO: use JSON payload to contain fileUploadId, but also filename, size, type, etc.
export default memo(
  forwardRef<HTMLInputElement, FileInputProps>(function FileInput(props, ref) {
    const { format } = useTranslation();
    const localRef = createRef<HTMLInputElement>();
    const [fileList, setFileList] = useState<FileList>(new FileList());

    const [abort, setAbort] = useState<(() => void) | null>(null);
    const [upload, setUpload] = useState<((file: File) => void) | null>(null);
    const [progress, setProgress] = useState(0);

    const { tenant } = useTenant();

    // const { data, isLoading } = trpcClient.getPresignedUrls.useQuery({
    //   count: 1,
    //   bucket: S3BucketNames.Attachments,
    //   entityName: props.entityName,
    //   tenantScopeId: tenant.id,
    // });

    const {
      multiple,
      name,
      onChange,
      error,
      info,
      loading,
      className,
      label,
      disabled,
      required,
      description,
      value,
      ...inputProps
    } = props;

    // useEffect(() => {
    //   const presignedUrl = data?.[0];
    //   if (presignedUrl) {
    //     const [xhr, upload] = initUploadRequest({
    //       presignedUrl,
    //       onUploaded: (data) => {
    //         if (!data) return onChange(null);
    //         return onChange(data.fileUploadId);
    //       },
    //       setProgress,
    //     });

    //     setAbort(() => xhr.abort);
    //     setUpload(() => upload);

    //     return () => {
    //       xhr.abort(); // Clean up the XHR request if the component unmounts
    //     };
    //   }

    //   return () => {};
    // }, [data, onChange]);

    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = e.dataTransfer.files;
      if (upload && droppedFiles.length > 0) {
        upload(droppedFiles[0]);
      }
    };

    const input = (
      <input
        ref={mergeRefs([ref, localRef])}
        name={name}
        disabled={disabled}
        // eslint-disable-next-line jsx-a11y/aria-props
        aria-description={description}
        aria-invalid={typeof error === 'string'}
        className="hidden"
        onChange={(event) => {
          if (!upload || !event.target.files) {
            event.target.files = new FileList();
            return;
          }
          upload(event.target.files[0]);
        }}
        {...inputProps}
      />
    );

    // TODO: refactor UI & add progress bar
    const inner = (
      <div
        className={clsx('input', isDragging ? 'border-blue-400' : 'border-dashed')}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {fileList.length === 0 ? (
          <span className="label-title">Ajouter un fichier</span>
        ) : multiple ? (
          <>
            <span className="label-title">{fileList.length} fichiers sélectionnés</span>
            <span className="text-sm">{format('byte', sum([...fileList].map((file) => file.size)))}</span>
          </>
        ) : (
          <>
            <FileIcon name={fileList[0].name} type={fileList[0].type} className="h-4 w-4" />
            <span className="text-sm">{format('byte', fileList[0].size)}</span>
            <span className="label-title">{fileList[0].name}</span>
          </>
        )}
      </div>
    );

    const outer = (
      <span className="flex items-stretch">
        {input}
        {inner}
        {multiple || fileList.length === 0 ? (
          <FileArrowUp onClick={() => localRef.current?.click()} className="p-2 bg-[var(--bg-3)] text-0" />
        ) : (
          <Trash
            onClick={() => {
              setFileList(new FileList());
              if (localRef.current) localRef.current.files = new FileList();
            }}
            className="p-2 bg-[var(--bg-danger)] text-white"
          />
        )}
      </span>
    );

    const fieldProps = { label, className, name, description, required, error, info, loading };
    return multiple ? (
      <div>
        <Field {...fieldProps}>{outer}</Field>
        {[...fileList].map((file, idx) => (
          <div key={idx} className="flex items-stretch">
            <FileIcon name={file.name} type={file.type} />
            <div>
              <span className="label-title">{file.name}</span>
              <span className="text-sm">{format('byte', file.size)}</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <Field {...fieldProps}>{outer}</Field>
    );
  }),
);
