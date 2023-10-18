'use client';

import ImageCropperEditor from './ImageCropperEditor';
import ActionButton from '../Button/ActionButton';
import BannerImage from '../../atoms/Image/BannerImage';
import ModalLayout from '../../atoms/Layout/ModalLayout';

import { notificationAtom } from '../../../_context/global';
import { useModal } from '../../../_hooks/context/useModal';
import { mergeCache } from '../../../../utils/apollo/merge-cache';

import { useInsertActorImageMutation } from '@okampus/shared/graphql';
import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import {
  ActorImageType,
  // EntityNames, S3BucketNames
} from '@okampus/shared/enums';
import { ToastType } from '@okampus/shared/types';

import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';

import type { ActorMinimalInfo } from '../../../../types/features/actor.info';
import type { OnUploaded } from '../../../../utils/xhr-upload';
import type { CropperProps } from 'react-advanced-cropper';

export type BannerEditorProps = {
  actor: ActorMinimalInfo;
  cropperProps?: CropperProps;
};

// TODO: TEMP
export default function BannerEditor({ actor }: BannerEditorProps) {
  const [insertActorImage] = useInsertActorImageMutation();
  const [, setNotification] = useAtom(notificationAtom);

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onUploaded: OnUploaded = (data) => {
    if (!data) return setNotification({ type: ToastType.Error, message: "Erreur lors de l'upload de l'image !" });

    insertActorImage({
      variables: { object: { actorId: actor.id.toString(), imageId: data.fileUploadId, type: ActorImageType.Banner } },
      onCompleted: ({ insertActorImageOne }) => {
        if (insertActorImageOne) {
          setNotification({ type: ToastType.Success, message: 'Bannière mise à jour !' });
          setFile(null);
          mergeCache(
            { __typename: 'Actor', id: actor.id.toString() },
            { fieldName: 'actorImages', fragmentOn: 'ActorImage', data: insertActorImageOne },
          );
        } else {
          setNotification({ type: ToastType.Error, message: "Erreur lors de l'upload de l'image !" });
        }
      },
    });
  };

  const { closeModal, openModal, isModalOpen } = useModal();

  useEffect(() => {
    if (file && !isModalOpen) {
      openModal({
        node: (
          <ModalLayout header="Modifier la bannière">
            <ImageCropperEditor
              // entityName={EntityNames.ActorImage}
              src={URL.createObjectURL(file)}
              // bucket={S3BucketNames.ActorImages}
              // onUploaded={onUploaded}
              isCircleStencil={true}
            />
          </ModalLayout>
        ),
        onClose: () => setFile(null),
      });
    } else if (!file && isModalOpen) {
      closeModal();
    }
  }, [file, actor]);

  return (
    <span className="relative grow overflow-hidden" style={{ aspectRatio: BANNER_ASPECT_RATIO }}>
      <BannerImage className="rounded-xl" src={actor.banner} />
      <input
        ref={fileInputRef}
        type="file"
        className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer z-0"
        onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer z-0"
        onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
      />
      <ActionButton
        action={{
          label: 'Changer de bannière',
          linkOrActionOrMenu: () => fileInputRef.current?.click(),
        }}
      />
    </span>
  );
}
