import FileIcon from '../../../atoms/Icon/FileIcon';
import ActionButton from '../../Button/ActionButton';

import { initUploadRequest } from '../../../../../utils/xhr-upload';

import { ActionType } from '@okampus/shared/types';
import { bytes } from '@okampus/shared/utils';

import { Trash, Upload, X } from '@phosphor-icons/react';

import clsx from 'clsx';
import { useRef, useState, useEffect } from 'react';

import type { PresignedUrl } from '@okampus/shared/types';
import type { ChangeEvent } from 'react';

export type DocumentInputProps = {
  presignedUrl: PresignedUrl;
  onUploaded: (data: (PresignedUrl & { fileUploadId: string }) | null) => void;
  disabled?: boolean;
};

export default function DocumentInput({ onUploaded, presignedUrl }: DocumentInputProps) {
  const [abort, setAbort] = useState<(() => void) | null>(null);
  const [upload, setUpload] = useState<((file: File) => void) | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const [xhr, upload] = initUploadRequest({ presignedUrl, onUploaded, setProgress });
    setAbort(() => xhr.abort);
    setUpload(() => upload);

    return () => {
      xhr.abort(); // Clean up the XHR request if the component unmounts
    };
  }, [presignedUrl, onUploaded]);

  const onDragEnter = () => wrapperRef.current?.classList.add('dragover');
  const onDragLeave = () => wrapperRef.current?.classList.remove('dragover');
  const onDrop = () => wrapperRef.current?.classList.remove('dragover');

  const onFileDrop = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && upload) {
      setFile(selectedFile);
      upload(selectedFile);
    }
  };

  const resetFile = () => {
    if (progress !== 100) abort?.();
    onUploaded(null);
    setFile(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const button = (
    <ActionButton
      className="z-20"
      action={{
        type: ActionType.Action,
        iconOrSwitch: progress === 100 ? <Trash /> : <X />,
        linkOrActionOrMenu: resetFile,
      }}
    />
  );

  return (
    <div
      className={clsx(
        'relative p-5 h-[35rem] w-full max-w-[35rem] rounded-sm flex flex-col gap-6 items-center bg-1 justify-center overflow-hidden',
        file ? 'border border-transparent hover:border-blue-500' : 'file-uploader',
      )}
      onClick={() => fileInputRef.current?.click()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      ref={wrapperRef}
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
          <hr className="border-[var(--border-3)] w-full" />
          <div className="shrink-0 w-full flex gap-6 justify-between">
            <div className="min-w-0 flex gap-4">
              <FileIcon type={file.type} name={file.name} className="h-14" />
              <div className="overflow-hidden">
                <div className="text-0 text-lg font-medium line-clamp-1">{file.name}</div>
                <div className="text-2 text-base">
                  {bytes(file.size)} — {progress.toFixed(2)} %
                </div>
              </div>
            </div>
            {button}
          </div>

          <div className="absolute bottom-0 left-0 h-[3px] w-full z-20">
            <div className="h-full bg-[var(--success)]" style={{ width: `${progress.toFixed(2)}%` }}></div>
          </div>
        </div>
      ) : (
        <>
          <Upload height="72" className="text-0" />
          <div className="flex flex-col gap-2">
            <div className="text-1 text-lg font-medium">Glissez-déposez un document</div>
            <div className="px-8 mb-0.5 w-full flex items-center gap-1.5 text-sm text-2 opacity-50 before:h-[1px] before:flex-1 before:bg-gray-300 after:h-[1px] after:flex-1 after:bg-gray-300">
              OU
            </div>
            <button className="button bg-opposite text-opposite">Parcourir...</button>
          </div>
        </>
      )}
    </div>
  );
}

// import FileIcon from '../../../atoms/Icon/FileIcon';
// import ActionButton from '../../Button/ActionButton';

// import { bytes } from '@okampus/shared/utils';
// import { ActionType, PresignedUrl } from '@okampus/shared/types';

// import { Trash, Upload, X } from '@phosphor-icons/react/dist/ssr';

// import clsx from 'clsx';
// import { useRef, useState } from 'react';
// import type { BucketNames } from '@prisma/client';

// import {
//   useInsertFollowMutation,
//   type InsertSingleUploadMutationVariables,
//   useInsertFileUploadMutation,
// } from '@okampus/shared/graphql';
// import type { ChangeEvent } from 'react';
// import { getS3Url } from 'apps/site/utils/s3/get-s3-url';

// const defaultAbort = () => console.log('No abortHandler provided. Cannot abort!');

// export type DocumentInputProps = {
//   presignedUrl: PresignedUrl;
//   onChange: (data: PresignedUrl & { fileUploadId: string } | null) => void;
//   disabled?: boolean;
// };

