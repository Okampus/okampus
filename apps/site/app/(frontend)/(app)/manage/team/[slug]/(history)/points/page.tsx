'use client';

import ViewLayout from '../../../../../../../../components/atoms/Layout/ViewLayout';
import Dashboard from '../../../../../../../../components/organisms/Dashboard';
import ActionButton from '../../../../../../../../components/molecules/Button/ActionButton';
import UserLabeled from '../../../../../../../../components/molecules/Labeled/UserLabeled';
import { useTeamManage, useTenant } from '../../../../../../../../context/navigation';
import { download } from '../../../../../../../../utils/download-file';

import { useGetUsersWithPointsQuery } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';
import { groupBy, toCsv } from '@okampus/shared/utils';

import { IconDownload, IconHistory } from '@tabler/icons-react';

import clsx from 'clsx';
import { useMemo } from 'react';

import type { GetUsersWithPointsQuery } from '@okampus/shared/graphql';

type UserWithPointsInfo = NonNullable<GetUsersWithPointsQuery['user'][number]>;

type Month = {
  events: UserWithPointsInfo['eventJoins'];
  actions: UserWithPointsInfo['actions'];
  missions: UserWithPointsInfo['missionJoins'];
};

type GroupedUser = { user: UserWithPointsInfo; months: { [key: string]: Month } };

function groupByUser(users: UserWithPointsInfo[], monthStrings: string[]): GroupedUser[] {
  const groupedUsers: GroupedUser[] = [];
  for (const user of users) {
    const groupedEventJoins = groupBy(user.eventJoins, (eventJoin) => {
      if (!eventJoin.processedAt) return { value: null };
      const date = new Date(eventJoin.processedAt);
      return { key: `${date.getFullYear()}-${date.getMonth()}`, value: eventJoin };
    });

    const groupedActions = groupBy(user.actions, (action) => {
      if (!action.pointsProcessedAt) return { value: null };
      const date = new Date(action.pointsProcessedAt);
      return { key: `${date.getFullYear()}-${date.getMonth()}`, value: action };
    });

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
        actions: groupedActions.groups[key] ?? [],
        missions: groupedMissions.groups[key] ?? [],
      };
    }

    groupedUsers.push({ user: user, months });
  }
  return groupedUsers;
}

export default function TeamManagePointsPage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);
  const { tenant } = useTenant();

  // const userWithPointsInfo = generateUserWithPointsInfoSelector(teamManage?.id);
  const { data } = useGetUsersWithPointsQuery({ variables: { slug: params.slug } });

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

  const users = useMemo(() => groupByUser(data?.user || [], months), [months, data?.user]);

  const columns = [
    {
      data: ({ user }: { user: UserWithPointsInfo }) => user.actor.name,
      label: 'Membre / Participant',
      render: ({ user }: { user: UserWithPointsInfo }) => {
        return <UserLabeled user={user} />;
      },
    },
    ...months.map((month) => ({
      data: ({ months }: { months: { [key: string]: Month } }) => {
        let points = 0;
        const monthData = months[month];
        if (!monthData) return <div>-</div>;

        for (const eventJoin of monthData.events) points += eventJoin.event.pointsAwardedForAttendance;
        for (const action of monthData.actions) points += action.points ?? 0;
        for (const missionJoin of monthData.missions) points += missionJoin.points ?? 0;

        return points;
      },
      label: month,
      render: ({ months }: { months: { [key: string]: Month } }) => {
        let points = 0;
        const monthData = months[month];
        if (!monthData) return <div>-</div>;

        for (const eventJoin of monthData.events) points += eventJoin.event.pointsAwardedForAttendance;
        for (const action of monthData.actions) points += action.points ?? 0;
        for (const missionJoin of monthData.missions) points += missionJoin.points ?? 0;

        return (
          <div className={clsx('font-semibold', points && 'text-[var(--success)]')}>
            {points ? `${points} ${tenant?.pointName}` : '-'}
          </div>
        );
      },
    })),
  ];

  return (
    <ViewLayout
      header={tenant ? `Bilan ${tenant.pointName}` : null}
      scrollable={false}
      bottomPadded={false}
      mobilePadded={false}
      sidePanelIcon={<IconHistory />}
      actions={[
        teamManage && tenant ? (
          <ActionButton
            key="export"
            action={{
              iconOrSwitch: <IconDownload />,
              label: 'Exporter le tableau',
              linkOrActionOrMenu: () => {
                const csv = toCsv(users, columns);
                download(
                  URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })),
                  `${tenant?.pointName}-${teamManage.slug}-${new Date().toISOString()}.csv`,
                );
              },
              type: ActionType.Action,
            }}
          />
        ) : null,
      ]}
    >
      <Dashboard
        columns={[
          {
            label: 'Membre / Participant',
            render: ({ user }) => {
              return <UserLabeled user={user} />;
            },
          },
          ...months.map((month) => ({
            label: month,
            render: ({ months }: { months: { [key: string]: Month } }) => {
              let points = 0;
              const monthData = months[month];
              if (!monthData) return <div>-</div>;

              for (const eventJoin of monthData.events) points += eventJoin.event.pointsAwardedForAttendance;
              for (const action of monthData.actions) points += action.points ?? 0;
              for (const missionJoin of monthData.missions) points += missionJoin.points ?? 0;

              return (
                <div className={clsx('font-semibold', points && 'text-[var(--success)]')}>
                  {points ? `${points} ${tenant?.pointName}` : '-'}
                </div>
              );
            },
          })),
        ]}
        data={users}
      />
    </ViewLayout>
  );
}
