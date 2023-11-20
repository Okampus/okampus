import Sidebar from '../../../../../../_components/layouts/Sidebar';
import SidebarBanner from '../../../../../../_components/layouts/SideBar/SidebarBanner';
import LinkListAccordeon from '../../../../../../_components/molecules/Accordeon/LinkListAccordeon';

import prisma from '../../../../../../../database/prisma/db';

import { teamWithProjects } from '../../../../../../../types/prisma/Team/team-with-projects';
import { urlJoin } from '../../../../../../../utils/url-join';

import { COLORS } from '@okampus/shared/consts';

import {
  PaintBrush,
  ShareNetwork,
  TreeStructure,
  UserPlus,
  Star,
  Ticket,
  Table,
  Target,
  Bank,
  Receipt,
  PlusSquare,
  Gavel,
  Notebook,
} from '@phosphor-icons/react/dist/ssr';
import { TeamType } from '@prisma/client';
import { notFound } from 'next/navigation';

import type { DomainSlugParams } from '../../../../../../params.type';
import type { TeamWithProjects } from '../../../../../../../types/prisma/Team/team-with-projects';
import type { LinkListAccordeonProps } from '../../../../../../_components/molecules/Accordeon/LinkListAccordeon';

function getAccordeons(team: TeamWithProjects): LinkListAccordeonProps['accordeons'] {
  const manageTeamRoute = (route: string) => urlJoin('/manage/team', team.slug, route);

  return [
    {
      title: 'Informations de la page',
      items: [
        {
          label: 'Personnalisation',
          href: `/manage/team/${team.slug}`,
          icon: <PaintBrush />,
          iconSelected: <PaintBrush weight="fill" />,
        },
        {
          label: 'Réseaux & contacts',
          href: manageTeamRoute('socials'),
          icon: <ShareNetwork />,
          iconSelected: <ShareNetwork weight="fill" />,
        },
      ],
    },
    {
      title: 'Membres',
      items: [
        {
          label: 'Équipe actuelle',
          href: manageTeamRoute('office'),
          icon: <TreeStructure />,
          iconSelected: <TreeStructure weight="fill" />,
        },
        {
          label: 'Adhésions',
          href: manageTeamRoute('joins'),
          icon: <UserPlus />,
          iconSelected: <UserPlus weight="fill" />,
        },
        // { label: 'Roles', href: manageTeamRoute('roles'), icon: <Users  />, iconSelected: <Users  weight="fill" /> },
      ],
    },
    {
      title: 'Événements',
      items: [
        {
          label: 'Missions',
          href: manageTeamRoute('missions'),
          icon: <Star />,
          iconSelected: <Star weight="fill" />,
        },
        {
          label: 'Événements',
          href: manageTeamRoute('events'),
          icon: <Ticket />,
          iconSelected: <Ticket weight="fill" />,
        },
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
      title: `${team.tenantScope.pointName}`,
      items: [
        {
          label: `Actions`,
          href: manageTeamRoute('actions'),
          icon: <Target />,
          iconSelected: <Target weight="fill" />,
        },
        {
          label: `Bilan ${team.tenantScope.pointName}`,
          href: manageTeamRoute('points'),
          icon: <Table />,
          iconSelected: <Table weight="fill" />,
        },
      ],
    },
    {
      title: 'Trésorerie & projets',
      items: [
        {
          label: 'Banque',
          href: manageTeamRoute('bank'),
          icon: <Bank />,
          iconSelected: <Bank weight="fill" />,
        },
        {
          label: 'Transactions',
          href: manageTeamRoute('transactions'),
          icon: <Receipt />,
          iconSelected: <Receipt weight="fill" />,
        },
        {
          label: 'Projets',
          href: manageTeamRoute('projects'),
          icon: <PlusSquare />,
          iconSelected: <PlusSquare weight="fill" />,
        },
        ...team.projects.map((project) => ({
          label: project.name,
          href: `/manage/project/${project.slug}`,
          icon: (
            <div className="flex justify-center items-center">
              <div className="rounded-[50%] w-3 h-3" style={{ backgroundColor: COLORS[project.color] }} />
            </div>
          ),
        })),
        // { label: 'Bilan', href: manageTeamRoute('balance'), icon: <Scales  />, iconSelected: <Scales  weight="fill" /> },
        // { label: 'Notes de frais', href: manageTeamRoute('expense-claims'), icon: <ReceiptRefund  />, iconSelected: <ReceiptRefund  weight="fill" /> },
        // { label: 'Subventions', href: manageTeamRoute('subsidies'), icon: <HandCoins  />, iconSelected: <HandCoins  weight="fill" /> },
      ],
    },
    ...(team.type === TeamType.Association || team.type === TeamType.Club
      ? [
          {
            title: 'Légal & passations',
            items: [
              {
                label: 'Situation légale',
                href: manageTeamRoute('legal'),
                icon: <Gavel />,
                iconSelected: <Gavel weight="fill" />,
              },
              // { label: 'Statuts & règlement', href: manageTeamRoute('status'), icon: <Notebook  />, iconSelected: <Notebook  weight="fill" /> },
              {
                label: 'Statuts & documents',
                href: manageTeamRoute('documents'),
                icon: <Notebook />,
                iconSelected: <Notebook weight="fill" />,
              },
            ],
          },
        ]
      : []),
  ];
}

export default async function ManageTeamLayout({ children, params }: { children: React.ReactNode } & DomainSlugParams) {
  const teamManage = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: teamWithProjects.select,
  });

  if (!teamManage) notFound();

  return (
    <>
      <Sidebar header={<SidebarBanner name={teamManage.actor.name} src={teamManage.actor.banner} />}>
        <LinkListAccordeon accordeons={getAccordeons(teamManage)} />
      </Sidebar>
      {children}
    </>
  );
}
