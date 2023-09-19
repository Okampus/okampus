'use client';

import BannerImage from '../../../../../../../components/atoms/Image/BannerImage';
import TextBadge from '../../../../../../../components/atoms/Badge/TextBadge';
import UserGroup from '../../../../../../../components/molecules/Group/UserGroup';
import ModalLayout from '../../../../../../../components/atoms/Layout/ModalLayout';
import ViewLayout from '../../../../../../../components/atoms/Layout/ViewLayout';
import EventForm from '../../../../../../../components/forms/MultiStepForm/EventForm/EventForm';
import ActionButton from '../../../../../../../components/molecules/Button/ActionButton';
import FormSubmissionRender from '../../../../../../../components/organisms/Form/FormSubmissionRender';
import TextInput from '../../../../../../../components/molecules/Input/TextInput';
import UserLabeled from '../../../../../../../components/molecules/Labeled/UserLabeled';
import Dashboard from '../../../../../../../components/organisms/Dashboard';

import { useTeamManage, useTenant } from '../../../../../../../context/navigation';
import { useModal } from '../../../../../../../hooks/context/useModal';
import { useTranslation } from '../../../../../../../hooks/context/useTranslation';
import { useQueryAndSubscribe } from '../../../../../../../hooks/apollo/useQueryAndSubscribe';

