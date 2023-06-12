import { Align, DocumentType, TeamRoleType, TeamType } from '@okampus/shared/enums';
import { teamDashboardInfo, useTypedQuery } from '@okampus/shared/graphql';
import { isNotNull } from '@okampus/shared/utils';

import { FileIcon, Skeleton, TextBadge, TextFinance } from '@okampus/ui/atoms';
import { NavigationContext } from '@okampus/ui/hooks';
import {
  AvatarGroupUser,
  LabeledTeam,
  LabeledTeamSkeleton,
  LabeledUser,
  LabeledUserSkeleton,
} from '@okampus/ui/molecules';
import { Dashboard } from '@okampus/ui/organisms';
import { getAvatar } from '@okampus/ui/utils';

import { useContext } from 'react';

import type { Column } from '@okampus/ui/organisms';
import type { DocumentBaseInfo, TeamDashboardInfo } from '@okampus/shared/graphql';
import type { FileLike } from '@okampus/shared/types';

function getUserLabel(team: TeamDashboardInfo, roleType: TeamRoleType, label = 'N/A') {
  const user = team.teamMembersAggregate.nodes.find((member) =>
    member.teamMemberRoles.some(({ role }) => role.type === roleType)
  )?.userInfo;

  const actor = user?.individualById?.actor;
  if (!user || !actor) return <TextBadge color="grey" label={label} />;

  return <LabeledUser id={user.id as string} avatar={{ src: getAvatar(actor.actorImages) }} name={actor.name} />;
}

function renderDocument(showFile: (file: FileLike) => void, document?: DocumentBaseInfo) {
  if (!document) return <TextBadge color="grey" label="Manquant" />;
  if (!document.name || !document.fileUpload) return <Skeleton height={32} width={32} />;

  const fileLike: FileLike = {
    name: document.name,
    src: document.fileUpload.url,
    type: document.fileUpload.mime,
    size: document.fileUpload.size,
  };

  return (
    <div onClick={() => showFile(fileLike)} className="cursor-pointer">
      <FileIcon className="h-12 aspect-square" file={fileLike} />
    </div>
  );
}

export const TeamDashboard = () => {
  const { previewFile } = useContext(NavigationContext);

  const columns: Column<TeamDashboardInfo>[] = [
    {
      label: 'Association',
      render: (value: TeamDashboardInfo) =>
        LabeledTeam({
          id: value.id as string,
          name: value.actor?.name,
          avatar: getAvatar(value.actor?.actorImages),
          teamType: value.type ?? (TeamType.Association as string),
        }),
      skeleton: <LabeledTeamSkeleton />,
    },
    {
      align: Align.Left,
      label: 'Président',
      render: (value: TeamDashboardInfo) => getUserLabel(value, TeamRoleType.Director),
      skeleton: <LabeledUserSkeleton />,
    },
    {
      align: Align.Left,
      label: 'Trésorier',
      render: (value: TeamDashboardInfo) => getUserLabel(value, TeamRoleType.Treasurer),
      skeleton: <LabeledUserSkeleton />,
    },
    {
      align: Align.Left,
      label: 'Secrétaire',
      render: (value: TeamDashboardInfo) => getUserLabel(value, TeamRoleType.Secretary),
      skeleton: <LabeledUserSkeleton />,
    },
    {
      label: 'Membres',
      render: (value: TeamDashboardInfo) => {
        const members = value.teamMembersAggregate.nodes
          .map((member) => {
            if (!member.userInfo || !member.userInfo.individualById?.actor) return null;
            return {
              id: member.userInfo.id as string,
              name: member.userInfo.individualById.actor.name,
              avatar: getAvatar(member.userInfo.individualById.actor.actorImages),
            };
          })
          .filter(isNotNull);

        return <AvatarGroupUser users={members} itemsCount={value.teamMembersAggregate.aggregate?.count} />;
      },
    },
    {
      label: 'Trésorerie',
      render: (value: TeamDashboardInfo) => {
        return <TextFinance amount={value.currentFinance} showRed={true} />;
      },
    },
    {
      label: 'Statuts',
      render: (value: TeamDashboardInfo) => {
        const file = value.documents.find((document) => document.type === DocumentType.AssociationConstitution);
        return renderDocument(previewFile, file);
      },
    },
    {
      label: 'Récépissé de déclaration',
      render: (value: TeamDashboardInfo) => {
        const file = value.documents.find((document) => document.type === DocumentType.AssociationDeclaration);
        return renderDocument(previewFile, file);
      },
    },
    {
      label: 'Courrier de passation',
      render: (value: TeamDashboardInfo) => {
        const file = value.documents.find((document) => document.type === DocumentType.ClubHandover);
        return renderDocument(previewFile, file);
      },
    },
    {
      align: Align.Center,
      label: 'Règlement intérieur',
      render: (value: TeamDashboardInfo) => {
        const file = value.documents.find((document) => document.type === DocumentType.ClubCharter);
        return renderDocument(previewFile, file);
      },
    },
  ];

  const { data } = useTypedQuery({
    team: [
      { where: { _or: [{ type: { _eq: TeamType.Association } }, { type: { _eq: TeamType.Club } }] } },
      teamDashboardInfo,
    ],
  });

  return (
    <div className="h-full">
      <Dashboard columns={columns} data={data?.team} />
    </div>
  );
};
