import EmptyStateImage from '../../../../../../_components/atoms/Image/EmptyStateImage';
import BoxItem from '../../../../../../_components/atoms/Item/ChoiceItem';
import MissionItem from '../../../../../../_components/atoms/Item/MissionItem';

import ListView from '../../../../../../_components/templates/ListView';
import TeamSidePanel from '../../../../../../_components/layouts/SidePanel/TeamSidePanel';

import BaseView from '../../../../../../_components/templates/BaseView';

import TeamSidebar from '../../../../../../_views/Team/TeamSidebar';

import prisma from '../../../../../../../database/prisma/db';

import { missionMinimal } from '../../../../../../../types/prisma/Mission/mission-minimal';

import { teamDetails } from '../../../../../../../types/prisma/Team/team-details';
import { ReactComponent as EventsEmptyState } from '@okampus/assets/svg/empty-state/events.svg';
import { notFound } from 'next/navigation';

import type { DomainSlugParams } from '../../../../../../params.type';

export default async function TeamJobsPage({ params }: DomainSlugParams) {
  const team = await prisma.team.findFirst({
    where: { slug: params.slug },
    select: teamDetails.select,
  });

  if (!team) notFound();

  const missions = await prisma.mission.findMany({
    where: {
      // NOT: { teamRoleId: null },
      team: { slug: params.slug },
    }, // TODO: better where
    select: missionMinimal.select,
  });

  // const variables = {
  //   where: { eventOrganizes: { team: { slug: { _eq: params.slug } } }, state: { _eq: 'Published' } },
  //   orderBy: [{ start: OrderBy.Asc }],
  // };

  // const { data, loading } = useQueryAndSubscribe<GetEventsQuery, GetEventsQueryVariables>({
  //   query: GetEventsDocument,
  //   variables,
  // });

  // const events = data?.event;

  return (
    <>
      <TeamSidebar team={team} />
      <BaseView header="Missions & postes à pourvoir" contentMode="centered-6xl">
        <ListView
          data={missions}
          // loading={loading}
          className="column-layout"
          emptyState={
            <EmptyStateImage
              image={<EventsEmptyState />}
              className="my-4 w-full"
              title="Aucun événement pour le moment"
              subtitle="Les prochains événements de l'équipe seront affichés ici."
            />
          }
          render={(mission) => (
            <BoxItem key={mission.id} action={`/team/${params.slug}`}>
              <MissionItem actor={team.actor} name={mission.teamRole?.name ?? mission.name} />
            </BoxItem>
          )}
        />
      </BaseView>
      <TeamSidePanel team={team} />
    </>
  );
}
