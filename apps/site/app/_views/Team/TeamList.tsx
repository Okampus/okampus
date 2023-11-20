import prisma from '../../../database/prisma/db';

import Badge from '../../_components/atoms/Badge/Badge';
import EmptyStateImage from '../../_components/atoms/Image/EmptyStateImage';
import ListView from '../../_components/templates/ListView';
import TeamCard from '../../_components/molecules/Card/TeamCard';

import { tagMinimal } from '../../../types/prisma/Tag/tag-minimal';

import { ReactComponent as TeamsEmptyState } from '@okampus/assets/svg/empty-state/teams.svg';

import { ActorType } from '@prisma/client';

import type { TeamListDetails } from '../../../types/prisma/Team/team-list-details';

export type TeamListProps = { domain: string; selectedTag?: string; teams: TeamListDetails[] };
export default async function TeamList({ domain, selectedTag, teams }: TeamListProps) {
  const teamCount = await prisma.team.count({ where: { tenantScope: { domain } } });
  const tags = await prisma.tag.findMany({
    where: { tenantScope: { domain } },
    select: { ...tagMinimal.select, _count: { select: { actorTags: { where: { actor: { type: ActorType.Team } } } } } },
  });

  return (
    <>
      <div className="overflow-scroll shrink-0 py-3 scrollbar-none flex gap-2 stick-to-top bg-1 md-max:px-4">
        <Badge action="/teams" active={!selectedTag} count={teamCount}>
          Toutes les associations
        </Badge>
        {tags.map((tag) => (
          <Badge
            className="bg-[var(--bg-main)]"
            key={tag.slug}
            active={tag.slug === selectedTag}
            action={`/teams/${tag.slug}`}
            count={tag._count.actorTags}
          >
            {tag.name}
          </Badge>
        ))}
      </div>
      <ListView
        className="grid-layout pt-6"
        data={teams}
        render={(team) => <TeamCard key={team.id} team={team} />}
        emptyState={
          <EmptyStateImage
            image={<TeamsEmptyState />}
            title="Aucune association pour le moment"
            subtitle="Vous retrouverez les associations sur la page Explorer."
          />
        }
      />
    </>
  );
}
