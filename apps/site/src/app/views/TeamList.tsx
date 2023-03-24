import {
  getFragmentData,
  getTeamCategoryBySlugQuery,
  getTeamsQuery,
  teamCategoryFragment,
  teamFragment,
} from '@okampus/shared/graphql';

import {
  // CategorySelector,
  TeamListCard,
} from '@okampus/ui/molecules';
import { TeamType } from '@okampus/shared/enums';
import { Skeleton } from '@okampus/ui/atoms';
import { TEAM_ROUTE } from '@okampus/shared/consts';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
// import { useState } from 'react';

// import type { TeamInfoFragment } from '@okampus/shared/graphql';

export function TeamList() {
  const { categorySlug } = useParams();
  if (!categorySlug) return null;

  return <TeamListWrapping categorySlug={categorySlug} />;
}

export function TeamListWrapping({ categorySlug }: { categorySlug: string }) {
  const teamListFilter = { categories: [categorySlug], types: [TeamType.Association, TeamType.Club] };

  const { data } = useQuery(getTeamsQuery, { variables: { filter: teamListFilter } });
  const { data: categoryData } = useQuery(getTeamCategoryBySlugQuery, { variables: { slug: categorySlug } });
  // const [filteredTeams, setFilteredTeams] = useState<TeamInfoFragment[]>([]);

  if (!data || !data.teams.edges) {
    return null;
  }

  const teams = data.teams.edges.map((edge) => getFragmentData(teamFragment, edge.node));

  return (
    <div className="flex flex-col">
      <div className="p-view-topbar text-8xl font-extrabold text-0 font-title pt-20">
        {getFragmentData(teamCategoryFragment, categoryData?.teamCategoryBySlug)?.name}
      </div>
      <div className="px-view flex flex-col gap-6">
        {/* <div className="flex gap-2">
          <CategorySelector
            items={teams}
            itemToCategories={(team) => team.actor?.tags.map((tag) => tag.name) ?? []}
            onChangeFilteredItems={(filteredItems) => setFilteredTeams(filteredItems)}
          />
        </div> */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(24rem,1fr))] gap-4">
          {teams.map((team) =>
            team.actor ? (
              <TeamListCard key={team.id} team={team} link={TEAM_ROUTE(team.actor.slug)} />
            ) : (
              <Skeleton key={team.id} height={72} width={72} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
