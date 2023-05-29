import {
  // CategorySelector,
  TeamListCard,
} from '@okampus/ui/molecules';
import { Skeleton } from '@okampus/ui/atoms';
import { TEAM_ROUTE } from '@okampus/shared/consts';
import { teamBaseInfo, useTypedQuery } from '@okampus/shared/graphql';
import { BaseView } from '@okampus/ui/templates';
import { useParams } from 'react-router-dom';
// import { useState } from 'react';

// import type { TeamInfoFragment } from '@okampus/shared/graphql';

export function TeamList() {
  const { categorySlug } = useParams();
  if (!categorySlug) return null;

  return <TeamListWrapping categorySlug={categorySlug} />;
}

export function TeamListWrapping({ categorySlug }: { categorySlug: string }) {
  const { data } = useTypedQuery({
    team: [{ where: { actor: { actorTags: { tag: { slug: { _eq: categorySlug } } } } } }, teamBaseInfo],
  });

  const categoryName = data?.team?.[0]?.actor?.actorTags.find((node) => node.tag.slug === categorySlug)?.tag.name;
  // const topbarContent = document.querySelector('#topbar-content');

  return (
    <BaseView topbar={<div className="title">{categoryName}</div>}>
      {/* {topbarContent &&
        createPortal(<div className="title px-content">{categoryName}</div>, topbarContent)} */}
      <div className="large-heading">{categoryName ?? <Skeleton height={48} width={200} />}</div>
      <div className="flex flex-col gap-6 pt-6">
        {/* <div className="flex gap-2">
          <CategorySelector
            items={teams}
            itemToCategories={(team) => team.actor?.tags.map((tag) => tag.name) ?? []}
            onChangeFilteredItems={(filteredItems) => setFilteredTeams(filteredItems)}
          />
        </div> */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(24rem,1fr))] gap-4">
          {data && data.team
            ? data.team.map((team, idx) => <TeamListCard key={idx} team={team} link={TEAM_ROUTE(team.actor?.slug)} />)
            : Array.from({ length: 12 }).map((_, index) => <Skeleton key={index} height={100} width="full" />)}
        </div>
      </div>
    </BaseView>
  );
}
