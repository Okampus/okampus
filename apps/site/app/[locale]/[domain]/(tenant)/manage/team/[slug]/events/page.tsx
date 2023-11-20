import BaseView from '../../../../../../../_components/templates/BaseView';
import TextInput from '../../../../../../../_components/molecules/Input/Uncontrolled/String/TextInput';

// import { useTeamManage, useTenant } from '../../../../../../../_context/navigation';

import prisma from '../../../../../../../../database/prisma/db';

// import { useTranslation } from '../../../../../../../_hooks/context/useTranslation';
import { getTranslation } from '../../../../../../../../server/ssr/getTranslation';
import { teamMemberMinimal } from '../../../../../../../../types/prisma/TeamMember/team-member-minimal';
import { teamWithProjects } from '../../../../../../../../types/prisma/Team/team-with-projects';

import EventDashboard from '../../../../../../../_views/Dashboard/EventDashboard';
import { eventOrganizeManage } from '../../../../../../../../types/prisma/EventOrganize/event-organize-manage';
// import { useUpdateEventMutation } from '@okampus/shared/graphql';
// import { ActionType } from '@okampus/shared/enums';

import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';

// import { useState } from 'react';

import { notFound } from 'next/navigation';
// import type { Colors } from '@prisma/client';
import type { DomainSlugParams } from '../../../../../../../params.type';

export default async function TeamManageEventsPage({ params }: DomainSlugParams) {
  const teamManage = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: {
      ...teamWithProjects.select,
      teamMembers: teamMemberMinimal,
      eventOrganizes: eventOrganizeManage,
      tenantScope: {
        select: { eventValidationForm: true, pointName: true, _count: { select: { scopedEventApprovalSteps: true } } },
      },
    },
  });

  if (!teamManage) notFound();

  const { t, format } = await getTranslation();
  // const { openModal } = useModal();

  // const { data: tenantData } = useGetTenantEventApprovalDetailsQuery({ variables: { domain: params.domain } });
  const stepsCount = teamManage.tenantScope._count.scopedEventApprovalSteps;

  // const variables = {
  //   where: { team: { slug: { _eq: params.slug } } },
  //   orderBy: [{ event: { start: OrderBy.Asc } }],
  // };

  // const { data } = useQueryAndSubscribe<GetEventOrganizesQuery, GetEventOrganizesQueryVariables>({
  //   query: GetEventOrganizesDocument,
  //   variables,
  // });

  // const [updateEvent] = useUpdateEventMutation();

  // const [search, setSearch] = useState('');

  if (!teamManage) return null;

  // const eventOrganizes = data.eventOrganize;

  return (
    <BaseView header="Événements" unscrollable={true}>
      <div className="flex gap-6 px-[var(--px-content)] pb-6">
        <TextInput
          name="search"
          start={<MagnifyingGlass className="mr-2" />}
          // onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un événement"
        />
        {/* TODO: event "new" page */}
        {/* <Button type={ActionType.Primary} action={() => openModal({ node: <EventForm teamManage={teamManage} /> })}>
          <Plus />
          Créer un événement
        </Button> */}
      </div>
      <EventDashboard
        eventOrganizes={teamManage.eventOrganizes}
        stepsCount={teamManage.tenantScope._count.scopedEventApprovalSteps}
      />
    </BaseView>
  );
}
