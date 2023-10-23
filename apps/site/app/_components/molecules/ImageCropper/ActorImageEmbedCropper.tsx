'use client';

/* eslint-disable @next/next/no-img-element */
import ZoomCropper from './ZoomCropper';
import NextForm from '../../../_forms/NextForm/NextForm';

import uploadUserImage from '../../../../server/actions/upload/uploadUserImage';
import uploadTenantImage from '../../../../server/actions/upload/uploadTenantImage';
import uploadTeamImage from '../../../../server/actions/upload/uploadTeamImage';

import { notificationAtom } from '../../../../app/_context/global';
import { useModal } from '../../../../app/_hooks/context/useModal';

import { ToastType } from '@okampus/shared/types';

import { ActorType } from '@prisma/client';
import { CircleNotch } from '@phosphor-icons/react';

import { clsx } from 'clsx';
import { useAtom } from 'jotai';
import { forwardRef, useEffect, useRef, useState } from 'react';
import type { ActorImageContext } from './types';

import type { CropperRef } from 'react-advanced-cropper';

export type ImageCropperEditorProps = {
  context: ActorImageContext;
  aspectRatio?: number;
  isCircleStencil?: boolean;
  onCancel?: () => void;
};

export default forwardRef(function ActorImageEmbedCropper(
  { context, aspectRatio, isCircleStencil }: ImageCropperEditorProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const [, setNotification] = useAtom(notificationAtom);
  const { openModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<{ name: string; src: string } | null>(null);

  const cropperRef = useRef<CropperRef>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const action =
    context.actorType === ActorType.User
      ? uploadUserImage
      : context.actorType === ActorType.Team
      ? uploadTeamImage
      : uploadTenantImage;

  useEffect(() => {
    if (image) {
      openModal({
        onClose: () => setImage(null),
        node: (
          <NextForm
            ref={formRef}
            action={action}
            submitProps={{
              type: 'button',
              onClick: async () => {
                const canvas = cropperRef.current?.getCanvas();
                if (!canvas) return false;

                const success = await new Promise<boolean>((resolve) => {
                  canvas.toBlob((blob) => {
                    if (!blob || !fileRef.current) {
                      resolve(false);
                      return;
                    }
                    const file = new File([blob], image.name, { type: 'image/webp' });
                    const container = new DataTransfer();
                    container.items.add(file);

                    fileRef.current.files = container.files;
                    resolve(true);
                  }, 'image/webp');
                });

                if (success) formRef.current?.requestSubmit();
              },
            }}
            render={() => (
              <>
                <input type="text" name="actorImageType" value={context.actorImageType} hidden={true} />
                {context.actorType === 'Team' && <input type="text" name="slug" value={context.slug} hidden={true} />}
                <input ref={fileRef} type="file" name="file" hidden={true} />
                <ZoomCropper ref={cropperRef} aspectRatio={isCircleStencil ? 1 : aspectRatio ?? 1} src={image.src} />
              </>
            )}
          />
        ),
      });
    }
  }, [image]);

  return (
    <div className={clsx('absolute inset-0 w-full h-full overflow-hidden', isCircleStencil && 'rounded-[50%]')}>
      <input
        ref={ref}
        type="file"
        className={clsx('absolute inset-0 w-full h-full opacity-0 cursor-pointer', isCircleStencil && 'rounded-[50%]')}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file?.type.startsWith('image')) {
            setNotification({ type: ToastType.Error, message: "Le fichier n'est pas une image!" });
            return;
          }

          setLoading(true);
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const reader = new FileReader();
          reader.addEventListener('load', (event) => {
            const img = new Image();
            img.addEventListener('load', () => {
              ctx?.drawImage(img, 0, 0, 600, (600 * img.height) / img.width);
              const src = canvas.toDataURL('image/webp');
              setLoading(false);
              setImage({ name: file.name, src });
            });
            img.src = event.target?.result as string;
          });
          reader.readAsDataURL(file);
        }}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <CircleNotch className="animate-spin shrink-0 w-7 h-7 text-white" />
        </div>
      )}
    </div>
  );

  // return (
  //   // <SimpleModal isOpen={true} onClose={() => setImage(null)}>
  //     <NextForm
  //       action={action}
  //       onSubmit={async () => {
  //         const canvas = cropperRef.current?.getCanvas();
  //         if (!canvas) return false;

  //         return await new Promise<boolean>((resolve) => {
  //           canvas.toBlob((blob) => {
  //             if (!blob || !fileRef.current) {
  //               resolve(false);
  //               return;
  //             }
  //             const file = new File([blob], image.name, { type: 'image/webp' });
  //             const container = new DataTransfer();
  //             container.items.add(file);

  //             fileRef.current.files = container.files;
  //             resolve(true);
  //           }, 'image/webp');
  //         });
  //       }}
  //       className="w-full max-w-[26rem] flex flex-col gap-6"
  //       render={() => (
  //         <>
  //           <input type="text" name="actorImageType" value={context.actorImageType} hidden={true} />
  //           {context.actorType === 'Team' && <input type="text" name="slug" value={context.slug} hidden={true} />}
  //           <input ref={fileRef} type="file" name="file" hidden={true} />
  //           <ZoomCropper ref={cropperRef} aspectRatio={isCircleStencil ? 1 : aspectRatio ?? 1} src={image.src} />
  //         </>
  //       )}
  //     />
  //   // </SimpleModal>
  // );
});
