'use client';

import UserGroup from '../../../../../../components/atoms/Group/UserGroup';
import TextFinance from '../../../../../../components/atoms/Text/TextFinance';
import TextBadge from '../../../../../../components/atoms/Badge/TextBadge';
import FileIcon from '../../../../../../components/atoms/Icon/FileIcon';
import Skeleton from '../../../../../../components/atoms/Skeleton/Skeleton';
import TeamLabeled from '../../../../../../components/molecules/Labeled/TeamLabeled';
import UserLabeled from '../../../../../../components/molecules/Labeled/UserLabeled';
import Dashboard from '../../../../../../components/organisms/Dashboard';
import FilePreviewer from '../../../../../../components/organisms/FilePreviewer';

import { useBottomSheet } from '../../../../../../hooks/context/useBottomSheet';

import { TeamType, Align, TeamRoleType, DocumentType } from '@okampus/shared/enums';
import { useTypedQuery, teamDashboardInfo, OrderBy } from '@okampus/shared/graphql';
import { isNotNull } from '@okampus/shared/utils';

import type { DocumentBaseInfo, TeamDashboardInfo } from '@okampus/shared/graphql';
import type { ExternalFile } from '@okampus/shared/types';

function renderDocument(showFile: (file: File | ExternalFile) => void, document?: DocumentBaseInfo) {
  if (!document) return <TextBadge color="grey" label="Manquant" />;
  if (!document.fileUpload) return <Skeleton height={32} width={32} />;

  const file = document.fileUpload;
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
        const user = value.teamMembersAggregate.nodes.find((member) =>
          member.teamMemberRoles.some(({ role }) => role.type === TeamRoleType.Director)
        )?.user;

        if (!user) return <TextBadge color="grey" label="Manquant" />;
        return <UserLabeled individual={user.individual} id={user.id} />;
      },
    },
    {
      align: Align.Left,
      label: 'Trésorier',
      render: (value: TeamDashboardInfo) => {
        const user = value.teamMembersAggregate.nodes.find((member) =>
          member.teamMemberRoles.some(({ role }) => role.type === TeamRoleType.Treasurer)
        )?.user;

        if (!user) return <TextBadge color="grey" label="Manquant" />;
        return <UserLabeled individual={user.individual} id={user.id} />;
      },
    },
    {
      align: Align.Left,
      label: 'Secrétaire',
      render: (value: TeamDashboardInfo) => {
        const user = value.teamMembersAggregate.nodes.find((member) =>
          member.teamMemberRoles.some(({ role }) => role.type === TeamRoleType.Secretary)
        )?.user;

        if (!user) return <TextBadge color="grey" label="Manquant" />;
        return <UserLabeled individual={user.individual} id={user.id} />;
      },
    },
    {
      label: 'Membres',
      render: (value: TeamDashboardInfo) => {
        const members = value.teamMembersAggregate.nodes.map((member) => member.user).filter(isNotNull);

        return <UserGroup users={members} itemsCount={value.teamMembersAggregate.aggregate?.count} />;
      },
    },
    {
      label: 'Trésorerie',
      render: (value: TeamDashboardInfo) => {
        return <TextFinance amount={value.accounts[0].financesAggregate.aggregate?.sum?.amount ?? 0} showRed={true} />;
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
      {
        where: { _or: [{ type: { _eq: TeamType.Association } }, { type: { _eq: TeamType.Club } }] },
        orderBy: [{ actor: { name: OrderBy.ASC } }],
      },
      teamDashboardInfo,
    ],
  });

  return (
    <div className="h-full">
      <Dashboard columns={columns} data={data?.team} />
    </div>
  );
}
