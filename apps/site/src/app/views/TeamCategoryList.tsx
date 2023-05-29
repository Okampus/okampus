import { CLUB_CATEGORY_ROUTE, COLORS, TEAM_ROUTE } from '@okampus/shared/consts';
import { TagType, TeamType } from '@okampus/shared/enums';
import { isIn } from '@okampus/shared/utils';
import { OrderBy, teamBaseInfo, useTypedQuery, tagWithUploadInfo } from '@okampus/shared/graphql';

import { Skeleton } from '@okampus/ui/atoms';
import { CategoryCard, TeamListCard } from '@okampus/ui/molecules';
import { BaseView } from '@okampus/ui/templates';

export function TeamCategoryList() {
  const { data } = useTypedQuery({
    tag: [{ where: { type: { _eq: TagType.TeamCategory } }, orderBy: [{ name: OrderBy.ASC }] }, tagWithUploadInfo],
  });

  const categories = data?.tag;

  const { data: dataTeam } = useTypedQuery({
    team: [{ where: { type: { _in: [TeamType.Club, TeamType.Association] } } }, teamBaseInfo],
  });

  return (
    <BaseView topbar={<div className="title">Associations</div>}>
      <div className="large-heading">Par catégorie</div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-4 pt-6">
        {categories
          ? categories.map((category) => (
              <CategoryCard
                link={CLUB_CATEGORY_ROUTE(category.slug)}
                key={category.name}
                name={category.name}
                image={category.fileUpload?.url}
                color={isIn(category.color, COLORS) ? COLORS[category.color] : category.color}
              />
            ))
          : Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} height={72} width={72} rounded="2rem" />
            ))}
      </div>
      <div className="title pt-24">Toutes les associations</div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(24rem,1fr))] gap-4 pt-6">
        {dataTeam && dataTeam.team
          ? dataTeam.team.map((team, idx) => <TeamListCard key={idx} team={team} link={TEAM_ROUTE(team.actor?.slug)} />)
          : Array.from({ length: 12 }).map((_, index) => <Skeleton key={index} height={100} width="full" />)}
      </div>
    </BaseView>
  );
}
