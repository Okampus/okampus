'use client';

import Field from '../Field';

import { getFileList } from '../../../../../utils/file/get-file-list';
import { useTranslation } from '../../../../_hooks/context/useTranslation';
import FileIcon from '../../../../_components/atoms/Icon/FileIcon';

import { sum } from '@okampus/shared/utils';

import { IconFileUpload, IconTrash } from '@tabler/icons-react';
import { mergeRefs } from 'react-merge-refs';
import { createRef, forwardRef, memo, useEffect, useState } from 'react';

import type { UncontrolledInput } from '@okampus/shared/types';

export type FileInputProps = { multiple?: boolean } & UncontrolledInput<FileList> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type' | 'className' | 'placeholder'>;

export default memo(
  forwardRef<HTMLInputElement, FileInputProps>(function FileInput(props, ref) {
    const { format } = useTranslation();
    const localRef = createRef<HTMLInputElement>();
    const [fileList, setFileList] = useState<FileList>(new FileList());

    useEffect(() => {
      if (props.defaultValue && localRef.current) {
        localRef.current.files = props.defaultValue;
        setFileList(props.defaultValue);
      }
    }, [props.defaultValue, localRef]);

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
      ...inputProps
    } = props;

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
          onChange?.(event);
          if (multiple) setFileList(getFileList([...fileList, ...(event.target.files ?? [])]));
          else if (event.target.files) setFileList(event.target.files);
        }}
        {...inputProps}
      />
    );

    const inner = (
      <div className="input">
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
          <IconFileUpload onClick={() => localRef.current?.click()} className="p-2 bg-[var(--bg-3)] text-0" />
        ) : (
          <IconTrash
            onClick={() => {
              setFileList(new FileList());
              if (localRef.current) localRef.current.files = new FileList();
            }}
            className="p-2 bg-[var(--bg-danger)] text-white"
          />
        )}
      </span>
    );

    // const selected = fileList.length > 0;
    // const inner = multiple && fileList.length > 1 ?
    //  <div>
    //     <span></span>
    //  </div> : fileList[0] ?
    //   <div>
    //     <span>{fileList[0].name}</span>
    //   </div> : <div className=''>
    //     <span></span>
    //   </div>;

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
