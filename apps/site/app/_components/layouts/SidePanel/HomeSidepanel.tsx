'use client';

import Section from '../../atoms/Container/Section';
import AvatarImage from '../../atoms/Image/AvatarImage';
import AvatarLabeled from '../../molecules/Labeled/AvatarLabeled';

import { useMe } from '../../../_hooks/context/useMe';
import { SignOut } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import type { TeamMinimal } from '../../../../types/prisma/Team/team-minimal';

export type HomeSidepanelProps = { teams: TeamMinimal[] };
export default function HomeSidepanel({ teams }: HomeSidepanelProps) {
  const { data: me } = useMe();

  return (
    <div>
      <div className="flex items-center justify-between">
        <AvatarLabeled href="/me" actor={me.actor} content={me.slug} />
        <Link href="/api/auth/signout">
          <SignOut className="button-icon" />
        </Link>
      </div>
      <Section title="Suggestions d'associations">
        <div className="flex flex-col gap-3">
          {teams.map((team) => (
            <div key={team.id} className="relative flex items-center gap-3">
              <AvatarImage actor={team.actor} size={48} />
              <div>
                <Link href={`/team/${team.slug}`} className="text-0 font-medium card-link line-clamp-1">
                  {team.actor.name}
                </Link>
                <div className="text-2 text-sm leading-4">{team._count.teamMembers} membres</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
