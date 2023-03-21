import { FileTypeIcon, StatusLabel } from '@okampus/ui/atoms';
import { NavigationContext } from '@okampus/ui/hooks';
import {
  AvatarGroupUser,
  LabeledTeam,
  LabeledTeamSkeleton,
  LabeledUser,
  LabeledUserSkeleton,
} from '@okampus/ui/molecules';
import { Dashboard } from '@okampus/ui/organisms';
import { getAvatar, loadTeamMembersFragment } from '@okampus/ui/utils';

import { Align, OrgDocumentType } from '@okampus/shared/enums';
import {
  documentFragment,
  documentUploadFragment,
  getFragmentData,
  getTeamsWithMembersQuery,
  teamMembersFragment,
  TeamRoleKey,
} from '@okampus/shared/graphql';
import { isNotNull } from '@okampus/shared/utils';

import { useQuery } from '@apollo/client';
import { useContext } from 'react';
import type { LoadedTeamMembersFragment } from '@okampus/ui/utils';

import type { Column } from '@okampus/ui/organisms';
import type { FileLike } from '@okampus/shared/types';
import type { DocumentUploadInfoFragment } from '@okampus/shared/graphql';

function getUserLabel(team: LoadedTeamMembersFragment, teamRoleKey: TeamRoleKey, label = 'N/A') {
  const user = team.members.find((member) => member.roles.some((role) => role.key === teamRoleKey))?.user;
  if (!user || !user.actor) return <StatusLabel status="archived" label={label} />;

  return <LabeledUser avatar={{ src: getAvatar(user.actor.actorImages) }} name={user.actor.name} id={user.id} />;
}

function findDocument(team: LoadedTeamMembersFragment, type: OrgDocumentType) {
  const document = team.documents.find((document) => document.type === type)?.document;
  const documentFile = document
    ? getFragmentData(documentUploadFragment, getFragmentData(documentFragment, document).current)
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

  const columns: Column<LoadedTeamMembersFragment>[] = [
    {
      label: 'Association',
      render: (value: LoadedTeamMembersFragment) =>
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
      render: (value: LoadedTeamMembersFragment) => getUserLabel(value, TeamRoleKey.Director),
      skeleton: <LabeledUserSkeleton />,
    },
    {
      align: Align.Left,
      label: 'Trésorier',
      render: (value: LoadedTeamMembersFragment) => getUserLabel(value, TeamRoleKey.Treasurer),
      skeleton: <LabeledUserSkeleton />,
    },
    {
      align: Align.Left,
      label: 'Secrétaire',
      render: (value: LoadedTeamMembersFragment) => getUserLabel(value, TeamRoleKey.Secretary),
      skeleton: <LabeledUserSkeleton />,
    },
    {
      label: 'Membres',
      render: (value: LoadedTeamMembersFragment) => {
        const members = value.members
          .map((member) => {
            if (!member.user || !member.user.actor) return null;
            return {
              id: member.user.id,
              name: member.user.actor.name,
              avatar: getAvatar(member.user.actor.actorImages),
            };
          })
          .filter(isNotNull);

        return <AvatarGroupUser users={members} />;
      },
    },
    {
      label: 'Trésorerie',
      render: (value: LoadedTeamMembersFragment) => {
        return <div>{value.currentFinance}</div>;
      },
    },
    {
      label: 'Statuts',
      render: (value: LoadedTeamMembersFragment) => {
        const file = findDocument(value, OrgDocumentType.AssociationConstitution);
        return renderDocument(file, previewFile);
      },
    },
    {
      label: 'Récépissé de déclaration',
      render: (value: LoadedTeamMembersFragment) => {
        const file = findDocument(value, OrgDocumentType.AssociationDeclaration);
        return renderDocument(file, previewFile);
      },
    },
    {
      label: 'Courrier de passation',
      render: (value: LoadedTeamMembersFragment) => {
        const file = findDocument(value, OrgDocumentType.ClubHandover);
        return renderDocument(file, previewFile);
      },
    },
    {
      align: Align.Center,
      label: 'Règlement intérieur',
      render: (value: LoadedTeamMembersFragment) => {
        const file = findDocument(value, OrgDocumentType.ClubCharter);
        return renderDocument(file, previewFile);
      },
    },
  ];

  const { data } = useQuery(getTeamsWithMembersQuery);
  const teams = data?.teams.edges
    ?.map((edge) => loadTeamMembersFragment(getFragmentData(teamMembersFragment, edge.node)))
    .filter(isNotNull);

  return (
    <div className="p-view-topbar">
      <Dashboard columns={columns} data={teams} />
    </div>
  );
};
