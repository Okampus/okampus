'use client';

import AvatarImage from '../../../../../components/atoms/Image/AvatarImage';
import LinkItem from '../../../../../components/atoms/Item/LinkItem';
import SkeletonLinkItem from '../../../../../components/atoms/Skeleton/SkeletonLinkItem';
import ViewLayout from '../../../../../components/atoms/Layout/ViewLayout';
import Skeleton from '../../../../../components/atoms/Skeleton/Skeleton';

import TeamCard from '../../../../../components/molecules/Card/TeamCard';

import SideBar from '../../../../../components/layouts/SideBar';
import SideBarTitle from '../../../../../components/layouts/SideBar/SidebarTitle';

import { useQueryAndSubscribe } from '../../../../../hooks/apollo/useQueryAndSubscribe';

import { GetCategoriesDocument, GetTeamsDocument, OrderBy } from '@okampus/shared/graphql';
import { TagType, TeamType } from '@okampus/shared/enums';
import { notFound, usePathname } from 'next/navigation';
import { IconBrandSafari } from '@tabler/icons-react';

import { useMemo } from 'react';
import type {
  GetCategoriesQuery,
  GetCategoriesQueryVariables,
  GetTeamsQuery,
  GetTeamsQueryVariables,
} from '@okampus/shared/graphql';

const tagVariables = { where: { type: { _eq: TagType.TeamCategory } }, orderBy: [{ name: OrderBy.Asc }] };

export default function TeamsPage({ params }: { params: { category: string[] } }) {
  const categorySlug = params.category?.[0];

  const where = useMemo(() => {
    const categoryWhere = categorySlug ? { actor: { actorTags: { tag: { slug: { _eq: categorySlug } } } } } : {};
    return { type: { _in: [TeamType.Club, TeamType.Association] }, ...categoryWhere };
  }, [categorySlug]);

  const variables = { where, orderBy: [{ actor: { name: OrderBy.Asc } }] };
  const { data } = useQueryAndSubscribe<GetTeamsQuery, GetTeamsQueryVariables>({
    query: GetTeamsDocument,
    variables,
  });

  const teams = data?.team;

  const pathname = usePathname();
  const { data: dataTags } = useQueryAndSubscribe<GetCategoriesQuery, GetCategoriesQueryVariables>({
    query: GetCategoriesDocument,
    variables: { where: { type: { _eq: TagType.TeamCategory } } },
  });

  const tags = dataTags?.tag;

  let category, header;
  if (categorySlug && tags) {
    category = tags.find((tag) => tag.slug === categorySlug);
    if (!category) notFound();
    header = teams ? `${category.name} (${data.team.length ?? 0})` : null;
  } else {
    header = teams ? `Associations (${data.team.length ?? 0})` : null;
  }

  return (
    <>
      <SideBar>
        <SideBarTitle>Découverte</SideBarTitle>
        <LinkItem pathname={pathname} href="/teams" label="Toutes les associations" icon={<IconBrandSafari />} />
        {tags
          ? tags.map((tag) => (
              <LinkItem
                pathname={pathname}
                key={tag.id}
                href={`/teams/${tag.slug}`}
                label={tag.name}
                icon={
                  <AvatarImage
                    className="rounded-xl overflow-hidden"
                    name={tag.name}
                    src={tag.image?.url}
                    size={null}
                    indicativeSize={40}
                  />
                }
                customIcon={true}
              />
            ))
          : Array.from({ length: 8 }, (_, idx) => <SkeletonLinkItem key={idx} />)}
      </SideBar>
      <ViewLayout sidePanelIcon={null} header={header}>
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(19rem,1fr))] gap-4">
          {teams
            ? data.team.map((team) => <TeamCard key={team.id} team={team} />)
            : Array.from({ length: 12 }).map((_, idx) => <Skeleton key={idx} className="w-full h-64" />)}
        </div>
      </ViewLayout>
    </>
  );
}
