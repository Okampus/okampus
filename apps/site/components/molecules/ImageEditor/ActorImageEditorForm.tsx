import Cropper from './Cropper/Cropper';
import ActionButton from '../Button/ActionButton';
import Swiper from '../Scroll/Swiper';

import BannerImage from '../../atoms/Image/BannerImage';
import AvatarImage from '../../atoms/Image/AvatarImage';
import GroupItem from '../../atoms/Item/GroupItem';

import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import { ActorImageType } from '@okampus/shared/enums';
import { ActionType } from '@okampus/shared/types';
import { dataURItoBlob } from '@okampus/shared/utils';

import { IconPhotoPlus } from '@tabler/icons-react';
import { useRef, useState } from 'react';

import type { CropperProps } from './Cropper/Cropper';
import type { ActorBaseInfo } from '@okampus/shared/graphql';
import type { CropperRef } from 'react-advanced-cropper';

export type ImageEditorFormProps = {
  actor: ActorBaseInfo;
  actorImageType: ActorImageType.Avatar | ActorImageType.Banner;
  cropperProps?: CropperProps;
  imageType?: 'user' | 'team' | 'tenant';
  onUpload: (file: File) => void;
};

export default function ActorImageEditorForm({
  actor,
  actorImageType,
  cropperProps,
  imageType,
  onUpload,
}: ImageEditorFormProps) {
  const images =
    actorImageType === ActorImageType.Avatar
      ? actor.actorImages.filter(
          (image) => image.type === ActorImageType.Avatar || image.type === ActorImageType.AvatarDarkMode
        )
      : actor.actorImages.filter((image) => image.type === ActorImageType.Banner);

  const heading = actorImageType === ActorImageType.Avatar ? 'Réutiliser un avatar' : 'Réutiliser une bannière';

  const aspectRatio = actorImageType === ActorImageType.Avatar ? 1 : BANNER_ASPECT_RATIO;
  const borderRadius = actorImageType === ActorImageType.Banner ? '15%' : imageType === 'user' ? '50%' : '25%';

  const [src, setSrc] = useState<string | null>(null);

  const cropperRef = useRef<CropperRef>(null);

  const renderImage =
    actorImageType === ActorImageType.Avatar
      ? (src: string) => <AvatarImage src={src} size={32} className="rounded-full" name={actor.name} type={imageType} />
      : (src: string) => <BannerImage src={src} className="h-8" aspectRatio={BANNER_ASPECT_RATIO} name={actor.name} />;

  return (
    <div className="w-full max-w-[26rem] flex flex-col gap-6">
      {images.length > 0 && (
        <GroupItem heading={heading}>
          <Swiper slides={images.map((actorImage) => renderImage(actorImage.image.url))} />
        </GroupItem>
      )}
      {src ? (
        <div className="flex flex-col gap-4">
          {/* TODO: add custom stencil */}
          <Cropper
            {...cropperProps}
            maxHeight={200}
            ref={cropperRef}
            src={src}
            stencilProps={{ aspectRatio }}
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
                    new File([dataURItoBlob(canvas.toDataURL('image/webp'))], `${imageType}.webp`, {
                      type: 'image/webp',
                    })
                  );
                },
              }}
            />
          </div>
        </div>
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
              style={{ aspectRatio: 1, borderRadius }}
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
