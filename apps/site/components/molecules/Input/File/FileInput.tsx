'use client';

import Field from '../Field';

import { getFileList } from '../../../../utils/file/get-file-list';
import { useTranslation } from '../../../../hooks/context/useTranslation';
import FileIcon from '../../../../components/atoms/Icon/FileIcon';

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

    //   return (
    //     <Field {...fieldProps}>
    //       <div className="flex items-stretch">
    //         {input}
    //         {/* {fileList.length > 0 && (

    // )} */}
    //       </div>
    //     </Field>
    //   );
  })
);

// // import ActionButton from '../Button/ActionButton';
// import FileIcon from '../../../atoms/Icon/FileIcon';

// import { singleUploadMutation } from '@okampus/shared/graphql';
// // import { ActionType } from '@okampus/shared/types';
// import { bytes } from '@okampus/shared/utils';

// import { useMutation } from '@apollo/client';
// import { IconFileUpload } from '@tabler/icons-react';

// import clsx from 'clsx';
// import { forwardRef, useRef, useState } from 'react';
// import { mergeRefs } from 'react-merge-refs';

// import type { Buckets, EntityName } from '@okampus/shared/enums';
// import type { ChangeEvent } from 'react';

// type ForwardRef = React.ForwardedRef<HTMLDivElement>;

// const defaultAbort = () => {
//   console.log('No abortHandler provided. Cannot abort!');
// };

// export type SingleFileInputProps = {
//   onChange: (id: string | null) => void;
//   uploadContext: { bucket: Buckets; entityName: EntityName; entityId?: string };
//   options: InputOptions;
// };
// // eslint-disable-next-line react/display-name
// export default forwardRef(({ onChange, options }: SingleFileInputProps, propRef: ForwardRef) => {
//   const [, setAbort] = useState<() => void>(defaultAbort);
//   const [file, setFile] = useState<File | null>(null);
//   const [progress, setProgress] = useState<number>(0);

//   const onAbortPossible = (abortHandler: () => void) => setAbort(() => abortHandler);
//   const onProgress = (event: ProgressEvent) => setProgress(Math.floor((event.loaded / event.total) * 10_000) / 100);
//   const context = { fetchOptions: { credentials: 'include', useUpload: true, onAbortPossible, onProgress } };

//   const [insertUpload] = useMutation(singleUploadMutation, { context });

//   const uploadFile = (uploadedFile: File) => {
//     setFile(uploadedFile);
//     const variables = { file: uploadedFile, ...options };
//     insertUpload({ variables, onCompleted: ({ singleUpload }) => onChange(singleUpload?.id as string) });
//   };

//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const resetFile = () => {
//     onChange(null);
//     setFile(null);
//     setProgress(0);
//     fileInputRef.current && (fileInputRef.current.value = '');
//   };

//   // const onUpload = (uploadedFile: File | null) => {
//   //   if (uploadedFile) {
//   // setFile(uploadedFile);
//   // const variables = { object: uploadedFile };
//   // insertUpload({ variables, onCompleted: ({ singleUpload }) => onChange(singleUpload?.id as string) });
//   //   } else {
//   //     onChange(null);
//   //     setFile(null);
//   //   }
//   // };

//   const wrapperRef = useRef<HTMLDivElement | null>(null);
//   const refs = mergeRefs([wrapperRef, propRef]);

//   const onDragEnter = () => wrapperRef.current && wrapperRef.current.classList.add('dragover');
//   const onDragLeave = () => wrapperRef.current && wrapperRef.current.classList.remove('dragover');
//   const onDrop = () => wrapperRef.current && wrapperRef.current.classList.remove('dragover');

//   const onFileDrop = (e: ChangeEvent<HTMLInputElement>) =>
//     e.target.files && e.target.files.length > 0 && uploadFile(e.target.files[0]);

//   const hiddenInputClass = 'absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer z-10';
//   // const wrapperClass = clsx('relative h-24 w-full bg-1 rounded-2xl flex items-center px-8', value && 'file-uploader');
//   const wrapperClass = clsx('relative input !h-fit !px-4 !py-4 justify-between gap-8');

//   const innerRender = file ? (
//     <div className="flex gap-4">
//       <FileIcon type={file.type} name={file.name} className="h-10" />
//       <div>
//         <div className="text-0 text-lg font-medium">{file.name}</div>
//         <div className="text-2 text-base">
//           {bytes(file.size)} — {progress} %
//         </div>
//       </div>
//     </div>
//   ) : (
//     <div className="flex items-center gap-4 w-full">
//       <IconFileUpload className="text-1 h-10 pb-0.5 shrink-0" />
//       <div className="text-2 opacity-90 text-2 text-sm text-justify pr-2">
//         Glissez-déposez ou cliquez pour ajouter un fichier {}
//       </div>
//     </div>
//   );

//   // const button =
//   //   progress !== 0 &&
//   //   (progress === 100 ? (
//   //     <ActionButton
//   //       className="z-20"
//   //       action={{
//   //         type: ActionType.Action,
//   //         iconOrSwitch: <DeleteFilledIcon />,
//   //         linkOrActionOrMenu: resetFile,
//   //       }}
//   //     />
//   //   ) : (
//   //     <ActionButton
//   //       className="z-20"
//   //       action={{
//   //         type: ActionType.Action,
//   //         iconOrSwitch: <CloseFilledicon />,
//   //         linkOrActionOrMenu: () => (abort(), resetFile()),
//   //       }}
//   //     />
//   //   ));

//   const wrapper = (
//     <div className={wrapperClass} ref={refs} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop}>
//       <input
//         ref={fileInputRef}
//         type="file"
//         className={hiddenInputClass}
//         onChange={onFileDrop}
//         id={options.name}
//         name={options.name}
//       />
//       {innerRender}
//       {/* {button ? (
//         <div className="flex gap-4">
//           {button}
//           <button className="button bg-3 text-1">Parcourir...</button>
//         </div>
//       ) : (
//         <button className="button bg-3 text-1">Parcourir...</button>
//       )} */}

//       <div className="absolute bottom-0 left-0 h-1 w-full z-20">
//         <div className="h-full bg-[var(--success)]" style={{ width: `${progress}%` }}></div>
//       </div>
//     </div>
//   );

//   return options.label ? (
//     <label htmlFor={options.name}>
//       <span className="font-medium text-1 text-lg opacity-90 flex px-2.5 mb-2">
//         {options.label}
//         {options.required && <span className="text-red-500">*</span>}
//       </span>
//       {wrapper}
//     </label>
//   ) : (
//     wrapper
//   );
// });
