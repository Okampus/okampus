'use client';

import ViewLayout from '../../../../../components/atoms/Layout/ViewLayout';
import Skeleton from '../../../../../components/atoms/Skeleton/Skeleton';
import TeamCard from '../../../../../components/molecules/Card/TeamCard';

import { useTypedQueryAndSubscribe } from '../../../../../hooks/apollo/useTypedQueryAndSubscribe';

import { TeamType } from '@okampus/shared/enums';
import { OrderBy, teamBaseInfo } from '@okampus/shared/graphql';

import { useMemo } from 'react';

export default function TeamsPage({ params }: { params: { category: string[] } }) {
  const categorySlug = params.category?.[0];

  const where = useMemo(() => {
    const categoryWhere = categorySlug ? { actor: { actorTags: { tag: { slug: { _eq: categorySlug } } } } } : {};
    return { type: { _in: [TeamType.Club, TeamType.Association] }, ...categoryWhere };
  }, [categorySlug]);

  const variables = { where, orderBy: [{ actor: { name: OrderBy.ASC } }] };
  const { data } = useTypedQueryAndSubscribe({ queryName: 'team', selector: [variables, teamBaseInfo] });

  return (
    <ViewLayout>
      <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(19rem,1fr))] gap-6">
        {data?.team
          ? data.team.map((team) => <TeamCard key={team.id} team={team} />)
          : Array.from({ length: 12 }).map((_, idx) => <Skeleton key={idx} className="w-full h-64" />)}
      </div>
    </ViewLayout>
  );
}
