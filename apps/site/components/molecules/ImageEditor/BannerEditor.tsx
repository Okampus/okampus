'use client';

import ActorImageEditorForm from './ActorImageEditorForm';
import BannerImage from '../../atoms/Image/BannerImage';
import ModalLayout from '../../atoms/Layout/ModalLayout';

import { notificationAtom } from '../../../context/global';
import { useModal } from '../../../hooks/context/useModal';
import { getBanner } from '../../../utils/actor-image/get-banner';
import { mergeCache } from '../../../utils/apollo/merge-cache';

import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import { ActorImageType, Buckets, EntityName } from '@okampus/shared/enums';
import { insertActorImageMutation, singleUploadMutation } from '@okampus/shared/graphql';
import { ToastType } from '@okampus/shared/types';

import { useMutation } from '@apollo/client';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

import type { ActorBaseInfo } from '@okampus/shared/graphql';
import type { CropperProps } from 'react-advanced-cropper';

const context = { fetchOptions: { credentials: 'include', useUpload: true } };

export type BannerEditorProps = {
  showEditor: boolean;
  cropperProps?: CropperProps;
  setShowEditor: (show: boolean) => void;
  actor: ActorBaseInfo;
};

export default function BannerEditor({ showEditor, setShowEditor, actor }: BannerEditorProps) {
  // @ts-ignore
  const [insertActorImage] = useMutation(insertActorImageMutation);
  const [insertUpload] = useMutation(singleUploadMutation, { context });
  const [, setNotification] = useAtom(notificationAtom);

  const onUpload = (file: File) => {
    insertUpload({
      variables: { file, bucket: Buckets.ActorImages, entityName: EntityName.Team, entityId: actor.id },
      onCompleted: ({ singleUpload }) => {
        if (singleUpload) {
          const variables = { object: { actorId: actor.id, imageId: singleUpload.id, type: ActorImageType.Banner } };
          insertActorImage({
            // @ts-ignore
            variables,
            onCompleted: ({ insertActorImageOne }) => {
              if (insertActorImageOne) {
                setNotification({ type: ToastType.Success, message: 'Bannière mise à jour !' });
                setShowEditor(false);
                mergeCache(
                  { __typename: 'Actor', id: actor.id },
                  { fieldName: 'actorImages', fragmentOn: 'ActorImage', data: insertActorImageOne }
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

  const { openModal, isModalOpen } = useModal();
  const banner = getBanner(actor.actorImages)?.image.url;

  useEffect(() => {
    if (showEditor && !isModalOpen) {
      openModal({
        node: (
          <ModalLayout header="Modifier la bannière">
            <ActorImageEditorForm
              actor={actor}
              actorImageType={ActorImageType.Banner}
              imageType="team"
              onUpload={onUpload}
            />
          </ModalLayout>
        ),
        onClose: () => setShowEditor(false),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showEditor, actor]);

  return (
    <span className="relative grow overflow-hidden" style={{ aspectRatio: BANNER_ASPECT_RATIO }}>
      <BannerImage src={banner} />
      <div
        onClick={() => setShowEditor(true)}
        className="p-5 absolute -inset-px opacity-0 hover:opacity-50 outline outline-black outline-1 z-20 cursor-pointer bg-black text-white flex gap-1 items-center justify-center"
      >
        <div className="font-semibold text-center">Changer de bannière</div>
      </div>
    </span>
  );
}
