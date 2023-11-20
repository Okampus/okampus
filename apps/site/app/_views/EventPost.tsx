'use client';

import Badge from '../_components/atoms/Badge/Badge';
import ILinkList from '../_components/atoms/Inline/ILinkList';
import AvatarStack from '../_components/molecules/Stack/AvatarStack';

import { useTranslation } from '../_hooks/context/useTranslation';

import { ActionType } from '@okampus/shared/enums';
import { Ticket } from '@phosphor-icons/react';

import type { EventDetails } from '../../types/prisma/Event/event-details';
import type { PrismaData } from '../../utils/prisma-serialize';

export type EventPostProps = {
  event: PrismaData<EventDetails>;
};

const AVATAR_LIMIT = 3;
export default function EventPost({ event }: EventPostProps) {
  const { format } = useTranslation();

  const organizingTeams = event.eventOrganizes.map(({ team }) => team);

  const remainingCount = event.eventOrganizes.length - AVATAR_LIMIT;
  const organizingSubtitle = (
    <span className="inline text-2">
      <ILinkList
        links={[
          ...organizingTeams
            .slice(0, AVATAR_LIMIT)
            .map(({ slug, actor }) => ({ href: `/team/${slug}`, label: actor.name })),
          ...(remainingCount > 0
            ? [
                {
                  href: `/event/${event.slug}`,
                  label: `et ${remainingCount} autre${remainingCount > 1 ? 's' : ''}`,
                },
              ]
            : []),
        ]}
        className="text-0 font-medium !inline"
      />{' '}
      &nbsp;organise{organizingTeams.length > 1 ? 'nt' : ''} un nouvel évènement
    </span>
  );

  return (
    <div key={event.id} className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <AvatarStack actors={organizingTeams.map(({ actor }) => actor)} limit={AVATAR_LIMIT} size={58} />
        <div>
          {organizingSubtitle}
          {/* TODO: parse date without 'à' and at => @ */}
          <p className="text-2 capitalize text-sm">{format('weekDayHour', event.createdAt)}</p>
        </div>
      </div>
      <div className="flex justify-between items-center border border-[var(--border-1)] bg-[var(--bg-main)] p-4 rounded-xl">
        <div className="flex gap-4 items-center">
          <Ticket className="w-10 h-10 shrink-0" />
          <div>
            <div className="uppercase font-medium text-sm text-[var(--primary)]">
              {format('weekDayHour', event.start)}
            </div>
            <div>{event.name}</div>
          </div>
        </div>
        <Badge action={`/event/${event.slug}`} type={ActionType.Info}>
          Voir les détails
        </Badge>
      </div>
      <span>
        <p className="inline line-clamp-2">{event.description}</p>
        <p className="pl-1 inline text-2 whitespace-nowrap text-[var(--info)]">...voir plus</p>
      </span>
    </div>
  );
}
