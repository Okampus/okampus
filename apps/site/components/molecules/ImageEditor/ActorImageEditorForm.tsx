/* eslint-disable @next/next/no-img-element */
import ActionButton from '../Button/ActionButton';
// import Swiper from '../Scroll/Swiper';

// import BannerImage from '../../atoms/Image/BannerImage';
// import AvatarImage from '../../atoms/Image/AvatarImage';
import GroupItem from '../../atoms/Item/GroupItem';

import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import { ActorImageType } from '@okampus/shared/enums';
import { ActionType } from '@okampus/shared/types';
import { dataURItoBlob } from '@okampus/shared/utils';

import { IconPhotoPlus } from '@tabler/icons-react';
import { useRef, useState } from 'react';

import { Cropper } from 'react-advanced-cropper';

import type { ActorMinimalInfo } from '../../../types/features/actor.info';
import type { CropperProps, CropperRef } from 'react-advanced-cropper';

export type ImageEditorFormProps = {
  actor: ActorMinimalInfo;
  actorImageType: ActorImageType.Avatar | ActorImageType.Banner;
  cropperProps?: CropperProps;
  imageType?: 'user' | 'team';
  onUpload: (file: File) => void;
};

export default function ActorImageEditorForm({
  // actor,
  actorImageType,
  cropperProps,
  imageType,
  onUpload,
}: ImageEditorFormProps) {
  // const heading = actorImageType === ActorImageType.Avatar ? 'Réutiliser un avatar' : 'Réutiliser une bannière';

  const aspectRatio = actorImageType === ActorImageType.Avatar ? 1 : BANNER_ASPECT_RATIO;
  const borderRadius = actorImageType === ActorImageType.Banner ? '15%' : imageType === 'user' ? '50%' : '25%';

  const [src, setSrc] = useState<string | null>(null);
  const [previewState, setPreviewState] = useState<string | null>(null);

  const cropperRef = useRef<CropperRef>(null);
  const setSrcAndPreview = (src: string) => {
    setSrc(src);
    setTimeout(() => setPreviewState(cropperRef.current?.getCanvas()?.toDataURL() ?? null), 200);
  };

  // const renderImage =
  //   actorImageType === ActorImageType.Avatar
  //     ? (src: string) => (
  //         <div className="cursor-pointer" onClick={() => setSrcAndPreview(src)}>
  //           <AvatarImage src={src} size={32} className="rounded-full" name={actor.name} type={imageType} />
  //         </div>
  //       )
  //     : (src: string) => (
  //         <div className="cursor-pointer" onClick={() => setSrcAndPreview(src)}>
  //           <BannerImage src={src} className="h-8" aspectRatio={BANNER_ASPECT_RATIO} name={actor.name} />
  //         </div>
  //       );

  return (
    <div className="w-full max-w-[26rem] flex flex-col gap-6">
      {/* {images.length > 0 && (
        <GroupItem heading={heading}>
          <Swiper slides={images.map((actorImage) => renderImage(actorImage.image.url))} />
        </GroupItem>
      )} */}
      {src ? (
        <div className="flex flex-col gap-4">
          {/* TODO: add custom stencil */}
          <div className="flex gap-4">
            <Cropper
              {...cropperProps}
              onUpdate={(data) => setPreviewState(data.getCanvas()?.toDataURL() ?? null)}
              ref={cropperRef}
              src={src}
              stencilProps={{ aspectRatio }}
              className="rounded-2xl overflow-hidden min-h-[16rem] min-w-[16rem]"
            />
            <div className="flex flex-col gap-4 items-start shrink-0">
              {previewState && (
                <>
                  <img src={previewState} alt="preview" style={{ aspectRatio, borderRadius, height: '6rem' }} />
                  <img src={previewState} alt="preview" style={{ aspectRatio, borderRadius, height: '4rem' }} />
                  <img src={previewState} alt="preview" style={{ aspectRatio, borderRadius, height: '2rem' }} />
                </>
              )}
            </div>
          </div>
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
                    }),
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
              onChange={(e) => e.target.files?.[0] && setSrcAndPreview(URL.createObjectURL(e.target.files[0]))}
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
