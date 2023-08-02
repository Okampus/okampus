import GroupItem from '../../../../../../components/atoms/Item/GroupItem';
import SideBar from '../../../../../../components/layouts/SideBar';
import EventManageSidePanel from '../../../../../../components/layouts/SidePanel/EventManageSidePanel';
import EventManageButton from '../../../../../../components/layouts/SideBar/ManageButton/EventManageButton';
import SidebarBanner from '../../../../../../components/layouts/SideBar/SidebarBanner';
import LinkList from '../../../../../../components/molecules/List/LinkList';
import ApolloSubscribe from '../../../../../../components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../../../components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../../ssr/getApolloQuery';

import { eventManageInfo } from '@okampus/shared/graphql';
import { unique } from '@okampus/shared/utils';

import { IconInfoHexagon, IconUsersPlus, IconUsers, IconCheckbox, IconArrowLeft } from '@tabler/icons-react';
import { notFound } from 'next/navigation';

import type { EventManageInfo } from '@okampus/shared/graphql';

type ManageEventLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default async function ManageEventLayout({ children, params }: ManageEventLayoutProps) {
  const query = [{ where: { slug: { _eq: params.slug } }, limit: 1 }, eventManageInfo];
  const [eventManage] = await getApolloQuery<EventManageInfo[]>('event', query, true).catch(() => []);

  if (!eventManage) notFound();

  const managingTeams = eventManage?.eventOrganizes.map((eventManage) => eventManage.team);
  const teams = unique(managingTeams, (item) => item.id);

  const manageEventRoute = (route: string) => `/manage/event/${eventManage?.slug}/${route}`;

  return (
    <>
      <ApolloWriteCache values={[[eventManage, eventManageInfo]]} />
      <ApolloSubscribe selector={{ eventByPk: [{ id: eventManage.id }, eventManageInfo] }} />
      <SideBar>
        <SidebarBanner name={eventManage?.name} banner={eventManage.banner?.url} />
        <EventManageButton slug={params.slug} manage={false} />
        <GroupItem heading="Paramètres" headingClassName="ml-3">
          <LinkList
            items={[
              { label: 'Informations', href: `/manage/event/${eventManage?.slug}`, icon: <IconInfoHexagon /> },
              { label: "Paramètres d'inscription", href: manageEventRoute('parameters'), icon: <IconUsersPlus /> },
            ]}
          />
        </GroupItem>
        <hr className="m-2 border-[var(--border-2)]" />
        <GroupItem heading="Présence" headingClassName="ml-3">
          <LinkList
            items={[
              { label: 'Inscriptions', href: manageEventRoute('joins'), icon: <IconUsers /> },
              { label: 'Liste de présence', href: manageEventRoute('attendance'), icon: <IconCheckbox /> },
            ]}
          />
        </GroupItem>
        <hr className="m-2 border-[var(--border-2)]" />
        <LinkList
          items={
            teams.map((team) => ({
              label: team.actor.name,
              href: `/manage/team/${team.actor.slug}/events`,
              icon: <IconArrowLeft />,
            })) || []
          }
        />
      </SideBar>
      {children}
      <EventManageSidePanel id={eventManage.id} />
    </>
  );
}
