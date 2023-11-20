import TabBar from '../../../../../_components/layouts/TabBar/TabBar';
import BaseView from '../../../../../_components/templates/BaseView';
import TeamList from '../../../../../_views/Team/TeamList';

import prisma from '../../../../../../database/prisma/db';

import { teamListDetails } from '../../../../../../types/prisma/Team/team-list-details';

import { notFound } from 'next/navigation';
import { TagType } from '@prisma/client';

import type { CategoryParams, DomainParams } from '../../../../../params.type';

export async function generateStaticParams({ params }: DomainParams) {
  const tags = await prisma.team.findMany({
    where: { tenantScope: { domain: params.domain } },
    select: { slug: true },
  });
  return tags.map((tag) => ({ params: { category: tag.slug } }));
}

export default async function TeamCategoryPage({ params }: CategoryParams) {
  const categorySlug = params.category;

  const tag = await prisma.tag.findFirst({
    where: { slug: params.category, type: TagType.TeamCategory, tenantScope: { domain: params.domain } },
    select: { name: true },
  });
  if (!tag) notFound();

  const teams = await prisma.team.findMany({
    where: {
      tenantScope: { domain: params.domain },
      ...(categorySlug && { actor: { actorTags: { some: { tag: { slug: categorySlug } } } } }),
    },
    select: teamListDetails.select,
  });

  return (
    <>
      {/* <HomeSideBar title="Explorer" /> */}
      <TabBar />
      <BaseView sidePanelButton={null} header={tag.name} paddingMode="large">
        <TeamList domain={params.domain} teams={teams} selectedTag={params.category} />
      </BaseView>
    </>
  );
}
