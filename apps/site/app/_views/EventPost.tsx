'use client';

import Post from './Post';

import ActionWrapper from '../_components/atoms/Wrapper/ActionWrapper';
import { useTranslation } from '../_hooks/context/useTranslation';
import { FavoriteType } from '../../schemas/Favorite/upsertFavoriteSchema';

import { EventType } from '@prisma/client';

import Link from 'next/link';

import type { PostDetailsForUser } from '../../types/prisma/Post/post-details-for-user';
import type { EventDetails } from '../../types/prisma/Event/event-details';
import type { PrismaData } from '../../utils/prisma-serialize';

export type EventPostProps = { event: PrismaData<EventDetails>; post: PrismaData<PostDetailsForUser> };

export default function EventPost({ event, post }: EventPostProps) {
  const { format } = useTranslation();

  const organizingTeams = event.eventOrganizes.map(({ team }) => team);

  const address = event.type === EventType.Online ? null : `📍  ${format('address', event.address)}`;
  const date = event.end
    ? `📅  ${format('dayHourRange', [event.start, event.end])}`
    : `📅  ${format('weekDayLongHour', event.start)}`;
  const price = `🎟️  ${format('price', [event.price, event.priceCurrency])}`;

  const infoString = `${date}
${address ?? ''}
${price}`
    .replaceAll(/\n+/g, '\n')
    .trim();

  const content = `${post.content}

${infoString}`;

  return (
    <Post
      href={`/event/${event.slug}`}
      post={{ ...post, content }}
      name={event.name}
      actors={organizingTeams}
      upsertFavoriteData={{ id: event.id.toString(), type: FavoriteType.Event }}
    >
      <Link
        href={`/event/${event.slug}`}
        className="flex justify-between items-center bg-1 px-5 py-3 border-y border-[var(--border-1)]"
      >
        <div>
          <div className="uppercase font-medium text-sm text-[var(--primary)]">
            {format('weekDayHour', event.start)}
          </div>
          <div className="text-0 font-semibold text-lg">{event.name}</div>
        </div>
        <ActionWrapper action={`/event/${event.slug}`} className="button-simple">
          Voir les détails
        </ActionWrapper>
      </Link>
    </Post>
  );
}
