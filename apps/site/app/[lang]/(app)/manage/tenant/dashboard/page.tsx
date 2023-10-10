'use client';

import IMoney from '../../../../../_components/atoms/Inline/IMoney';
import TextBadge from '../../../../../_components/atoms/Badge/TextBadge';
import FileIcon from '../../../../../_components/atoms/Icon/FileIcon';
import ViewLayout from '../../../../../_components/atoms/Layout/ViewLayout';
import UserGroup from '../../../../../_components/molecules/Group/UserGroup';
import TeamLabeled from '../../../../../_components/molecules/Labeled/TeamLabeled';
import UserLabeled from '../../../../../_components/molecules/Labeled/UserLabeled';
import Dashboard from '../../../../../_components/organisms/Dashboard';
import FilePreviewer from '../../../../../_components/organisms/FilePreviewer';

import { useBottomSheet } from '../../../../../_hooks/context/useBottomSheet';

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
        const teamMember = value.teamMembers.find((member) =>
          member.teamMemberRoles.some(({ teamRole }) => teamRole.type === TeamRoleType.President),
        );

        if (!teamMember?.user) return <TextBadge color="grey" label="Manquant" />;
        return <UserLabeled user={teamMember.user} />;
      },
    },
    {
      align: Align.Left,
      label: 'Trésorier',
      render: (value: TeamDashboardInfo) => {
        const teamMember = value.teamMembers.find((member) =>
          member.teamMemberRoles.some(({ teamRole }) => teamRole.type === TeamRoleType.Treasurer),
        );

        if (!teamMember?.user) return <TextBadge color="grey" label="Manquant" />;
        return <UserLabeled user={teamMember.user} />;
      },
    },
    {
      align: Align.Left,
      label: 'Secrétaire',
      render: (value: TeamDashboardInfo) => {
        const teamMember = value.teamMembers.find((member) =>
          member.teamMemberRoles.some(({ teamRole }) => teamRole.type === TeamRoleType.Secretary),
        );

        if (!teamMember?.user) return <TextBadge color="grey" label="Manquant" />;
        return <UserLabeled user={teamMember.user} />;
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
        return (
          <IMoney amount={value.bankAccounts.at(0)?.transactionsAggregate.aggregate?.sum?.amount ?? 0} showRed={true} />
        );
      },
    },
    {
      label: 'Statuts',
      render: (value: TeamDashboardInfo) => {
        const document = value.teamDocuments.find(({ type }) => type === DocumentType.AssociationConstitution);
        return renderDocument(previewFile, document);
      },
    },
    {
      label: 'Récépissé de déclaration',
      render: (value: TeamDashboardInfo) => {
        const document = value.teamDocuments.find(({ type }) => type === DocumentType.AssociationDeclaration);
        return renderDocument(previewFile, document);
      },
    },
    {
      label: 'Courrier de passation',
      render: (value: TeamDashboardInfo) => {
        const document = value.teamDocuments.find(({ type }) => type === DocumentType.ClubHandover);
        return renderDocument(previewFile, document);
      },
    },
    {
      align: Align.Center,
      label: 'Règlement intérieur',
      render: (value: TeamDashboardInfo) => {
        const document = value.teamDocuments.find(({ type }) => type === DocumentType.ClubCharter);
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
