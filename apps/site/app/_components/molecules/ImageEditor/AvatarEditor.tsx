'use client';

import ImageCropper from './ImageCropper';
import ActionButton from '../Button/ActionButton';
import AvatarImage from '../../atoms/Image/AvatarImage';
import ModalLayout from '../../atoms/Layout/ModalLayout';

import { notificationAtom } from '../../../_context/global';
import { useModal } from '../../../_hooks/context/useModal';
import { mergeCache } from '../../../../utils/apollo/merge-cache';

import { ActorImageType, EntityNames, S3BucketNames } from '@okampus/shared/enums';
import { useInsertActorImageMutation, useUpdateActorMutation } from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';

import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';

import type { ActorMinimalInfo } from '../../../../types/features/actor.info';
import type { OnUploaded } from '../../../../utils/xhr-upload';
import type { CropperProps } from 'react-advanced-cropper';

export type AvatarEditorProps = {
  cropperProps?: CropperProps;
  actor: ActorMinimalInfo;
  size: number;
  type: 'user' | 'team';
  className?: string;
};

export default function AvatarEditor({ actor, size, type, className }: AvatarEditorProps) {
  const [insertActorImage] = useInsertActorImageMutation();
  const [, setNotification] = useAtom(notificationAtom);

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [updateActor] = useUpdateActorMutation();

  const onUploaded: OnUploaded = (data) => {
    if (!data) return setNotification({ type: ToastType.Error, message: "Erreur lors de l'upload de l'image !" });

    insertActorImage({
      variables: { object: { actorId: actor.id.toString(), imageId: data.fileUploadId, type: ActorImageType.Avatar } },
      onCompleted: ({ insertActorImageOne }) => {
        if (insertActorImageOne) {
          setNotification({
            type: ToastType.Success,
            message: type === 'user' ? 'Avatar mis à jour !' : 'Logo mis à jour !',
          });
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
          <ModalLayout header={type === 'user' ? "Modifier l'avatar" : 'Modifier le logo'}>
            <ImageCropper
              entityName={EntityNames.ActorImage}
              src={URL.createObjectURL(file)}
              bucket={S3BucketNames.ActorImages}
              onUploaded={onUploaded}
              isCircleStencil={true}
            />
          </ModalLayout>
        ),
        onClose: () => setFile(null),
      });
    } else if (!file && isModalOpen) {
      closeModal();
    }
  }, [file, actor, isModalOpen, type]);

  return (
    <span className="flex gap-6 overflow-hidden">
      <AvatarImage name={actor.name} className={className} src={actor.avatar} size={size} type={type} />
      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer z-0"
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
          />
          <ActionButton
            action={{
              label: type === 'user' ? "Changer d'avatar" : 'Changer de logo',
              linkOrActionOrMenu: () => fileInputRef.current?.click(),
              type: ActionType.Primary,
            }}
          />
        </div>
        {actor.avatar && (
          <ActionButton
            action={{
              label: 'Enlever le logo',
              linkOrActionOrMenu: () =>
                updateActor({ variables: { id: actor.id.toString(), update: { avatar: null } } }),
            }}
          />
        )}
      </div>
    </span>
  );
}
