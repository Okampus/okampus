import BaseView from '../../../../../../_components/templates/BaseView';
import Dashboard from '../../../../../../_components/organisms/Dashboard';
import Button from '../../../../../../_components/molecules/Button/Button';
// import UserLabeled from '../../../../../../_components/molecules/Labeled/UserLabeled';

// import { download } from '../../../../../../../utils/download-file';
// import { useTenantManage } from '../../../../../../_context/navigation';

import prisma from '../../../../../../../database/prisma/db';
import { tenantDetails } from '../../../../../../../types/prisma/Tenant/tenant-details';
// import { useGetTenantUsersWithPointsQuery } from '@okampus/shared/graphql';

import { ActionType } from '@okampus/shared/enums';
import {
  groupBy,
  // toCsv
} from '@okampus/shared/utils';

import { Download } from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';
import { useMemo } from 'react';
import type { UserWithPoints } from '../../../../../../../types/prisma/User/user-with-points';

// import type { GetTenantUsersWithPointsQuery } from '@okampus/shared/graphql';
import type { DomainParams } from '../../../../../../params.type';

// type UserWithPoints = NonNullable<GetTenantUsersWithPointsQuery['user'][number]>;

type Month = { events: UserWithPoints['eventJoins']; missions: UserWithPoints['missionJoins'] };

type GroupedUser = { user: UserWithPoints; months: { [key: string]: Month } };

function groupByUser(users: UserWithPoints[], monthStrings: string[]): GroupedUser[] {
  const groupedUsers: GroupedUser[] = [];
  for (const user of users) {
    const groupedEventJoins = groupBy(user.eventJoins, (eventJoin) => {
      if (!eventJoin.processedAt) return { value: null };
      const date = new Date(eventJoin.processedAt);
      return { key: `${date.getFullYear()}-${date.getMonth()}`, value: eventJoin };
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
        missions: groupedMissions.groups[key] ?? [],
      };
    }

    groupedUsers.push({ user, months });
  }
  return groupedUsers;
}

// TODO: points pages
export default async function TenantOrganizePointsPage({ params }: DomainParams) {
  const tenantManage = await prisma.tenant.findFirst({
    where: { domain: params.domain },
    select: tenantDetails.select,
  });

  // const { data } = useGetTenantUsersWithPointsQuery();

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

  // const users = useMemo(() => groupByUser(data?.user ?? [], months), [months, data?.user]);

  const columns = [
    {
      data: ({ user }: GroupedUser) => user.actor.name,
      label: 'Membre / Participant',
      render: ({ user }: GroupedUser) => {
        return null;
        // return <UserLabeled user={user} />;
      },
    },
    ...months.map((month) => ({
      data: ({ months }: GroupedUser) => {
        let points = 0;
        const monthData = months[month];
        if (!monthData) return <div>-</div>;

        for (const eventJoin of monthData.events) points += eventJoin.event.pointsAwardedForAttendance;
        for (const missionJoin of monthData.missions) points += missionJoin.points ?? 0;

        return points;
      },
      label: month,
      render: ({ months }: GroupedUser) => {
        let points = 0;
        const monthData = months[month];
        if (!monthData) return <div>-</div>;

        for (const eventJoin of monthData.events) points += eventJoin.event.pointsAwardedForAttendance;
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
    <BaseView
      header={tenantManage ? `Bilan ${tenantManage.pointName}` : null}
      actionButtons={[
        tenantManage ? (
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
            //     //   `${tenantManage?.pointName}-${tenantManage.domain}-${new Date().toISOString()}.csv`,
            //     // );
            //   },
            // }}
          >
            <Download />
            Exporter le tableau
          </Button>
        ) : null,
      ]}
      unscrollable={true}
    >
      <Dashboard columns={columns} data={[]} />
    </BaseView>
  );
}
