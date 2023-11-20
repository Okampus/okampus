import BaseView from '../../../../../../_components/templates/BaseView';
import MemberList from '../../../../../../_views/Member/MemberList';
import TeamSidebar from '../../../../../../_views/Team/TeamSidebar';

import prisma from '../../../../../../../database/prisma/db';

import { actorWithAvatar } from '../../../../../../../types/prisma/Actor/actor-with-avatar';
import { teamMemberMinimal } from '../../../../../../../types/prisma/TeamMember/team-member-minimal';

import { notFound } from 'next/navigation';

import type { DomainSlugParams } from '../../../../../../params.type';

export default async function TeamMembersPage({ params }: DomainSlugParams) {
  const team = await prisma.team.findFirst({
    where: { slug: params.slug },
    select: { teamMembers: teamMemberMinimal, slug: true, actor: actorWithAvatar },
  });

  if (!team) notFound();

  return (
    <>
      <TeamSidebar team={team} />
      <BaseView header="Membres" contentMode="centered-6xl">
        <MemberList members={team.teamMembers} />
      </BaseView>
    </>
  );
}
