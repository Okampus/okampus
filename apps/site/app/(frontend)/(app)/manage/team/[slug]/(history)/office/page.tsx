'use client';

import ViewLayout from '../../../../../../../../components/atoms/Layout/ViewLayout';
import UserLabeled from '../../../../../../../../components/molecules/Labeled/UserLabeled';
import TagList from '../../../../../../../../components/molecules/List/TagList';

import { useTeamManage } from '../../../../../../../../context/navigation';

import { COLORS } from '@okampus/shared/consts';
import { isKey } from '@okampus/shared/utils';
import { IconHistory } from '@tabler/icons-react';

function getColor(color: string) {
  if (isKey(color, COLORS)) return { backgroundColor: COLORS[color] };
  return {};
}

export default function TeamManageOfficePage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);

  return (
    <ViewLayout header="Bureau de l'association" sidePanelIcon={<IconHistory />}>
      {teamManage?.teamMembers.map(({ id, user, teamMemberRoles }) => {
        return (
          <UserLabeled
            key={id}
            user={user}
            content={
              <TagList
                tags={teamMemberRoles.map(({ role }) => ({
                  content: role.name,
                  startContent: <div className="w-3 h-3" style={getColor(role.color)} />,
                }))}
              />
            }
          />
        );
      })}
    </ViewLayout>
  );
}
