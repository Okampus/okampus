'use client';

import IMoney from '../../../../../../components/atoms/Inline/IMoney';
import TextBadge from '../../../../../../components/atoms/Badge/TextBadge';
import FileIcon from '../../../../../../components/atoms/Icon/FileIcon';
import ViewLayout from '../../../../../../components/atoms/Layout/ViewLayout';
import UserGroup from '../../../../../../components/molecules/Group/UserGroup';
import TeamLabeled from '../../../../../../components/molecules/Labeled/TeamLabeled';
import UserLabeled from '../../../../../../components/molecules/Labeled/UserLabeled';
import Dashboard from '../../../../../../components/organisms/Dashboard';
import FilePreviewer from '../../../../../../components/organisms/FilePreviewer';

import { useBottomSheet } from '../../../../../../hooks/context/useBottomSheet';

import { Align, TeamRoleType, DocumentType } from '@okampus/shared/enums';
import { useGetTeamDashboardQuery } from '@okampus/shared/graphql';
import { isNotNull } from '@okampus/shared/utils';

import type { GetTeamDashboardQuery } from '@okampus/shared/graphql';
import type { DocumentMinimalInfo } from '../../../../../../types/features/document.info';
import type { ExternalFile } from '@okampus/shared/types';

type TeamDashboardInfo = NonNullable<GetTeamDashboardQuery['team'][number]>;

function renderDocument(showFile: (file: File | ExternalFile) => void, document?: DocumentMinimalInfo | null) {
  const file = document?.file;
  if (!file) return <TextBadge color="grey" label="Manquant" />;

  return (
    <div onClick={() => showFile(file)} className="cursor-pointer">
      <FileIcon className="h-12 aspect-square" type={file.type} name={file.name} />
    </div>
  );
}

export default function TenantDashboardPage() {
  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  const previewFile = (file: File | ExternalFile) =>
    openBottomSheet({ node: <FilePreviewer file={file} onClose={closeBottomSheet} /> });

  const columns = [
    {
      label: 'Association',
      render: (value: TeamDashboardInfo) => <TeamLabeled team={value} />,
    },
    {
      align: Align.Left,
      label: 'Président',
      render: (value: TeamDashboardInfo) => {
        const user = value.teamMembers.find((member) =>
          member.teamMemberRoles.some(({ role }) => role.type === TeamRoleType.Director),
        )?.user;

        if (!user) return <TextBadge color="grey" label="Manquant" />;
        return <UserLabeled user={user} />;
      },
    },
    {
      align: Align.Left,
      label: 'Trésorier',
      render: (value: TeamDashboardInfo) => {
        const user = value.teamMembers.find((member) =>
          member.teamMemberRoles.some(({ role }) => role.type === TeamRoleType.Treasurer),
        )?.user;

        if (!user) return <TextBadge color="grey" label="Manquant" />;
        return <UserLabeled user={user} />;
      },
    },
    {
      align: Align.Left,
      label: 'Secrétaire',
      render: (value: TeamDashboardInfo) => {
        const user = value.teamMembers.find((member) =>
          member.teamMemberRoles.some(({ role }) => role.type === TeamRoleType.Secretary),
        )?.user;

        if (!user) return <TextBadge color="grey" label="Manquant" />;
        return <UserLabeled user={user} />;
      },
    },
    {
      label: 'Membres',
      render: (value: TeamDashboardInfo) => {
        const members = value.teamMembers.map((member) => member.user).filter(isNotNull);

        return <UserGroup users={members} itemsCount={value.teamMembersAggregate.aggregate?.count} />;
      },
    },
    {
      label: 'Trésorerie',
      render: (value: TeamDashboardInfo) => {
        return <IMoney amount={value.accounts[0].financesAggregate.aggregate?.sum?.amount ?? 0} showRed={true} />;
      },
    },
    {
      label: 'Statuts',
      render: (value: TeamDashboardInfo) => {
        const document = value.documents.find((document) => document.type === DocumentType.AssociationConstitution);
        return renderDocument(previewFile, document);
      },
    },
    {
      label: 'Récépissé de déclaration',
      render: (value: TeamDashboardInfo) => {
        const document = value.documents.find((document) => document.type === DocumentType.AssociationDeclaration);
        return renderDocument(previewFile, document);
      },
    },
    {
      label: 'Courrier de passation',
      render: (value: TeamDashboardInfo) => {
        const document = value.documents.find((document) => document.type === DocumentType.ClubHandover);
        return renderDocument(previewFile, document);
      },
    },
    {
      align: Align.Center,
      label: 'Règlement intérieur',
      render: (value: TeamDashboardInfo) => {
        const document = value.documents.find((document) => document.type === DocumentType.ClubCharter);
        return renderDocument(previewFile, document);
      },
    },
  ];

  const { data } = useGetTeamDashboardQuery();

  return (
    <ViewLayout header="Dashboard associatif">
      <Dashboard columns={columns} data={data?.team} />
    </ViewLayout>
  );
}
