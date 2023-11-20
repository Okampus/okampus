import prisma from '../../../../../../../../../database/prisma/db';
import BaseView from '../../../../../../../../_components/templates/BaseView';
import UserLabeled from '../../../../../../../../_components/molecules/Labeled/UserLabeled';
import TagList from '../../../../../../../../_components/molecules/List/TagList';

// import { useTeamManage } from '../../../../../../../../_context/navigation';

import { teamMemberMinimal } from '../../../../../../../../../types/prisma/TeamMember/team-member-minimal';
import { COLORS } from '@okampus/shared/consts';

import { ClockCounterClockwise } from '@phosphor-icons/react/dist/ssr';
import { notFound } from 'next/navigation';

import type { DomainSlugParams } from '../../../../../../../../params.type';

export default async function TeamManageOfficePage({ params }: DomainSlugParams) {
  // const { teamManage } = useTeamManage(params.slug);
  const teamManage = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: { teamMembers: teamMemberMinimal },
  });

  if (!teamManage) notFound();

  return (
    <BaseView header="Bureau de l'association" sidePanelButton={<ClockCounterClockwise className="h-7 w-7" />}>
      {teamManage?.teamMembers.map(({ id, user, teamMemberRoles }) => {
        return (
          <UserLabeled
            key={id}
            user={user}
            content={
              <TagList
                tags={teamMemberRoles.map(({ teamRole }) => ({
                  content: teamRole.name,
                  startContent: (
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[teamRole.color] }} />
                  ),
                }))}
              />
            }
          />
        );
      })}
    </BaseView>
  );
}
