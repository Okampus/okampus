import CreateEventForm from '../../../../../../../../_views/Form/CreateEvent/CreateEventForm';

import prisma from '../../../../../../../../../database/prisma/db';
import { teamWithProjects } from '../../../../../../../../../types/prisma/Team/team-with-projects';

import { notFound } from 'next/navigation';

import type { DomainSlugParams } from '../../../../../../../../params.type';

export default async function TeamEventNewPageProps({ params }: DomainSlugParams) {
  const teamManage = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: teamWithProjects.select,
  });

  if (!teamManage) notFound();
  return <CreateEventForm domain={params.domain} team={teamManage} />;
}
