import BaseView from '../../../../../../../../_components/templates/BaseView';
import Dashboard from '../../../../../../../../_components/organisms/Dashboard';
import Button from '../../../../../../../../_components/molecules/Button/Button';
// import UserLabeled from '../../../../../../../../_components/molecules/Labeled/UserLabeled';

import prisma from '../../../../../../../../../database/prisma/db';
import { teamMemberMinimal } from '../../../../../../../../../types/prisma/TeamMember/team-member-minimal';
// import { useGetUsersWithPointsQuery } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/enums';
import { groupBy } from '@okampus/shared/utils';

import { Download, ClockCounterClockwise } from '@phosphor-icons/react/dist/ssr';

import clsx from 'clsx';
import { notFound } from 'next/navigation';
import { useMemo } from 'react';

import type { DomainSlugParams } from '../../../../../../../../params.type';
import type { UserWithPoints } from '../../../../../../../../../types/prisma/User/user-with-points';

// type UserWithPoints = NonNullable<GetUsersWithPointsQuery['user'][number]>;

type Month = {
  events: UserWithPoints['eventJoins'];
  // actions: UserWithPoints['actions'];
  missions: UserWithPoints['missionJoins'];
};

type GroupedUser = { user: UserWithPoints; months: { [key: string]: Month } };

function groupByUser(users: UserWithPoints[], monthStrings: string[]): GroupedUser[] {
  const groupedUsers: GroupedUser[] = [];
  for (const user of users) {
    const groupedEventJoins = groupBy(user.eventJoins, (eventJoin) => {
      if (!eventJoin.processedAt) return { value: null };
      const date = new Date(eventJoin.processedAt);
      return { key: `${date.getFullYear()}-${date.getMonth()}`, value: eventJoin };
    });

    // const groupedActions = groupBy(user.actions, (action) => {
    //   if (!action.processedAt) return { value: null };
    //   const date = new Date(action.processedAt);
    //   return { key: `${date.getFullYear()}-${date.getMonth()}`, value: action };
    // });

    const groupedMissions = groupBy(user.missionJoins, (missionJoin) => {
      if (!missionJoin.pointsProcessedAt) return { value: null };
      const date = new Date(missionJoin.pointsProcessedAt);
      return { key: `${date.getFullYear()}-${date.getMonth()}`, value: missionJoin };
    });

    // Merge all groups
    const months: { [key: string]: Month } = {};
    for (const key of monthStrings) {
      months[key] = {
        events: groupedEventJoins.groups[key] ?? [],
        // actions: groupedActions.groups[key] ?? [],
        missions: groupedMissions.groups[key] ?? [],
      };
    }

    groupedUsers.push({ user, months });
  }
  return groupedUsers;
}

export default async function TeamManagePointsPage({ params }: DomainSlugParams) {
  // const { teamManage } = useTeamManage(params.slug);
  // const { data: tenant } = useTenant();
  const teamManage = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: { slug: true, teamMembers: teamMemberMinimal, tenantScope: { select: { pointName: true } } },
  });

  if (!teamManage) notFound();

  // const UserWithPoints = generateUserWithPointsSelector(teamManage?.id);
  // const { data } = useGetUsersWithPointsQuery({ variables: { slug: params.slug } });

  const months = useMemo(() => {
    const startingMonth = 9;
    const now = new Date();

    const monthsSinceStart = [];
    for (
      let month = startingMonth, year = now.getFullYear() - 1;
      year < now.getFullYear() || month <= now.getMonth() + 1;
      month++
    ) {
      if (month > 11) {
        month = 0;
        year++;
      }

      monthsSinceStart.push(`${year}-${month.toString()}`);
    }

    return monthsSinceStart;
  }, []);

  // TODO: use data
  // const users = useMemo(() => groupByUser(data?.user || [], months), [months, data?.user]);

  const columns = [
    {
      data: ({ user }: { user: UserWithPoints }) => user.actor.name,
      label: 'Membre / Participant',
      render: ({ user }: { user: UserWithPoints }) => {
        return null;
        // return <UserLabeled user={user} />;
      },
    },
    ...months.map((month) => ({
      data: ({ months }: { months: { [key: string]: Month } }) => {
        let points = 0;
        const monthData = months[month];
        if (!monthData) return <div>-</div>;

        for (const eventJoin of monthData.events) points += eventJoin.event.pointsAwardedForAttendance;
        // for (const action of monthData.actions) points += action.points ?? 0;
        for (const missionJoin of monthData.missions) points += missionJoin.points ?? 0;

        return points;
      },
      label: month,
      render: ({ months }: { months: { [key: string]: Month } }) => {
        let points = 0;
        const monthData = months[month];
        if (!monthData) return <div>-</div>;

        for (const eventJoin of monthData.events) points += eventJoin.event.pointsAwardedForAttendance;
        // for (const action of monthData.actions) points += action.points ?? 0;
        for (const missionJoin of monthData.missions) points += missionJoin.points ?? 0;

        return (
          <div className={clsx('font-semibold', points && 'text-[var(--success)]')}>
            {points ? `${points} ${teamManage.tenantScope.pointName}` : '-'}
          </div>
        );
      },
    })),
  ];

  return (
    <BaseView
      header={teamManage.tenantScope ? `Bilan ${teamManage.tenantScope.pointName}` : null}
      unscrollable={true}
      paddingMode="none"
      sidePanelButton={<ClockCounterClockwise className="h-7 w-7" />}
      actionButtons={[
        teamManage?.tenantScope ? (
          <Button
            key="export"
            type={ActionType.Action}
            // action={{
            //   iconOrSwitch: <Download />,
            //   label: 'Exporter le tableau',
            //   linkOrActionOrMenu: () => {
            //     // const csv = toCsv(users, columns);
            //     // download(
            //     //   URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })),
            //     //   `${teamManage.tenantScope.pointName}-${teamManage.slug}-${getDateTimeString(new Date())}.csv`,
            //     // );
            //   },

            // }}
          >
            <Download />
            Exporter le tableau
          </Button>
        ) : null,
      ]}
    >
      <Dashboard
        columns={[
          {
            label: 'Membre / Participant',
            render: ({ user }) => {
              return null;
              // return <UserLabeled user={user} />;
            },
          },
          ...months.map((month) => ({
            label: month,
            render: ({ months }: { months: { [key: string]: Month } }) => {
              let points = 0;
              const monthData = months[month];
              if (!monthData) return <div>-</div>;

              for (const eventJoin of monthData.events) points += eventJoin.event.pointsAwardedForAttendance;
              // for (const action of monthData.actions) points += action.points ?? 0;
              for (const missionJoin of monthData.missions) points += missionJoin.points ?? 0;

              return (
                <div className={clsx('font-semibold', points && 'text-[var(--success)]')}>
                  {points ? `${points} ${teamManage.tenantScope.pointName}` : '-'}
                </div>
              );
            },
          })),
        ]}
        data={[]}
      />
    </BaseView>
  );
}
