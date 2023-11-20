'use client';

import Section from '../_components/atoms/Container/Section';
import InfiniteLoader from '../_components/templates/InfiniteLoaderView';

import { useMe } from '../_hooks/context/useMe';

import AvatarImage from '../_components/atoms/Image/AvatarImage';
import Choice from '../_components/molecules/Choice';

import { MagnifyingGlass } from '@phosphor-icons/react';
import Link from 'next/link';

import type { EventDetails } from '../../types/prisma/Event/event-details';

export type HomeViewProps = { domain: string };
export default function HomeView({ domain }: HomeViewProps) {
  const { data: me } = useMe();
  const memberships = me.teamMemberships;

  return (
    <div>
      <Section title="Vos associations" border={false} paddingMode="none">
        {memberships.length === 0 ? (
          <Choice
            action="/teams"
            className="text-[var(--info)] border-y border-[var(--border-0)] w-full"
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
      <Section title="Dernières activités" border={false}>
        <InfiniteLoader<EventDetails>
          domain={domain}
          endpoint="/api/events"
          render={(event) => <div>{event.name}</div>}
        />
      </Section>
    </div>
  );
}
