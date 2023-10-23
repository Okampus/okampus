'use client';

import ActorImageEmbedCropper from './ActorImageEmbedCropper';
import ActionButton from '../Button/ActionButton';
import BannerImage from '../../atoms/Image/BannerImage';

import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';

import { useRef } from 'react';

import type { ActorImageContext } from './types';
import type { CropperProps } from 'react-advanced-cropper';

export type BannerEditorProps = {
  actor: { name: string; banner: string | null; id: bigint | string };
  context: ActorImageContext;
  cropperProps?: CropperProps;
};

export default function BannerEditor({ actor, context }: BannerEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <span className="relative grow overflow-hidden" style={{ aspectRatio: BANNER_ASPECT_RATIO }}>
      <div className="relative">
        <ActorImageEmbedCropper context={context} isCircleStencil={true} aspectRatio={1} ref={fileInputRef} />
        <BannerImage className="rounded-xl" src={actor.banner} />
      </div>
      <ActionButton
        action={{
          label: 'Changer de bannière',
          linkOrActionOrMenu: () => fileInputRef.current?.click(),
        }}
      />
    </span>
  );
}
