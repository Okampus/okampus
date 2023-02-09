import { ActorImageType, Align, OrgDocumentType } from '@okampus/shared/enums';
import {
  actorImageBareFragment,
  documentFragment,
  documentUploadFragment,
  getFragmentData,
  getTeamsWithMembersQuery,
  teamMembersFragment,
  TeamRoleKey,
} from '@okampus/shared/graphql';
import { FileTypeIcon, StatusLabel } from '@okampus/ui/atoms';
import { NavigationContext } from '@okampus/ui/hooks';
import { AvatarGroup, UserLabel } from '@okampus/ui/molecules';
import { Dashboard } from '@okampus/ui/organisms';
import { useQuery } from '@apollo/client';
import { useContext } from 'react';

import type { FileLike } from '@okampus/shared/types';
import type { DocumentUploadInfoFragment, TeamMembersInfoFragment } from '@okampus/shared/graphql';

function getUserLabel(member?: { actor?: { actorImages: any[]; name: string } | null } | null) {
  if (!member || !member.actor) return <StatusLabel status="archived" label="N/A" />;
  const actor = member.actor;
  const actorImages = actor.actorImages.map((actorImage) => getFragmentData(actorImageBareFragment, actorImage));

  return (
    <UserLabel
      avatar={actorImages.find((actorImage) => actorImage.type === ActorImageType.Avatar)?.image?.url}
      name={actor.name}
    />
  );
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

  const columns = [
    {
      label: 'Association',
      render: getUserLabel,
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
    },
    {
      align: Align.Left,
      label: 'Trésorier',
      render: (value: TeamMembersInfoFragment) => {
        const director = value.members.find((member) =>
          member.roles.some((role) => role.key === TeamRoleKey.Treasurer)
        )?.user;
        return getUserLabel(director);
      },
    },
    {
      align: Align.Left,
      label: 'Secrétaire',
      render: (value: TeamMembersInfoFragment) => {
        const director = value.members.find((member) =>
          member.roles.some((role) => role.key === TeamRoleKey.Secretary)
        )?.user;
        return getUserLabel(director);
      },
    },
    {
      label: 'Membres',
      render: (value: TeamMembersInfoFragment) => {
        const members = value.members.map((member) => ({
          id: member.id,
          name: member.user?.actor?.name,
          avatar: member.user?.actor?.actorImages
            .map((actorImage) => getFragmentData(actorImageBareFragment, actorImage))
            .find((actorImage) => actorImage.type === ActorImageType.Avatar)?.image?.url,
        }));

        return <AvatarGroup avatars={members} />;
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
  const teams = data?.teams.edges?.map((edge) => getFragmentData(teamMembersFragment, edge.node)) ?? [];

  return (
    // <div className="w-full overflow-hidden">
    <Dashboard columns={columns} data={teams} />
    // </div>
  );
};
