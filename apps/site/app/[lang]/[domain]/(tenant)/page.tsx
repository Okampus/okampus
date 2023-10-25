import EmptyStateImage from '../../../_components/atoms/Image/EmptyStateImage';

import ViewLayout from '../../../_components/atoms/Layout/ViewLayout';
import ContentLayout from '../../../_components/layouts/ContentLayout';
import HomeSideBar from '../../../_components/layouts/SideBar/HomeSideBar';
import SimpleList from '../../../_components/molecules/List/SimpleList';
import EventCard from '../../../_components/molecules/Card/EventCard';

// import { useQueryAndSubscribe } from '../../../_hooks/apollo/useQueryAndSubscribe';

import prisma from '../../../../database/prisma/db';
import WelcomeHeader from '../../../_views/WelcomeHeader';
import { ReactComponent as EventsEmptyState } from '@okampus/assets/svg/empty-state/events.svg';
// import { GetEventsDocument, OrderBy } from '@okampus/shared/graphql';
// import { EventState } from '@prisma/client';

// import type { GetEventsQuery, GetEventsQueryVariables } from '@okampus/shared/graphql';

function DomainHomeGrid({ children }: { children: React.ReactNode }) {
  return (
    <SimpleList
      heading="Les derniers événements"
      groupClassName="mt-2 w-full grid grid-cols-[repeat(auto-fill,minmax(30rem,1fr))] gap-x-3 gap-y-8"
    >
      {children}
    </SimpleList>
  );
}

export async function generateStaticParams() {
  // recuperer les params
  const tenantDomain = await prisma.tenant.findMany({ select: { domain: true } });
  return tenantDomain.map((tenant) => ({ domain: tenant.domain }));
}

export default function DomainHomePage({ params: { domain } }: { params: { domain: string } }) {
  // const variables = {
  //   limit: 6,
  //   where: { start: { _gte: nowString }, state: { _eq: EventState.Published } },
  //   orderBy: [{ start: OrderBy.Asc }],
  // };

  // const { data, loading } = useQueryAndSubscribe<GetEventsQuery, GetEventsQueryVariables>({
  //   query: GetEventsDocument,
  //   variables,
  // });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const events: any[] | undefined = [];

  return (
    <>
      <HomeSideBar />
      <ViewLayout header={<WelcomeHeader />} sidePanelIcon={null}>
        <ContentLayout
          data={events}
          loading={true}
          render={({ data }) => data.map((event) => <EventCard key={event.id} event={event} />)}
          emptyState={
            <EmptyStateImage
              className="md:mt-10"
              image={<EventsEmptyState />}
              title="Aucun événement à venir"
              subtitle="Vous retrouverez les événements à venir sur la page d'accueil"
            />
          }
          innerWrapper={DomainHomeGrid}
        />
      </ViewLayout>
    </>
  );
}

export { DomainHomeGrid };
