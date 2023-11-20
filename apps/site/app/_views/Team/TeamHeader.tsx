import TeamButton from './TeamButton';
import AvatarImage from '../../_components/atoms/Image/AvatarImage';
import ShareButton from '../../_components/molecules/Button/ShareButton';

import { baseUrl, protocol } from '../../../config';

import Link from 'next/link';

import type { TeamDetails } from '../../../types/prisma/Team/team-details';

export type TeamHeaderProps = { team: TeamDetails };
export default function TeamHeader({ team }: TeamHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full gap-4 mb-8">
      <div className="flex items-center gap-4 w-full">
        <AvatarImage actor={team.actor} size={56} />
        <div className="flex flex-col">
          <div className="text-0 text-lg font-semibold line-clamp-1">{team.actor.name}</div>
          <Link className="text-2 font-thin hover:underline" href={`/team/${team.slug}/members`}>
            {team._count.teamMembers} membres
          </Link>
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-4">
        <ShareButton
          url={`${protocol}://${baseUrl}/team/${team.slug}`}
          text={team.actor.status}
          title={team.actor.name}
        />
        <TeamButton team={team} />
      </div>
    </div>
  );
}
