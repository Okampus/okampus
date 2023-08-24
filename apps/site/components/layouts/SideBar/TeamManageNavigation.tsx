'use client';

import LinkListAccordeon from '../../molecules/Accordeon/LinkListAccordeon';
import { useTeamManage, useTenant } from '../../../context/navigation';

import { TeamType } from '@okampus/shared/enums';
import {
  IconBrush,
  IconNetwork,
  IconSitemap,
  // IconUsers,
  IconStar,
  IconTargetArrow,
  IconBuildingBank,
  IconReceipt,
  // IconScale,
  // IconReceiptRefund,
  // IconPigMoney,
  IconGavel,
  IconNotebook,
  // IconFolder,
  IconTicket,
  IconSquarePlus,
  IconTable,
  IconUsersPlus,
} from '@tabler/icons-react';

import type { LinkListAccordeonProps } from '../../molecules/Accordeon/LinkListAccordeon';
import type { TeamManageInfo, TenantInfo } from '../../../context/navigation';

function getAccordeons(team: TeamManageInfo, tenant?: TenantInfo): LinkListAccordeonProps['accordeons'] {
  const manageTeamRoute = (route: string) => `/manage/team/${team?.actor.slug}/${route}`;

  return [
    {
      heading: { label: 'Informations de la page' },
      items: [
        { label: 'Personnalisation', href: `/manage/team/${team?.actor.slug}`, icon: <IconBrush /> },
        { label: 'Réseaux & contacts', href: manageTeamRoute('socials'), icon: <IconNetwork /> },
      ],
    },
    {
      heading: { label: 'Membres' },
      items: [
        { label: 'Équipe actuelle', href: manageTeamRoute('office'), icon: <IconSitemap /> },
        { label: 'Adhésions', href: manageTeamRoute('joins'), icon: <IconUsersPlus /> },
        // { label: 'Roles', href: manageTeamRoute('roles'), icon: <IconUsers /> },
      ],
    },
    {
      heading: { label: 'Événements' },
      items: [
        { label: 'Missions', href: manageTeamRoute('missions'), icon: <IconStar /> },
        { label: 'Événements', href: manageTeamRoute('events'), icon: <IconTicket /> },
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
        { label: `Actions`, href: manageTeamRoute('actions'), icon: <IconTargetArrow /> },
        { label: `Bilan ${tenant?.pointName}`, href: manageTeamRoute('points'), icon: <IconTable /> },
      ],
    },
    {
      heading: { label: 'Trésorerie & projets' },
      items: [
        { label: 'Banque', href: manageTeamRoute('bank'), icon: <IconBuildingBank /> },
        { label: 'Transactions', href: manageTeamRoute('finances'), icon: <IconReceipt /> },
        { label: 'Projets', href: manageTeamRoute('projects'), icon: <IconSquarePlus /> },
        ...team.projects.map((project) => ({
          label: project.name,
          href: `/manage/project/${project.slug}`,
          icon: (
            <div className="flex justify-center items-center">
              <div className="rounded-[50%] w-3 h-3" style={{ backgroundColor: project.color }} />
            </div>
          ),
        })),
        // { label: 'Bilan', href: manageTeamRoute('balance'), icon: <IconScale /> },
        // { label: 'Notes de frais', href: manageTeamRoute('expense-claims'), icon: <IconReceiptRefund /> },
        // { label: 'Subventions', href: manageTeamRoute('subsidies'), icon: <IconPigMoney /> },
      ],
    },
    ...(team.type === TeamType.Association || team.type === TeamType.Club
      ? [
          {
            heading: { label: 'Légal & passations' },
            items: [
              { label: 'Situation légale', href: manageTeamRoute('legal'), icon: <IconGavel /> },
              // { label: 'Statuts & règlement', href: manageTeamRoute('status'), icon: <IconNotebook /> },
              { label: 'Statuts & documents', href: manageTeamRoute('documents'), icon: <IconNotebook /> },
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
