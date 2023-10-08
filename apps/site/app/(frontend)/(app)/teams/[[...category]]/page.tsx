'use client';

import AvatarImage from '../../../../_components/atoms/Image/AvatarImage';
import EmptyStateImage from '../../../../_components/atoms/Image/EmptyStateImage';
import LinkItem from '../../../../_components/atoms/Item/LinkItem';
import SkeletonLinkItem from '../../../../_components/atoms/Skeleton/SkeletonLinkItem';
import ViewLayout from '../../../../_components/atoms/Layout/ViewLayout';
import Skeleton from '../../../../_components/atoms/Skeleton/Skeleton';

import TeamCard from '../../../../_components/molecules/Card/TeamCard';

import SideBar from '../../../../_components/layouts/SideBar';
import SideBarTitle from '../../../../_components/layouts/SideBar/SidebarTitle';

import { useQueryAndSubscribe } from '../../../../_hooks/apollo/useQueryAndSubscribe';

import { ReactComponent as TeamsEmptyState } from '@okampus/assets/svg/empty-state/teams.svg';
import { GetCategoriesDocument, GetTeamsDocument, OrderBy } from '@okampus/shared/graphql';
import { TagType, TeamType } from '@okampus/shared/enums';
import { notFound, usePathname } from 'next/navigation';
import { Compass } from '@phosphor-icons/react';

import { useMemo } from 'react';
import type {
  GetCategoriesQuery,
  GetCategoriesQueryVariables,
  GetTeamsQuery,
  GetTeamsQueryVariables,
} from '@okampus/shared/graphql';

export default function TeamsPage({ params }: { params: { category: string[] } }) {
  const categorySlug = params.category?.[0];

  const where = useMemo(() => {
    const categoryWhere = categorySlug ? { actor: { actorTags: { tag: { slug: { _eq: categorySlug } } } } } : {};
    return { type: { _in: [TeamType.Club, TeamType.Association] }, ...categoryWhere };
  }, [categorySlug]);

  const variables = { where, orderBy: [{ actor: { name: OrderBy.Asc } }] };
  const { data, loading } = useQueryAndSubscribe<GetTeamsQuery, GetTeamsQueryVariables>({
    query: GetTeamsDocument,
    variables,
  });

  const teams = data?.team;

  const pathname = usePathname();
  const { data: dataTags } = useQueryAndSubscribe<GetCategoriesQuery, GetCategoriesQueryVariables>({
    query: GetCategoriesDocument,
    variables: { where: { type: { _eq: TagType.Category } } },
  });

  const tags = dataTags?.tag;

  let category, header;
  if (categorySlug && tags) {
    category = tags.find((tag) => tag.slug === categorySlug);
    if (!category) notFound();
    header = teams ? `${category.name} (${teams.length ?? 0})` : null;
  } else if (loading || teams) {
    header = teams ? `Associations (${teams.length ?? 0})` : null;
  } else if (!loading) {
    header = 'Associations';
  }

  return (
    <>
      <SideBar>
        <SideBarTitle>Découverte</SideBarTitle>
        <LinkItem pathname={pathname} href="/teams" label="Toutes les associations" icon={<Compass />} />
        {tags
          ? tags.map((tag) => (
              <LinkItem
                pathname={pathname}
                key={tag.id}
                href={`/teams/${tag.slug}`}
                label={tag.name}
                icon={
                  <AvatarImage
                    className="rounded-xl overflow-hidden p-0.5"
                    size={24}
                    name={tag.name}
                    src={tag.image?.url}
                    hasBorder={false}
                  />
                }
                customIcon={true}
              />
            ))
          : Array.from({ length: 8 }, (_, idx) => <SkeletonLinkItem key={idx} />)}
      </SideBar>
      <ViewLayout sidePanelIcon={null} header={header}>
        {teams || loading ? (
          <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(19rem,1fr))] gap-x-6 gap-y-10">
            {teams && teams.length > 0
              ? teams.map((team) => <TeamCard key={team.id} team={team} />)
              : Array.from({ length: 12 }).map((_, idx) => <Skeleton key={idx} className="w-full h-64" />)}
          </div>
        ) : (
          <EmptyStateImage
            image={<TeamsEmptyState />}
            title="Aucune associations pour le moment"
            subtitle="Vous retrouverez les associations sur la page Découverte."
          />
        )}
      </ViewLayout>
    </>
  );
}
