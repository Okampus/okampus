'use client';

import ActorImageEditorForm from './ActorImageEditorForm';
import AvatarImage, { getAvatarRounded } from '../../atoms/Image/AvatarImage';
import ModalLayout from '../../atoms/Layout/ModalLayout';

import { notificationAtom } from '../../../context/global';
import { useModal } from '../../../hooks/context/useModal';
import { mergeCache } from '../../../utils/apollo/merge-cache';

import { useInsertActorImageMutation, useInsertSingleUploadMutation } from '@okampus/shared/graphql';
import { ActorImageType, BucketNames, EntityName } from '@okampus/shared/enums';
import { ToastType } from '@okampus/shared/types';

import { useAtom } from 'jotai';
import { useEffect } from 'react';

import type { ActorMinimalInfo } from '../../../types/features/actor.info';
import type { CropperProps } from 'react-advanced-cropper';

const context = { fetchOptions: { credentials: 'include', useUpload: true } };

export type AvatarEditorProps = {
  showEditor: boolean;
  cropperProps?: CropperProps;
  setShowEditor: (show: boolean) => void;
  actor: ActorMinimalInfo;
  size: number;
  type: 'user' | 'team';
  className?: string;
};

export default function AvatarEditor({ showEditor, setShowEditor, actor, size, type, className }: AvatarEditorProps) {
  const [insertActorImage] = useInsertActorImageMutation();
  const [insertUpload] = useInsertSingleUploadMutation({ context });
  const [, setNotification] = useAtom(notificationAtom);

  const entityName = type === 'user' ? EntityName.User : type === 'team' ? EntityName.Team : EntityName.Tenant;
  const onUpload = (file: File) => {
    insertUpload({
      variables: { file, bucket: BucketNames.ActorImages, entityName, entityId: actor.id },
      onCompleted: ({ singleUpload }) => {
        if (singleUpload) {
          const variables = { object: { actorId: actor.id, imageId: singleUpload.id, type: ActorImageType.Avatar } };
          insertActorImage({
            variables,
            onCompleted: ({ insertActorImageOne }) => {
              if (insertActorImageOne) {
                setNotification({
                  type: ToastType.Success,
                  message: type === 'user' ? 'Avatar mis à jour !' : 'Logo mis à jour !',
                });
                setShowEditor(false);
                mergeCache(
                  { __typename: 'Actor', id: actor.id },
                  { fieldName: 'actorImages', fragmentOn: 'ActorImage', data: insertActorImageOne },
                );
              } else {
                setNotification({ type: ToastType.Error, message: "Erreur lors de l'upload de l'image !" });
              }
            },
          });
        } else {
          setNotification({ type: ToastType.Error, message: "Erreur lors de l'upload de l'image !" });
        }
      },
    });
  };

  const { closeModal, openModal, isModalOpen } = useModal();

  useEffect(() => {
    if (showEditor && !isModalOpen) {
      openModal({
        node: (
          <ModalLayout header={type === 'user' ? "Modifier l'avatar" : 'Modifier le logo'}>
            <ActorImageEditorForm
              actor={actor}
              actorImageType={ActorImageType.Avatar}
              imageType={type}
              onUpload={onUpload}
            />
          </ModalLayout>
        ),
        onClose: () => setShowEditor(false),
      });
    } else if (!showEditor && isModalOpen) {
      closeModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showEditor, actor]);

  const rounded = getAvatarRounded(type);

  return (
    <span className="relative overflow-hidden" style={{ borderRadius: `${rounded ? rounded * 1.1 : 50}%` }}>
      <AvatarImage name={actor.name} className={className} src={actor.avatar} size={size} type={type} />
      <div
        onClick={() => setShowEditor(true)}
        className="p-5 absolute -inset-px opacity-0 hover:opacity-50 outline outline-black outline-1 z-20 cursor-pointer bg-black text-white flex gap-1 items-center justify-center"
      >
        <div className="font-semibold text-center">{type === 'user' ? "Changer d'avatar" : 'Changer de logo'}</div>
      </div>
    </span>
  );
}
