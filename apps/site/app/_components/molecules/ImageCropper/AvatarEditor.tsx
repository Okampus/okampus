'use client';

import ActorImageEmbedCropper from './ActorImageEmbedCropper';
import ActionButton from '../Button/ActionButton';
import AvatarImage from '../../atoms/Image/AvatarImage';

import { useUpdateActorMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import { ActorType } from '@prisma/client';
import { useRef } from 'react';
import type { ActorImageContext } from './types';

export type AvatarEditorProps = {
  actor: { name: string; avatar: string | null; id: bigint | string };
  context: ActorImageContext;
  className?: string;
  size: number;
};

export default function AvatarEditor({ actor, context, size, className }: AvatarEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateActor] = useUpdateActorMutation();

  return (
    <span className="flex gap-6">
      <div className="relative">
        <ActorImageEmbedCropper context={context} isCircleStencil={true} aspectRatio={1} ref={fileInputRef} />
        <AvatarImage name={actor.name} className={className} src={actor.avatar} size={size} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="relative">
          <ActionButton
            action={{
              label: context.actorType === ActorType.User ? "Changer d'avatar" : 'Changer de logo',
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
