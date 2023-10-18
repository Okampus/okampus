'use client';

/* eslint-disable @next/next/no-img-element */
import ZoomCropper from './ZoomCropper';

// import { ActionType } from '@okampus/shared/types';
// import { dataURItoBlob } from '@okampus/shared/utils';

// import { useEffect, useRef, useState } from 'react';
// import { Cropper, CircleStencil, RectangleStencil } from 'react-advanced-cropper';

// import type { EntityNames, S3BucketNames } from '@okampus/shared/enums';
import NextForm from '../../../../app/_forms/NextForm/NextForm';
import { upload } from '../../../../server/actions/upload';

import { useRef } from 'react';

import type { CropperRef } from 'react-advanced-cropper';

export type ImageCropperEditorProps = {
  src: string;
  // entityName: EntityNames;
  // bucket: S3BucketNames;
  aspectRatio?: number;
  isCircleStencil?: boolean;
  onCancel?: () => void;
  // onUploaded: OnUploaded;
  // showPreview?: boolean;
};

// TODO: TEMP
export default function ImageCropperEditor({
  src,
  // entityName,
  // bucket,
  aspectRatio,
  isCircleStencil,
  // showPreview = true,
  onCancel, // onUploaded,
}: ImageCropperEditorProps) {
  // const [abort, setAbort] = useState<(() => void) | null>(null);
  // const [upload, setUpload] = useState<((file: File) => void) | null>(null);
  // const [progress, setProgress] = useState(0);
  // const [preview, setPreview] = useState<string | null>(null);

  const cropperRef = useRef<CropperRef>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // const { tenant } = useTenant();
  // // const { data, isLoading } = trpcClient.getPresignedUrls.useQuery({
  // //   count: 1,
  // //   bucket,
  // //   entityName,
  // //   tenantScopeId: tenant.id,
  // // });

  // useEffect(() => {
  //   // const presignedUrl = data?.[0];
  //   // if (presignedUrl) {
  //   //   const [xhr, upload] = initUploadRequest({ presignedUrl, onUploaded, setProgress });

  //   //   setAbort(() => xhr.abort);
  //   //   setUpload(() => upload);

  //   //   return () => {
  //   //     xhr.abort(); // Clean up the XHR request if the component unmounts
  //   //   };
  //   // }

  //   return () => {};
  // }, [data, onUploaded]);

  // aspectRatio = isCircleStencil ? 1 : aspectRatio ?? 1;

  // setTimeout(() => setPreview(cropperRef.current?.getCanvas()?.toDataURL() ?? null), 200);
  // const uploadButton = (
  //   <ActionButton
  //     // isLoading={isLoading}
  //     action={{
  //       label: 'Sélectionner',
  //       type: ActionType.Success,
  //       linkOrActionOrMenu: () => {
  //         const canvas = cropperRef.current?.getCanvas();
  //         if (!canvas || !upload) return;

  //         const fileBits = [dataURItoBlob(canvas.toDataURL('image/webp'))];
  //         const file = new File(fileBits, 'image.webp', { type: 'image/webp' });

  //         upload?.(file);
  //       },
  //     }}
  //   />
  // );

  return (
    <NextForm
      action={upload}
      className="w-full max-w-[26rem] flex flex-col gap-6"
      render={() => (
        <>
          <input ref={fileRef} type="file" name="file" hidden={true} />
          <ZoomCropper ref={cropperRef} aspectRatio={isCircleStencil ? 1 : aspectRatio ?? 1} src={src} />
          {/* {onCancel ? (
            <div className="grid grid-cols-2 gap-5">
              <ActionButton
                action={{
                  label: 'Annuler',
                  linkOrActionOrMenu: () => {
                    if (progress !== 100) abort?.();
                    onCancel();
                  },
                }}
              />
              {uploadButton}
            </div>
          ) : (
            uploadButton
          )} */}
        </>
      )}
    />
  );
}
