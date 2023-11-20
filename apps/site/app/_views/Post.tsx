'use client';

import MoreButton from './MoreButton';
import AvatarImage from '../_components/atoms/Image/AvatarImage';
import ILinkList from '../_components/atoms/Inline/ILinkList';
// import CardButton from '../_components/molecules/Button/CardButton';

import { useTranslation } from '../_hooks/context/useTranslation';
import { getActorLink } from '../../utils/models/get-actor-link';

import { Link } from '@phosphor-icons/react';

import clsx from 'clsx';

import { toast } from 'sonner';

import type { ActorMinimal } from '../../types/prisma/Actor/actor-minimal';

export type PostActor = { actor: ActorMinimal; slug: string };
export type PostProps = {
  actors: [PostActor, ...PostActor[]];
  href: string;
  createdAt: Date;
  note: React.ReactNode;
  content: string;
  children: React.ReactNode;
};

export default function Post({ actors, createdAt, href, note, content, children }: PostProps) {
  const { format } = useTranslation();

  const extraActorsCount = actors.length - 2;
  const actorLabeled =
    actors.length === 1 ? (
      <>
        <AvatarImage actor={actors[0].actor} />
        <div>
          <div className="text-0 font-semibold">{actors[0].actor.name}</div>
          <div className="text-2 text-xs">{format('weekDayHour', createdAt)}</div>
        </div>
      </>
    ) : (
      <>
        <AvatarImage actor={actors[0].actor} />
        <div>
          <ILinkList
            links={[
              ...actors.slice(0, 2).map(({ actor, slug }) => ({ href: getActorLink(actor, slug), label: actor.name })),
              ...(extraActorsCount > 0
                ? [
                    {
                      href,
                      label: `et ${extraActorsCount} autre${extraActorsCount > 1 ? 's' : ''}`,
                    },
                  ]
                : []),
            ]}
            className="text-0 font-semibold"
          />
          <div className="text-2 text-xs">{format('weekDayHour', createdAt)}</div>
        </div>
      </>
    );

  return (
    <div className="py-3 px-0 card-responsive bg-[var(--bg-main)]">
      {note && <div className="mb-3 text-2">{note}</div>}
      <div className="px-4">
        <div className={clsx('mb-3 flex items-center justify-between', note && 'border-t border-[var(--border-1)]')}>
          <div className="flex items-center gap-1">{actorLabeled}</div>
          <MoreButton
            actions={[
              {
                icon: <Link />,
                children: 'Copier le lien',
                action: () => {
                  navigator.clipboard.writeText(href);
                  toast.info('Lien copié dans le presse-papier');
                },
              },
            ]}
          />
        </div>
        {content}
      </div>
      <div>{children}</div>
    </div>
  );
}
