import ActionButton from '../Button/ActionButton';

import { useTenant } from '../../../../app/_context/navigation';
import { trpcClient } from '../../../_context/trpcClient';
import { initUploadRequest } from '../../../../utils/xhr-upload';

import { ActionType } from '@okampus/shared/types';
import { dataURItoBlob } from '@okampus/shared/utils';

import { useEffect, useRef, useState } from 'react';
import { Cropper, CircleStencil, RectangleStencil } from 'react-advanced-cropper';

import type { OnUploaded } from '../../../../utils/xhr-upload';
import type { EntityNames, S3BucketNames } from '@okampus/shared/enums';
import type { CropperRef } from 'react-advanced-cropper';

export type ImageCropperProps = {
  src: string;
  entityName: EntityNames;
  bucket: S3BucketNames;
  aspectRatio?: number;
  isCircleStencil?: boolean;
  onCancel?: () => void;
  onUploaded: OnUploaded;
  showPreview?: boolean;
};

export default function ImageCropper({
  src,
  entityName,
  bucket,
  aspectRatio,
  isCircleStencil,
  onCancel,
  onUploaded,
  showPreview,
}: ImageCropperProps) {
  const [abort, setAbort] = useState<(() => void) | null>(null);
  const [upload, setUpload] = useState<((file: File) => void) | null>(null);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);

  const cropperRef = useRef<CropperRef>(null);

  const { tenant } = useTenant();
  const { data, isLoading } = trpcClient.getPresignedUrls.useQuery({
    count: 1,
    bucket,
    entityName,
    tenantScopeId: tenant.id,
  });

  useEffect(() => {
    const presignedUrl = data?.[0];
    if (presignedUrl) {
      const [xhr, upload] = initUploadRequest({ presignedUrl, onUploaded, setProgress });

      setAbort(() => xhr.abort);
      setUpload(() => upload);

      return () => {
        xhr.abort(); // Clean up the XHR request if the component unmounts
      };
    }

    return () => {};
  }, [data, onUploaded]);

  useEffect(() => {
    if (src) setPreview(src);
  });

  aspectRatio = isCircleStencil ? 1 : aspectRatio ?? 1;
  const borderRadius = isCircleStencil ? '50%' : '0.5rem';

  setTimeout(() => setPreview(cropperRef.current?.getCanvas()?.toDataURL() ?? null), 200);
  const uploadButton = (
    <ActionButton
      isLoading={isLoading}
      action={{
        label: 'Sélectionner',
        type: ActionType.Success,
        linkOrActionOrMenu: () => {
          const canvas = cropperRef.current?.getCanvas();
          if (!canvas || !upload) return;

          const fileBits = [dataURItoBlob(canvas.toDataURL('image/webp'))];
          const file = new File(fileBits, 'image.webp', { type: 'image/webp' });

          upload?.(file);
        },
      }}
    />
  );

  return (
    <div className="w-full max-w-[26rem] flex flex-col gap-6">
      <div className="flex gap-6 justify-center">
        <Cropper
          ref={cropperRef}
          src={src}
          onUpdate={(data) => setPreview(data.getCanvas()?.toDataURL() ?? null)}
          className="rounded-2xl overflow-hidden"
          aspectRatio={{ maximum: aspectRatio, minimum: aspectRatio }}
          stencilProps={{ aspectRatio }}
          stencilComponent={isCircleStencil ? CircleStencil : RectangleStencil}
        />
        {showPreview && (
          <div className="flex flex-col gap-4 items-start shrink-0">
            {preview && (
              <>
                <img src={preview} alt="preview" style={{ aspectRatio, borderRadius, height: '1rem' }} />
                <img src={preview} alt="preview" style={{ aspectRatio, borderRadius, height: '2rem' }} />
                <img src={preview} alt="preview" style={{ aspectRatio, borderRadius, height: '4rem' }} />
              </>
            )}
          </div>
        )}
      </div>
      {onCancel ? (
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
      )}
    </div>
  );

  // return (
  //   <div className="w-full max-w-[26rem] flex flex-col gap-6">
  //     {src || upload ? (
  //       <>
  //         {/* TODO: add custom stencil */}
  //         <Cropper
  //           {...cropperProps}
  //           ref={cropperRef}
  //           src={src}
  //           stencilProps={{ aspectRatio: BANNER_ASPECT_RATIO }}
  //           className="rounded-2xl overflow-hidden"
  //         />
  //         <div className="grid grid-cols-2 gap-5">
  //           <ActionButton
  //             action={{
  //               label: 'Annuler',
  //               linkOrActionOrMenu: () => setSrc(null),
  //             }}
  //           />
  //           <ActionButton
  //             action={{
  //               label: 'Sélectionner',
  //               type: ActionType.Success,
  //               linkOrActionOrMenu: () => {
  //                 const canvas = cropperRef.current?.getCanvas();
  //                 if (!canvas || !upload) return;

  //                 const fileBits = [dataURItoBlob(canvas.toDataURL('image/webp'))];
  //                 const file = new File(fileBits, 'image.webp', { type: 'image/webp' });

  //                 upload?.(file);
  //               },
  //             }}
  //           />
  //         </div>
  //       </>
  //     ) : (
  //       <SimpleList heading="Choisir une nouvelle image">
  //         <div className="relative bg-2 rounded-2xl py-6 flex flex-col gap-3 items-center font-semibold text-sm">
  //           <input
  //             type="file"
  //             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
  //             onChange={(e) => e.target.files?.[0] && setSrc(URL.createObjectURL(e.target.files[0]))}
  //           />
  //           <div
  //             className="flex items-center justify-center bg-[var(--primary)] w-full text-white max-w-[8rem]"
  //             style={{ aspectRatio: 1 }}
  //           >
  //             <IconPhotoPlus className="w-7 h-7" />
  //           </div>
  //           Cliquer pour parcourir...
  //         </div>
  //       </SimpleList>
  //     )}
  //   </div>
  // );
}
