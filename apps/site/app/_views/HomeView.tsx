'use client';

import EventPost from './EventPost';
import Post from './Post';
import Section from '../_components/atoms/Container/Section';
import InfiniteLoaderView from '../_components/templates/InfiniteLoaderView';

import { useMe } from '../_hooks/context/useMe';

import AvatarImage from '../_components/atoms/Image/AvatarImage';
import Choice from '../_components/molecules/Choice';

import { FavoriteType } from '../../schemas/Favorite/upsertFavoriteSchema';
import { MagnifyingGlass } from '@phosphor-icons/react';

import Link from 'next/link';

import type { PostDetailsForUser } from '../../types/prisma/Post/post-details-for-user';

export type HomeViewProps = { domain: string };
export default function HomeView({ domain }: HomeViewProps) {
  const { data: me } = useMe();
  const memberships = me.teamMemberships;

  return (
    <div>
      <Section title="Vos associations" border={false} paddingMode="none" mobilePaddingMode="horizontal">
        {memberships.length === 0 ? (
          <Choice
            mobilePaddingMode="horizontal"
            action="/teams"
            className="text-[var(--info)] border-y border-[var(--border-1)] w-full"
            prefix={<MagnifyingGlass className="w-8 h-8" />}
          >
            <div className="flex flex-col">
              <div className="text-0 text-lg">Trouvez vos associations</div>
              <div className="text-2 text-base">Vous n&apos;avez pas rejoint d&apos;association</div>
            </div>
          </Choice>
        ) : (
          <div className="flex items-center gap-4">
            {memberships.map(({ team }) => (
              <Link key={team.slug} href={`/manage/team/${team.slug}`}>
                <AvatarImage actor={team.actor} size={64} />
              </Link>
            ))}
          </div>
        )}
      </Section>
      <Section title="Dernières activités" border={false} mobilePaddingMode="horizontal">
        <InfiniteLoaderView<PostDetailsForUser>
          domain={domain}
          endpoint="/api/posts"
          render={(post) =>
            post.announcingEvent ? (
              <EventPost key={post.id} event={post.announcingEvent} post={post} />
            ) : (
              <Post key={post.id} post={post} upsertFavoriteData={{ id: post.id, type: FavoriteType.Post }} />
            )
          }
        />
      </Section>
    </div>
  );
}
