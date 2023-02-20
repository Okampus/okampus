import { COLORS } from '@okampus/shared/consts';
import { getFragmentData, getTeamCategoriesQuery, teamCategoryFragment } from '@okampus/shared/graphql';
import { CategoryCard } from '@okampus/ui/molecules';

import { useQuery } from '@apollo/client';

export function TeamCategoryList() {
  const { data } = useQuery(getTeamCategoriesQuery);

  if (!data || !data.teamCategories.edges) {
    return null;
  }

  const categories = data.teamCategories.edges.map((edge) => getFragmentData(teamCategoryFragment, edge.node));

  return (
    <div className="flex flex-col gap-6 text-0 view">
      <div className="text-2xl font-title font-bold">Par catégorie</div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4">
        {categories.map((category) => (
          <CategoryCard
            link={`/clubs/${category.slug}`}
            key={category.name}
            name={category.name}
            image={category.iconImage?.url}
            color={COLORS[category.color]}
          />
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
  );
}
