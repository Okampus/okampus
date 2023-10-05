'use client';

import LinkListAccordeon from '../../molecules/Accordeon/LinkListAccordeon';
import { useTeamManage, useTenant } from '../../../_context/navigation';
import { urlJoin } from '../../../../utils/url-join';

import { TeamType } from '@okampus/shared/enums';
import {
  PaintBrush,
  ShareNetwork,
  TreeStructure,
  // Users,
  Star,
  Target,
  Bank,
  Receipt,
  // Scales,
  // ReceiptRefund,
  // HandCoins,
  Gavel,
  Notebook,
  // IconFolder,
  Ticket,
  PlusSquare,
  Table,
  UserPlus,
} from '@phosphor-icons/react';

import type { LinkListAccordeonProps } from '../../molecules/Accordeon/LinkListAccordeon';
import type { TeamManageInfo, TenantInfo } from '../../../../utils/apollo/fragments';

function getAccordeons(team: TeamManageInfo, tenant?: TenantInfo): LinkListAccordeonProps['accordeons'] {
  const manageTeamRoute = (route: string) => urlJoin('/manage/team', team.slug, route);

  return [
    {
      heading: { label: 'Informations de la page' },
      items: [
        { label: 'Personnalisation', href: `/manage/team/${team.slug}`, icon: <PaintBrush /> },
        { label: 'Réseaux & contacts', href: manageTeamRoute('socials'), icon: <ShareNetwork /> },
      ],
    },
    {
      heading: { label: 'Membres' },
      items: [
        { label: 'Équipe actuelle', href: manageTeamRoute('office'), icon: <TreeStructure /> },
        { label: 'Adhésions', href: manageTeamRoute('joins'), icon: <UserPlus /> },
        // { label: 'Roles', href: manageTeamRoute('roles'), icon: <Users /> },
      ],
    },
    {
      heading: { label: 'Événements' },
      items: [
        { label: 'Missions', href: manageTeamRoute('missions'), icon: <Star /> },
        { label: 'Événements', href: manageTeamRoute('events'), icon: <Ticket /> },
        // ...team.eventOrganizes.map(({ event }) => {
        //   return {
        //     label: event?.name,
        //     href: `/manage/event/${event?.slug}`,
        //     icon: (
        //       <div className="flex justify-center items-center">
        //         {/* <div className="rounded-[50%] w-3 h-3" style={{ backgroundColor: event.project?.color }} /> */}
        //       </div>
        //     ),
        //   };
        // }),
      ],
    },
    {
      heading: { label: `${tenant?.pointName}` },
      items: [
        { label: `Actions`, href: manageTeamRoute('actions'), icon: <Target /> },
        { label: `Bilan ${tenant?.pointName}`, href: manageTeamRoute('points'), icon: <Table /> },
      ],
    },
    {
      heading: { label: 'Trésorerie & projets' },
      items: [
        { label: 'Banque', href: manageTeamRoute('bank'), icon: <Bank /> },
        { label: 'Transactions', href: manageTeamRoute('transactions'), icon: <Receipt /> },
        { label: 'Projets', href: manageTeamRoute('projects'), icon: <PlusSquare /> },
        ...team.projects.map((project) => ({
          label: project.name,
          href: `/manage/project/${project.slug}`,
          icon: (
            <div className="flex justify-center items-center">
              <div className="rounded-[50%] w-3 h-3" style={{ backgroundColor: project.color }} />
            </div>
          ),
        })),
        // { label: 'Bilan', href: manageTeamRoute('balance'), icon: <Scales /> },
        // { label: 'Notes de frais', href: manageTeamRoute('expense-claims'), icon: <ReceiptRefund /> },
        // { label: 'Subventions', href: manageTeamRoute('subsidies'), icon: <HandCoins /> },
      ],
    },
    ...(team.type === TeamType.Association || team.type === TeamType.Club
      ? [
          {
            heading: { label: 'Légal & passations' },
            items: [
              { label: 'Situation légale', href: manageTeamRoute('legal'), icon: <Gavel /> },
              // { label: 'Statuts & règlement', href: manageTeamRoute('status'), icon: <Notebook /> },
              { label: 'Statuts & documents', href: manageTeamRoute('documents'), icon: <Notebook /> },
            ],
          },
        ]
      : []),
  ];
}

export default function TeamManageNavigation({ slug }: { slug: string }) {
  const { teamManage } = useTeamManage(slug);
  const { tenant } = useTenant();

  if (!teamManage || !tenant) return null;

  return <LinkListAccordeon mode="sidebar" accordeons={getAccordeons(teamManage, tenant)} />;
}