import { COLORS } from '@okampus/shared/consts';
import { EVENT_STATE_COLORS, EventState } from '@okampus/shared/enums';
import { GetEventOrganizesDocument, OrderBy, useUpdateEventMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import {
  IconArrowBack,
  IconCircleCheck,
  IconCircleX,
  IconEdit,
  IconPlus,
  IconSearch,
  IconUpload,
  IconWorldUpload,
} from '@tabler/icons-react';

import clsx from 'clsx';
import { useState } from 'react';

import type { Colors } from '@okampus/shared/enums';
import type { GetEventOrganizesQuery, GetEventOrganizesQueryVariables } from '@okampus/shared/graphql';
import type { FormSchema, Submission } from '@okampus/shared/types';

export default function TeamManageEventsPage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);
  const { tenant } = useTenant();

  const { t, format } = useTranslation();
  const { openModal } = useModal();

  const stepsCount = tenant?.eventApprovalSteps.length;

  const variables = {
    where: { team: { slug: { _eq: params.slug } } },
    orderBy: [{ event: { start: OrderBy.Asc } }],
  };

  const { data } = useQueryAndSubscribe<GetEventOrganizesQuery, GetEventOrganizesQueryVariables>({
    query: GetEventOrganizesDocument,
    variables,
  });

  const [updateEvent] = useUpdateEventMutation();

  const [search, setSearch] = useState('');

  if (!teamManage || !data) return null;

  const eventOrganizes = data.eventOrganize;

  return (
    <ViewLayout header="Événements" scrollable={false}>
      <div className="flex gap-6 px-content pb-6">
        <TextInput
          name="search"
          startContent={<IconSearch className="mr-2" />}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un événement"
        />
        <ActionButton
          action={{
            label: 'Créer un événement',
            linkOrActionOrMenu: () => openModal({ node: <EventForm teamManage={teamManage} /> }),
            iconOrSwitch: <IconPlus />,
            type: ActionType.Primary,
          }}
        />
      </div>
      <Dashboard
        columns={[
          {
            label: 'Événement',
            render: (eventOrganize) => {
              return (
                <div className="flex gap-4 items-center">
                  <BannerImage
                    className="h-12 rounded-xl"
                    src={eventOrganize.event.banner?.url}
                    name={eventOrganize.event.name}
                  />
                  <div className="flex flex-col">
                    <div className="font-semibold text-0">{eventOrganize.event.name}</div>
                    {eventOrganize.project ? (
                      <TextBadge
                        label={eventOrganize.project.name}
                        color={COLORS[eventOrganize.project.color as Colors]}
                      />
                    ) : (
                      'Nouveau projet'
                    )}
                  </div>
                </div>
              );
            },
          },
          {
            label: 'Date',
            render: (eventOrganize) => {
              const date = eventOrganize.event.start;
              if (!date) return null;
              return <div className="text-1 font-medium">{format('weekDay', new Date(date))}</div>;
            },
          },
          {
            label: 'Responsables',
            render: (eventOrganize) => {
              return <UserGroup users={eventOrganize.eventSupervisors.map((supervisor) => supervisor.user)} />;
            },
          },
          {
            label: 'Formulaire',
            render: (eventOrganize) => {
              return (
                <div className="flex gap-2">
                  {eventOrganize.event.eventApprovalSubmission ? (
                    <ActionButton
                      small={true}
                      action={{
                        label: 'Voir',
                        linkOrActionOrMenu: () =>
                          openModal({
                            node: (
                              <ModalLayout header={`Validation de l'événement ${eventOrganize.event.name}`}>
                                <FormSubmissionRender
                                  schema={tenant?.eventValidationForm?.schema as FormSchema}
                                  submission={
                                    eventOrganize.event.eventApprovalSubmission?.submission as Submission<FormSchema>
                                  }
                                />
                              </ModalLayout>
                            ),
                          }),
                      }}
                    />
                  ) : (
                    <div className="text-2">-</div>
                  )}
                </div>
              );
            },
          },
          {
            label: 'Validation',
            render: (eventOrganize) => {
              return (
                <div className="flex items-center gap-2">
                  <TextBadge
                    label={t(`enums.EventState.${eventOrganize.event.state}`)}
                    color={EVENT_STATE_COLORS[eventOrganize.event.state as EventState]}
                  />
                  <div
                    className="add-button"
                    onClick={() =>
                      openModal({
                        node: (
                          <ModalLayout
                            className="max-w-[40rem]"
                            header={t(`enums.EventState.${eventOrganize.event.state}`)}
                          >
                            <div className="flex flex-col gap-4">
                              {eventOrganize.event.eventApprovals.map(
                                (approval) =>
                                  approval.createdBy && (
                                    <>
                                      <div key={approval.id} className="flex flex-col gap-3">
                                        <div
                                          className={clsx(
                                            'text-lg flex items-center flex-wrap gap-2',
                                            approval.isApproved ? 'text-[var(--success)]' : 'text-[var(--danger)]',
                                          )}
                                        >
                                          {approval.isApproved ? <IconCircleCheck /> : <IconCircleX />}
                                          {approval.eventApprovalStep?.name} :{' '}
                                          {approval.isApproved ? 'validé' : 'refusé'} par{' '}
                                          <UserLabeled user={approval.createdBy} className="text-0" />
                                        </div>
                                        <div className="text-2">{approval.message}</div>
                                      </div>
                                      <hr className="border-[var(--border-2)]" />
                                    </>
                                  ),
                              )}
                            </div>
                          </ModalLayout>
                        ),
                      })
                    }
                  >
                    Étape{' '}
                    {eventOrganize.event.nextEventApprovalStep
                      ? eventOrganize.event.nextEventApprovalStep.order
                      : stepsCount}{' '}
                    / {stepsCount}
                  </div>
                </div>
              );
            },
          },
          {
            label: 'Action',
            render: (eventOrganize) => {
              return (
                <div className="flex gap-2">
                  {eventOrganize.event.state === EventState.Draft ? (
                    <ActionButton
                      small={true}
                      action={{
                        iconOrSwitch: <IconUpload />,
                        linkOrActionOrMenu: () => {
                          const state = eventOrganize.event.nextEventApprovalStep
                            ? EventState.Submitted
                            : EventState.Approved;

                          updateEvent({ variables: { id: eventOrganize.event.id, update: { state } } });
                        },
                      }}
                    />
                  ) : (
                    <ActionButton
                      small={true}
                      action={{
                        iconOrSwitch: <IconArrowBack />,
                        linkOrActionOrMenu: () => {
                          updateEvent({
                            variables: { id: eventOrganize.event.id, update: { state: EventState.Draft } },
                          });
                        },
                      }}
                    />
                  )}
                  {eventOrganize.event.state === EventState.Approved && (
                    <ActionButton
                      small={true}
                      action={{
                        iconOrSwitch: <IconWorldUpload />,
                        linkOrActionOrMenu: () => {
                          updateEvent({
                            variables: { id: eventOrganize.event.id, update: { state: EventState.Published } },
                          });
                        },
                      }}
                    />
                  )}
                  <ActionButton
                    small={true}
                    action={{
                      iconOrSwitch: <IconEdit />,
                      linkOrActionOrMenu: `/manage/event/${eventOrganize.event.slug}`,
                      type: ActionType.Action,
                    }}
                  />
                </div>
              );
            },
          },
        ]}
        data={eventOrganizes}
      />
    </ViewLayout>
  );
}
