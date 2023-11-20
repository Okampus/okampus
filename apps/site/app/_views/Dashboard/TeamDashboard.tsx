'use client';

import TextBadge from '../../_components/atoms/Badge/TextBadge';
import TeamLabeled from '../../_components/molecules/Labeled/TeamLabeled';
import UserLabeled from '../../_components/molecules/Labeled/UserLabeled';
import UserStack from '../../_components/molecules/Stack/UserStack';
import Dashboard from '../../_components/organisms/Dashboard';

import { Align } from '@okampus/shared/enums';
import { isNotNull } from '@okampus/shared/utils';
import { TeamRoleType } from '@prisma/client';

import type { TeamDetails } from '../../../types/prisma/Team/team-details';

export type TeamDashboardProps = {
  header?: React.ReactNode;
  searchBarButtons?: React.ReactNode;
  teams: TeamDetails[];
};
export default function TeamDashboard({ header, searchBarButtons, teams }: TeamDashboardProps) {
  const columns = [
    {
      label: 'Association',
      render: (value: TeamDetails) => <TeamLabeled team={value} />,
    },
    {
      align: Align.Left,
      label: 'Président',
      render: (value: TeamDetails) => {
        const teamMember = value.teamMembers.find((member) =>
          member.teamMemberRoles.some(({ teamRole }) => teamRole.type === TeamRoleType.President),
        );

        if (!teamMember?.user) return <TextBadge color="grey">Manquant</TextBadge>;
        return <UserLabeled user={teamMember.user} />;
      },
    },
    {
      align: Align.Left,
      label: 'Trésorier',
      render: (value: TeamDetails) => {
        const teamMember = value.teamMembers.find((member) =>
          member.teamMemberRoles.some(({ teamRole }) => teamRole.type === TeamRoleType.Treasurer),
        );

        if (!teamMember?.user) return <TextBadge color="grey">Manquant</TextBadge>;
        return <UserLabeled user={teamMember.user} />;
      },
    },
    {
      align: Align.Left,
      label: 'Secrétaire',
      render: (value: TeamDetails) => {
        const teamMember = value.teamMembers.find((member) =>
          member.teamMemberRoles.some(({ teamRole }) => teamRole.type === TeamRoleType.Secretary),
        );

        if (!teamMember?.user) return <TextBadge color="grey">Manquant</TextBadge>;
        return <UserLabeled user={teamMember.user} />;
      },
    },
    {
      label: 'Membres',
      render: (value: TeamDetails) => {
        const members = value.teamMembers.map((member) => member.user).filter(isNotNull);

        return <UserStack users={members} itemsCount={value._count.teamMembers} />;
      },
    },
    // {
    //   label: 'Trésorerie',
    //   render: (value: TeamDetails) => {
    //     return (
    //       <IMoney amount={value.moneyAccounts.at(0)?.transactionsAggregate.aggregate?.sum?.amount ?? 0} showRed={true} />
    //     );
    //   },
    // },
    // {
    //   label: 'Statuts',
    //   render: (value: TeamDetails) => {
    //     const document = value.teamDocuments.find(({ type }) => type === DocumentType.AssociationConstitution);
    //     return renderDocument(previewFile, document);
    //   },
    // },
    // {
    //   label: 'Récépissé de déclaration',
    //   render: (value: TeamDetails) => {
    //     const document = value.teamDocuments.find(({ type }) => type === DocumentType.AssociationDeclaration);
    //     return renderDocument(previewFile, document);
    //   },
    // },
    // {
    //   label: 'Courrier de passation',
    //   render: (value: TeamDetails) => {
    //     const document = value.teamDocuments.find(({ type }) => type === DocumentType.ClubHandover);
    //     return renderDocument(previewFile, document);
    //   },
    // },
    // {
    //   align: Align.Center,
    //   label: 'Règlement intérieur',
    //   render: (value: TeamDetails) => {
    //     const document = value.teamDocuments.find(({ type }) => type === DocumentType.ClubCharter);
    //     return renderDocument(previewFile, document);
    //   },
    // },
  ];

  return <Dashboard className="h-full overflow-y-scroll scrollbar" columns={columns} data={teams} />;
}
