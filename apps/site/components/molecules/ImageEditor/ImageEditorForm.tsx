import Cropper from './Cropper/Cropper';
import ActionButton from '../Button/ActionButton';
import GroupItem from '../../atoms/Item/GroupItem';

import { notificationAtom } from '../../../context/global';

import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import { singleUploadMutation } from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';
import { dataURItoBlob } from '@okampus/shared/utils';

import { IconPhotoPlus } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { useRef, useState } from 'react';

import { useMutation } from '@apollo/client';
import type { CropperProps } from './Cropper/Cropper';
import type { CropperRef } from 'react-advanced-cropper';

export type ImageEditorFormProps = {
  cropperProps?: CropperProps;
  onUploaded: (id: string, onCompleted: () => void, onError: () => void) => void;
};

export default function ImageEditorForm({ cropperProps, onUploaded }: ImageEditorFormProps) {
  const [src, setSrc] = useState<string | null>(null);

  const cropperRef = useRef<CropperRef>(null);
  const [, setNotification] = useAtom(notificationAtom);

  const context = { fetchOptions: { credentials: 'include', useUpload: true } };
  const [insertUpload] = useMutation(singleUploadMutation, { context });

  const onUpload = (file: File) => {
    insertUpload({
      variables: { file },
      onCompleted: ({ singleUpload }) => {
        if (singleUpload) {
          onUploaded(
            singleUpload.id,
            () => setNotification({ type: ToastType.Success, message: 'Bannière mise à jour !' }),
            () => setNotification({ type: ToastType.Error, message: "Erreur lors de l'ajout de la bannière !" })
          );
        } else {
          setNotification({ type: ToastType.Error, message: "Erreur lors de l'upload de l'image !" });
        }
      },
    });
  };

  return (
    <div className="w-full max-w-[26rem] flex flex-col gap-6">
      {src ? (
        <>
          {/* TODO: add custom stencil */}
          <Cropper
            {...cropperProps}
            maxHeight={200}
            ref={cropperRef}
            src={src}
            stencilProps={{ aspectRatio: BANNER_ASPECT_RATIO }}
            className="rounded-2xl overflow-hidden"
          />
          <div className="grid grid-cols-2 gap-5">
            <ActionButton
              action={{
                label: 'Annuler',
                linkOrActionOrMenu: () => setSrc(null),
              }}
            />
            <ActionButton
              action={{
                label: 'Sélectionner',
                type: ActionType.Success,
                linkOrActionOrMenu: () => {
                  const canvas = cropperRef.current?.getCanvas();
                  if (!canvas) return;
                  onUpload(
                    new File([dataURItoBlob(canvas.toDataURL('image/webp'))], `banner.webp`, { type: 'image/webp' })
                  );
                },
              }}
            />
          </div>
        </>
      ) : (
        <GroupItem heading="Choisir une nouvelle image">
          <div className="relative bg-2 rounded-2xl py-6 flex flex-col gap-3 items-center font-semibold text-sm">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => e.target.files?.[0] && setSrc(URL.createObjectURL(e.target.files[0]))}
            />
            <div
              className="flex items-center justify-center bg-[var(--primary)] w-full text-white max-w-[8rem]"
              style={{ aspectRatio: 1 }}
            >
              <IconPhotoPlus className="w-7 h-7" />
            </div>
            Cliquer pour parcourir...
          </div>
        </GroupItem>
      )}
    </div>
  );
}