// export default function DocumentInput({ onChange, presignedUrl }: DocumentInputProps) {
//   const [abort, setAbort] = useState<() => void>(defaultAbort);
//   const [file, setFile] = useState<File | null>(null);
//   const [progress, setProgress] = useState<number>(0);

//   const onAbortPossible = (abortHandler: () => void) => setAbort(() => abortHandler);
//   const onProgress = (event: ProgressEvent) => setProgress(Math.floor((event.loaded / event.total) * 10_000) / 100);

//   const wrapperRef = useRef<HTMLDivElement | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const onDragEnter = () => wrapperRef.current?.classList.add('dragover');
//   const onDragLeave = () => wrapperRef.current?.classList.remove('dragover');
//   const onDrop = () => wrapperRef.current?.classList.remove('dragover');

//   const [insertFileUpload] = useInsertFileUploadMutation();

//   const uploadFile = async (uploadedFile: File) => {
//     try {
//       const response = await fetch(presignedUrl.url, {
//         method: 'PUT',
//         body: file,
//         headers: {
//           'Content-Type': uploadedFile.type,
//         },
//       });

//       if (response.ok) {
//         insertFileUpload({
//           variables: { object: { name: uploadedFile.name, type: uploadedFile.type, url: getS3Url(presignedUrl)  } },
//           onCompleted: ({ insertFileUploadOne }) => {
//             if (!insertFileUploadOne) return;
//             onChange({ ...presignedUrl, fileUploadId: insertFileUploadOne.id }),
//           }
//         });
//       } else {
//         // Handle the error here
//         console.error('Upload failed:', response.statusText);
//         setFile(null);
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       setFile(null);
//     }
//   };

//   const onFileDrop = (e: ChangeEvent<HTMLInputElement>) =>
//     e.target.files && e.target.files.length > 0 && uploadFile(e.target.files[0]);

//   const resetFile = () => {
//     onChange(null, null);
//     setFile(null);
//     setProgress(0);
//     fileInputRef.current && (fileInputRef.current.value = '');
//   };

//   const button =
//     progress !== 0 &&
//     (progress === 100 ? (
//       <ActionButton
//         className="z-20"
//         action={{
//           type: ActionType.Action,
//           iconOrSwitch: <Trash />,
//           linkOrActionOrMenu: resetFile,
//         }}
//       />
//     ) : (
//       <ActionButton
//         className="z-20"
//         action={{
//           type: ActionType.Action,
//           iconOrSwitch: <X />,
//           linkOrActionOrMenu: () => (abort(), resetFile()),
//         }}
//       />
//     ));

//   return (
//     <div
//       className={clsx(
//         'relative p-5 h-[35rem] w-full max-w-[35rem] rounded-sm flex flex-col gap-6 items-center bg-1 justify-center overflow-hidden',
//         document ? 'border border-transparent hover:border-blue-500' : 'file-uploader',
//       )}
//       ref={wrapperRef}
//       onDragEnter={onDragEnter}
//       onDragLeave={onDragLeave}
//       onDrop={onDrop}
//       onClick={() => fileInputRef.current?.click()}
//     >
//       <input
//         ref={fileInputRef}
//         type="file"
//         className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer z-0"
//         onChange={onFileDrop}
//       />
//       {file ? (
//         <div className="w-full flex flex-col gap-4 text-gray-400" onClick={(e) => e.stopPropagation()}>
//           <embed src={URL.createObjectURL(file)} className="z-20 rounded-lg h-[27rem] object-cover" />
//           {/* <div>Version {document.current.yearVersion ?? 'inconnue'}</div> */}
//           <hr className="border-[var(--border-3)] w-full" />
//           <div className="shrink-0 w-full flex gap-6 justify-between">
//             <div className="min-w-0 flex gap-4">
//               <FileIcon type={file.type} name={file.name} className="h-14" />
//               <div className="overflow-hidden">
//                 <div className="text-0 text-lg font-medium line-clamp-1">{file.name}</div>
//                 <div className="text-2 text-base">
//                   {bytes(file.size)} — {progress} %
//                 </div>
//               </div>
//             </div>
//             {button}
//           </div>

//           <div className="absolute bottom-0 left-0 h-[3px] w-full z-20">
//             <div className="h-full bg-[var(--success)]" style={{ width: `${progress}%` }}></div>
//           </div>
//         </div>
//       ) : (
//         <>
//           <Upload height="72" className="text-0" />
//           <div className="flex flex-col gap-2">
//             <div className="text-1 text-lg font-medium">Glissez-déposez un document</div>
//             <div className="px-8 mb-0.5 w-full flex items-center gap-1.5 text-sm text-2 opacity-50 before:h-[1px] before:flex-1 before:bg-gray-300 after:h-[1px] after:flex-1 after:bg-gray-300">
//               OU
//             </div>
//             <button className="button bg-opposite text-opposite">Parcourir...</button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
