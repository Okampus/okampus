'use client';

import ViewLayout from '../../../../../../../_components/atoms/Layout/ViewLayout';
import UserLabeled from '../../../../../../../_components/molecules/Labeled/UserLabeled';
import TagList from '../../../../../../../_components/molecules/List/TagList';

import { useTeamManage } from '../../../../../../../_context/navigation';

import { COLORS } from '@okampus/shared/consts';
import { isKey } from '@okampus/shared/utils';
import { ClockCounterClockwise } from '@phosphor-icons/react';

function getColor(color: string) {
  if (isKey(color, COLORS)) return { backgroundColor: COLORS[color] };
  return {};
}

export default function TeamManageOfficePage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);

  return (
    <ViewLayout header="Bureau de l'association" sidePanelIcon={<ClockCounterClockwise className="h-7 w-7" />}>
      {teamManage?.teamMembers.map(({ id, user, teamMemberRoles }) => {
        return (
          <UserLabeled
            key={id}
            user={user}
            content={
              <TagList
                tags={teamMemberRoles.map(({ teamRole }) => ({
                  content: teamRole.name,
                  startContent: <div className="w-3 h-3 rounded-full" style={getColor(teamRole.color)} />,
                }))}
              />
            }
          />
        );
      })}
    </ViewLayout>
  );
}
