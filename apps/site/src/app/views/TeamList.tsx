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
      <div className="bg-gradient-to-b from-[#222] to-[#1a1a1a]">
        <div className="view text-8xl font-extrabold text-0 font-title pt-20">
          {getFragmentData(teamCategoryFragment, categoryData?.teamCategoryBySlug)?.name}
        </div>
      </div>
      <div className="view flex flex-col gap-6">
        <div className="flex gap-2">
          <CategorySelector
            items={teams}
            itemToCategories={(team) => team.actor?.tags.map((tag) => tag.name) ?? []}
            onChangeFilteredItems={(filteredItems) => setFilteredTeams(filteredItems)}
          />
          {/* {tags.map((tag) => (
            <div className="text-white bg-gray-700 px-4 py-1 text-lg rounded-full">{tag.name}</div>
          ))} */}
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} link={`/club/${team.actor?.slug}`} />
          ))}
          {/* {data?.teams?.edges?.map((teamEdge) => {
            const team = getFragmentData(teamFragment, teamEdge.node);
            return (
              <TeamCard
                key={team.id}
                name={team.actor?.name ?? ''}
                description={team.tagline}
                // tags={[
                //   { name: club.tag_1, color: club.tag_1_color },
                //   ...(club.tag_2 ? [{ name: club.tag_2, color: club.tag_2_color }] : []),
                // ]}
              />
            );
          })} */}
        </div>
      </div>
    </div>
  );
}
