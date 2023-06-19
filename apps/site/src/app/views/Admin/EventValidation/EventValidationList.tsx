import { EventState } from '@okampus/shared/enums';
import {
  eventManageBaseInfo,
  // updateEventMutation,
  useTypedQuery,
} from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';
import { NavigationContext, useCurrentUser } from '@okampus/ui/hooks';
import { ActionButton, EventCard, TabsList } from '@okampus/ui/molecules';
// import { useMutation } from '@apollo/client';
import { useContext, useMemo, useState } from 'react';

const VALIDATE = 'validate';
const PENDING = 'pending';
const UPCOMING = 'upcoming';
const ARCHIVE = 'archive';
export function EventValidationList() {
  const { tenant } = useContext(NavigationContext);
  const { currentUser } = useCurrentUser();
  const [selectedTab, setSelectedTab] = useState(VALIDATE);

  const id = currentUser?.id;

  const now = new Date().toISOString();
  const where = useMemo(
    () =>
      selectedTab === VALIDATE
        ? {
            _or: [
              {
                eventApprovalStep: {
                  eventApprovalStepValidators: { individual: { userInfo: { id: { _eq: id } } } },
                },
              },
              {
                lastEventApprovalStepId: { _isNull: true },
              },
            ],
            state: { _eq: EventState.Submitted },
            end: { _gte: now },
          }
        : selectedTab === PENDING
        ? {
            eventApprovalStep: {
              eventApprovalStepValidators: { _not: { individual: { userInfo: { id: { _eq: id } } } } },
            },
            state: { _eq: EventState.Submitted },
            end: { _gte: now },
          }
        : selectedTab === UPCOMING
        ? { end: { _gte: now }, state: { _eq: EventState.Published } }
        : { end: { _lte: now } },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTab, id]
  );

  const { data } = useTypedQuery({ event: [{ where }, eventManageBaseInfo] });
  // const [updateEvent] = useMutation(updateEventMutation);
  // useEffect(() => {
  //   console.log('selectedTab', selectedTab, currentUser?.id);

  //   if (!id) return;

  //   getEvents({ variables: { where } });
  // }, [selectedTab, currentUser]);

  const tabs = [
    {
      key: VALIDATE,
      label: 'À valider',
      onClick: () => setSelectedTab(VALIDATE),
    },
    {
      key: PENDING,
      label: 'Validations en attente',
      onClick: () => setSelectedTab(PENDING),
    },
    {
      key: UPCOMING,
      label: 'Événements validés (à venir)',
      onClick: () => setSelectedTab(UPCOMING),
    },
    {
      key: ARCHIVE,
      label: 'Archives',
      onClick: () => setSelectedTab(ARCHIVE),
    },
  ];

  return (
    <div className="my-6 flex flex-col gap-6">
      <TabsList selected={selectedTab} tabs={tabs} />
      {data?.event.map((event) => (
        <div className="flex gap-4">
          <EventCard key={event.id as string} event={event} link={`/admin/event/${event.id}`} />
          <div className="flex flex-col items text-1">
            Étape actuelle: {event.eventApprovalStep?.name} / {event.state}
            <div className="flex gap-4">
              <ActionButton
                action={{
                  label: 'Valider',
                  linkOrActionOrMenu: () => {
                    if (!tenant) return;
                    // if (event.eventApprovalStep) {
                    //   const nextStep = tenant.eventApprovalSteps.find(
                    //     (step) => step.eventApprovalStep && step.eventApprovalStep.id === event.eventApprovalStep?.id
                    //   );
                    //   // if (nextStep) {
                    //   //   updateEvent({ variables: { id: event.id, update: { lastEventApprovalStepId: nextStep.id } } });
                    //   // } else {
                    //   //   updateEvent({ variables: { id: event.id, update: { state: EventState.Approved } } });
                    //   // }
                    // } else {
                    //   // const firstStep = tenant.eventApprovalSteps.find((step) => !step.eventApprovalStep);

                    //   // updateEvent({ variables: { id: event.id, update: { lastEventApprovalStepId: firstStep?.id } } });
                    // }
                  },
                  // linkOrActionOrMenu: () => tenant && updateEvent({ variables: { id: event.id, state: EventState.Published } }),
                  type: ActionType.Success,
                }}
              />
              <ActionButton
                action={{
                  label: 'Refuser',
                  linkOrActionOrMenu: () => {
                    if (!tenant) return;
                    // updateEvent({ variables: { id: event.id, update: { state: EventState.Rejected } } });
                  },
                  // linkOrActionOrMenu: () => tenant && updateEvent({ variables: { id: event.id, state: EventState.Published } }),
                  type: ActionType.Danger,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
