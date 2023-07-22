'use client';

import ViewLayout from '../../../../../../components/atoms/Layout/ViewLayout';
import Dashboard from '../../../../../../components/organisms/Dashboard';
import ActionButton from '../../../../../../components/molecules/Button/ActionButton';
import UserLabeled from '../../../../../../components/molecules/Labeled/UserLabeled';

import { useTenantManage } from '../../../../../../context/navigation';

import { useTypedQuery, generateUserWithPointsInfoSelector } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';
import { download, groupBy, toCsv } from '@okampus/shared/utils';
import { IconDownload } from '@tabler/icons-react';
import { useMemo } from 'react';

import clsx from 'clsx';

import type { UserBaseInfo, UserWithPointsInfo } from '@okampus/shared/graphql';

type Month = {
  events: UserWithPointsInfo['eventJoins'];
  actions: UserWithPointsInfo['actions'];
  missions: UserWithPointsInfo['missionJoins'];
};

type GroupedUser = { user: UserBaseInfo; months: { [key: string]: Month } };

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

export default function TenantOrganizePointsPage({ params }: { params: { slug: string } }) {
  const { tenantManage } = useTenantManage(params.slug);

  const userWithPointsInfo = generateUserWithPointsInfoSelector(tenantManage?.id);
  const { data } = useTypedQuery({
    user: [
      {
        where: {
          _or: [
            {
              eventJoins: {
                participationProcessedAt: { _isNull: false },
              },
            },
            { actions: { pointsProcessedAt: { _isNull: false } } },
            { missionJoins: { pointsProcessedAt: { _isNull: false } } },
          ],
        },
      },
      userWithPointsInfo,
    ],
  });

  const months = useMemo(() => {
    const startingMonth = 9;
    const now = new Date();

    const monthsSinceStart = [];
    for (let m = startingMonth, y = now.getFullYear() - 1; y < now.getFullYear() || m <= now.getMonth() + 1; m++) {
      if (m > 11) {
        m = 0;
        y++;
      }

      monthsSinceStart.push(`${y}-${m.toString()}`);
    }

    return monthsSinceStart;
  }, []);

  const users = useMemo(() => groupByUser(data?.user || [], months), [months, data?.user]);

  const columns = [
    {
      data: ({ user }: { user: UserBaseInfo }) => user.individual.actor.name,
      label: 'Membre / Participant',
      render: ({ user }: { user: UserBaseInfo }) => {
        return <UserLabeled individual={user.individual} id={user.id} />;
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
            {points ? `${points} ${tenantManage?.pointName}` : '-'}
          </div>
        );
      },
    })),
  ];

  return (
    <ViewLayout header={`Bilan ${tenantManage?.pointName}`} scrollable={false} bottomPadded={false}>
      <ActionButton
        className="mb-4"
        action={{
          iconOrSwitch: <IconDownload />,
          label: 'Exporter le tableau',
          linkOrActionOrMenu: () => {
            const csv = toCsv(users, columns);
            download(
              URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })),
              `lxp-${tenantManage?.adminTeam?.actor.slug}-${new Date().toISOString()}.csv`
            );
          },
          type: ActionType.Action,
        }}
      />
      <Dashboard columns={columns} data={users} />
    </ViewLayout>
  );
}
