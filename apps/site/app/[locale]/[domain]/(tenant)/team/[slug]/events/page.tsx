import EmptyStateImage from '../../../../../../_components/atoms/Image/EmptyStateImage';
import BaseView from '../../../../../../_components/templates/BaseView';
import ListView from '../../../../../../_components/templates/ListView';
import TeamSidePanel from '../../../../../../_components/layouts/SidePanel/TeamSidePanel';

import TeamSidebar from '../../../../../../_views/Team/TeamSidebar';

import prisma from '../../../../../../../database/prisma/db';

import { teamDetails } from '../../../../../../../types/prisma/Team/team-details';
import { eventWithTeams } from '../../../../../../../types/prisma/Event/event-with-teams';

import { EventDetailsItem } from '../../../../../../_components/atoms/Item/EventDetailsItem';
import { ReactComponent as EventsEmptyState } from '@okampus/assets/svg/empty-state/events.svg';
import { notFound } from 'next/navigation';

import type { DomainSlugParams } from '../../../../../../params.type';

export default async function TeamEventsPage({ params }: DomainSlugParams) {
  const team = await prisma.team.findFirst({
    where: { slug: params.slug },
    select: teamDetails.select,
  });

  if (!team) notFound();

  const events = await prisma.event.findMany({
    where: { eventOrganizes: { some: { team: { slug: params.slug } } } }, // TODO: better where
    select: eventWithTeams.select,
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
      <BaseView header="Événements" contentMode="centered-6xl">
        <ListView
          className="column-layout !gap-4"
          data={events}
          render={(event) => (
            <div key={event.id}>
              <EventDetailsItem event={event} />
              <hr className="border-[var(--border-1)] mt-4" />
            </div>
          )}
          emptyState={
            <EmptyStateImage
              image={<EventsEmptyState />}
              className="my-4 w-full"
              title="Aucun événement pour le moment"
              subtitle="Les prochains événements de l'équipe seront affichés ici."
            />
          }
        />
      </BaseView>
      <TeamSidePanel team={team} />
    </>
  );
}
