import {
  getFragmentData,
  getTeamCategoryBySlugQuery,
  getTeamsByCategoryQuery,
  teamCategoryFragment,
  teamMembersFragment,
} from '@okampus/shared/graphql';

import { CategorySelector, TeamCard } from '@okampus/ui/molecules';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import type { TeamMembersInfoFragment } from '@okampus/shared/graphql';

export function TeamList() {
  const { categorySlug } = useParams();
  if (!categorySlug) {
    return null;
  }

  return <TeamListWrapping categorySlug={categorySlug} />;
}

export function TeamListWrapping({ categorySlug }: { categorySlug: string }) {
  const { data } = useQuery(getTeamsByCategoryQuery, { variables: { categorySlug } });
  const { data: categoryData } = useQuery(getTeamCategoryBySlugQuery, { variables: { slug: categorySlug } });
  const [filteredTeams, setFilteredTeams] = useState<TeamMembersInfoFragment[]>([]);

  if (!data || !data.teams.edges) {
    return null;
  }

  const teams = data.teams.edges.map((edge) => getFragmentData(teamMembersFragment, edge.node));

  return (
    <div className="flex flex-col">
      <div className="view bg-topbar-to-main text-8xl font-extrabold text-0 font-title pt-20">
        {getFragmentData(teamCategoryFragment, categoryData?.teamCategoryBySlug)?.name}
      </div>
      <div className="view flex flex-col gap-6">
        <div className="flex gap-2">
          <CategorySelector
            items={teams}
            itemToCategories={(team) => team.actor?.tags.map((tag) => tag.name) ?? []}
            onChangeFilteredItems={(filteredItems) => setFilteredTeams(filteredItems)}
          />
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} link={`/club/${team.actor?.slug}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
