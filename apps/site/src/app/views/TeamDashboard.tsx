import { Align, OrgDocumentType } from '@okampus/shared/enums';
import {
  documentFragment,
  documentUploadFragment,
  getFragmentData,
  getTeamsWithMembersQuery,
  teamMembersFragment,
  TeamRoleKey,
} from '@okampus/shared/graphql';

import { FileTypeIcon, StatusLabel } from '@okampus/ui/atoms';
import { NavigationContext } from '@okampus/ui/hooks';
import { AvatarGroup, LabeledTeam, LabeledTeamSkeleton, LabeledUser, LabeledUserSkeleton } from '@okampus/ui/molecules';
import { Dashboard } from '@okampus/ui/organisms';
import { getAvatar } from '@okampus/ui/utils';
import { useQuery } from '@apollo/client';
import { useContext } from 'react';

import type { Column } from '@okampus/ui/organisms';
import type { FileLike } from '@okampus/shared/types';
import type { DocumentUploadInfoFragment, TeamMembersInfoFragment } from '@okampus/shared/graphql';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getUserLabel(
  user?: { id: string; actor?: { actorImages: any[]; name: string } | null } | null,
  label = 'N/A'
) {
  if (!user || !user.actor) return <StatusLabel status="archived" label={label} />;

  return <LabeledUser avatar={getAvatar(user.actor.actorImages)} name={user.actor.name} id={user.id} />;
}

function findDocument(team: TeamMembersInfoFragment, type: OrgDocumentType) {
  const document = team.documents.find((document) => document.type === type)?.document;
  const documentFile = document
    ? getFragmentData(documentUploadFragment, getFragmentData(documentFragment, document).documentUpload)
    : null;
  return documentFile;
}

function renderDocument(file: DocumentUploadInfoFragment | null, showFile: (file: FileLike) => void) {
  if (!file) return <StatusLabel status="archived" label="Manquant" />;

  const fileLike: FileLike = {
    name: file.name,
    src: file.url,
    type: file.mime,
    size: file.size,
  };

  return (
    <div onClick={() => showFile(fileLike)} className="cursor-pointer">
      <FileTypeIcon file={fileLike} />
    </div>
  );
}

export const TeamDashboard = () => {
  const { previewFile } = useContext(NavigationContext);

  const columns: Column<TeamMembersInfoFragment>[] = [
    {
      label: 'Association',
      render: (value: TeamMembersInfoFragment) =>
        LabeledTeam({
          id: value.id,
          name: value.actor?.name ?? '?',
          avatar: getAvatar(value.actor?.actorImages),
          teamType: value.type,
        }),
      skeleton: <LabeledTeamSkeleton />,
    },
    {
      align: Align.Left,
      label: 'Président',
      render: (value: TeamMembersInfoFragment) => {
        const director = value.members.find((member) =>
          member.roles.some((role) => role.key === TeamRoleKey.Director)
        )?.user;
        return getUserLabel(director);
      },
      skeleton: <LabeledUserSkeleton />,
    },
    {
      align: Align.Left,
      label: 'Trésorier',
      render: (value: TeamMembersInfoFragment) => {
        const treasurer = value.members.find((member) =>
          member.roles.some((role) => role.key === TeamRoleKey.Treasurer)
        )?.user;
        return getUserLabel(treasurer);
      },
      skeleton: <LabeledUserSkeleton />,
    },
    {
      align: Align.Left,
      label: 'Secrétaire',
      render: (value: TeamMembersInfoFragment) => {
        const secretary = value.members.find((member) =>
          member.roles.some((role) => role.key === TeamRoleKey.Secretary)
        )?.user;
        return getUserLabel(secretary);
      },
      skeleton: <LabeledUserSkeleton />,
    },
    {
      label: 'Membres',
      render: (value: TeamMembersInfoFragment) => {
        const members = value.members.map((member) => ({
          id: member.user?.id ?? '',
          name: member.user?.actor?.name,
          avatar: getAvatar(member.user?.actor?.actorImages),
        }));

        return <AvatarGroup users={members} />;
      },
    },
    {
      label: 'Trésorerie',
      render: (value: TeamMembersInfoFragment) => {
        return <div>{value.currentFinance}</div>;
      },
    },
    {
      label: 'Statuts',
      render: (value: TeamMembersInfoFragment) => {
        const file = findDocument(value, OrgDocumentType.AssociationConstitution);
        return renderDocument(file, previewFile);
      },
    },
    {
      label: 'Récépissé de déclaration',
      render: (value: TeamMembersInfoFragment) => {
        const file = findDocument(value, OrgDocumentType.AssociationDeclaration);
        return renderDocument(file, previewFile);
      },
    },
    {
      label: 'Courrier de passation',
      render: (value: TeamMembersInfoFragment) => {
        const file = findDocument(value, OrgDocumentType.ClubHandover);
        return renderDocument(file, previewFile);
      },
    },
    {
      align: Align.Center,
      label: 'Règlement intérieur',
      render: (value: TeamMembersInfoFragment) => {
        const file = findDocument(value, OrgDocumentType.ClubCharter);
        return renderDocument(file, previewFile);
      },
    },
  ];

  const { data } = useQuery(getTeamsWithMembersQuery);
  const teams = data?.teams.edges?.map((edge) => getFragmentData(teamMembersFragment, edge.node));

  return (
    <div className="p-view">
      <Dashboard columns={columns} data={teams} />
    </div>
  );
};
