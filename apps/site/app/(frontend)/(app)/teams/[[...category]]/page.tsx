'use client';

import AvatarImage from '../../../../../components/atoms/Image/AvatarImage';
import LinkItem from '../../../../../components/atoms/Item/LinkItem';
import SkeletonLinkItem from '../../../../../components/atoms/Skeleton/SkeletonLinkItem';
import SideBar from '../../../../../components/layouts/SideBar';
import ViewLayout from '../../../../../components/atoms/Layout/ViewLayout';
import Skeleton from '../../../../../components/atoms/Skeleton/Skeleton';
import TeamCard from '../../../../../components/molecules/Card/TeamCard';

import { useTypedQueryAndSubscribe } from '../../../../../hooks/apollo/useTypedQueryAndSubscribe';

import { TagType, TeamType } from '@okampus/shared/enums';
import { OrderBy, tagWithUploadInfo, teamBaseInfo } from '@okampus/shared/graphql';
import { notFound, usePathname } from 'next/navigation';
import { IconCompass } from '@tabler/icons-react';

import { useMemo } from 'react';

const tagVariables = { where: { type: { _eq: TagType.TeamCategory } }, orderBy: [{ name: OrderBy.ASC }] };

export default function TeamsPage({ params }: { params: { category: string[] } }) {
  const categorySlug = params.category?.[0];

  const where = useMemo(() => {
    const categoryWhere = categorySlug ? { actor: { actorTags: { tag: { slug: { _eq: categorySlug } } } } } : {};
    return { type: { _in: [TeamType.Club, TeamType.Association] }, ...categoryWhere };
  }, [categorySlug]);
  const variables = { where, orderBy: [{ actor: { name: OrderBy.ASC } }] };

  const { data } = useTypedQueryAndSubscribe({ queryName: 'team', selector: [variables, teamBaseInfo] });

  const pathname = usePathname();
  const { data: tags } = useTypedQueryAndSubscribe({ queryName: 'tag', selector: [tagVariables, tagWithUploadInfo] });

  let category, header;
  if (categorySlug && tags?.tag) {
    category = tags.tag.find((tag) => tag.slug === categorySlug);
    if (!category) notFound();
    header = data?.team ? `${category.name} (${data.team.length ?? 0})` : <Skeleton className="w-32 h-8" />;
  } else {
    header = data?.team ? `Associations (${data.team.length ?? 0})` : <Skeleton className="w-32 h-8" />;
  }

  return (
    <>
      <SideBar>
        <LinkItem
          className="mt-[var(--py-content)]"
          pathname={pathname}
          href="/teams"
          label="Les associations"
          icon={<IconCompass />}
          large={true}
        />
        {tags?.tag
          ? tags.tag.map((tag) => (
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
                large={true}
              />
            ))
          : Array.from({ length: 8 }, (_, idx) => <SkeletonLinkItem key={idx} />)}
      </SideBar>
      <ViewLayout sidePanelIcon={null} header={header}>
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(19rem,1fr))] gap-6">
          {data?.team && tags?.tag
            ? data.team.map((team) => <TeamCard key={team.id} team={team} />)
            : Array.from({ length: 12 }).map((_, idx) => <Skeleton key={idx} className="w-full h-64" />)}
        </div>
      </ViewLayout>
    </>
  );
}
