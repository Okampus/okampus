'use client';

import BannerImage from '../../../../../../../components/atoms/Image/BannerImage';
import TextBadge from '../../../../../../../components/atoms/Badge/TextBadge';
import UserGroup from '../../../../../../../components/atoms/Group/UserGroup';
import ModalLayout from '../../../../../../../components/atoms/Layout/ModalLayout';
import ViewLayout from '../../../../../../../components/atoms/Layout/ViewLayout';
import EventForm from '../../../../../../../components/forms/EventForm/EventForm';
import ActionButton from '../../../../../../../components/molecules/Button/ActionButton';
import FormSubmissionRender from '../../../../../../../components/molecules/Form/FormSubmissionRender';
import TextInput from '../../../../../../../components/molecules/Input/TextInput';
import UserLabeled from '../../../../../../../components/molecules/Labeled/UserLabeled';
import Dashboard from '../../../../../../../components/organisms/Dashboard';

import { useTeamManage, useTenant } from '../../../../../../../context/navigation';
import { useModal } from '../../../../../../../hooks/context/useModal';
import { useTranslation } from '../../../../../../../hooks/context/useTranslation';
import { useTypedQueryAndSubscribe } from '../../../../../../../hooks/apollo/useTypedQueryAndSubscribe';

import { EVENT_STATE_COLORS, EventState } from '@okampus/shared/enums';
import { OrderBy, eventOrganizeDetailsInfo, updateEventMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import { useMutation } from '@apollo/client';
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

import type { FormSchema, Submission } from '@okampus/shared/types';

export default function TeamManageEventsPage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);
  const { tenant } = useTenant();

  const { t, format } = useTranslation();
  const { openModal } = useModal();

  const stepsCount = tenant?.eventApprovalSteps.length;

  const variables = { where: { teamId: { _eq: teamManage?.id } }, orderBy: [{ event: { start: OrderBy.ASC } }] };
  const { data } = useTypedQueryAndSubscribe({
    queryName: 'eventOrganize',
    selector: [variables, eventOrganizeDetailsInfo],
  });

  const [updateEvent] = useMutation(updateEventMutation);

  const [search, setSearch] = useState('');

  if (!teamManage) return null;

  return (
    <ViewLayout header="Événements" scrollable={false}>
      <div className="flex gap-6 px-content pb-6">
        <TextInput
          prefix={<IconSearch className="text-[var(--text-2)]" />}
          value={search}
          paddingAfterPrefix={true}
          onChange={setSearch}
          options={{ placeholder: 'Rechercher un événement' }}
        />
        <ActionButton
          action={{
            label: 'Créer un événement',
            linkOrActionOrMenu: () => openModal(<EventForm teamManage={teamManage} />),
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
                    className="h-12 rounded"
                    src={eventOrganize.event.banner?.url}
                    name={eventOrganize.event.name}
                  />
                  <div className="flex flex-col">
                    <div className="font-semibold text-0">{eventOrganize.event.name}</div>
                    {eventOrganize.project ? (
                      <TextBadge label={eventOrganize.project.name} color={eventOrganize.project.color} />
                    ) : (
                      'Événement hors-projet'
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
              return <UserGroup users={eventOrganize.supervisors.map(({ teamMember }) => teamMember.user)} />;
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
                          openModal(
                            <ModalLayout header={`Validation de l'événement ${eventOrganize.event.name}`}>
                              <FormSubmissionRender
                                schema={tenant?.eventValidationForm?.schema as FormSchema}
                                submission={
                                  eventOrganize.event.eventApprovalSubmission?.submission as Submission<FormSchema>
                                }
                              />
                            </ModalLayout>
                          ),
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
                      openModal(
                        <ModalLayout
                          className="max-w-[40rem]"
                          header={t(`enums.EventState.${eventOrganize.event.state}`)}
                        >
                          <div className="flex flex-col gap-4">
                            {eventOrganize.event.eventApprovals.map(
                              (approval) =>
                                approval.createdBy?.user && (
                                  <>
                                    <div key={approval.id} className="flex flex-col gap-3">
                                      <div
                                        className={clsx(
                                          'text-lg flex items-center flex-wrap gap-2',
                                          approval.isApproved ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                                        )}
                                      >
                                        {approval.isApproved ? <IconCircleCheck /> : <IconCircleX />}
                                        {approval.eventApprovalStep?.name} : {approval.isApproved ? 'validé' : 'refusé'}{' '}
                                        par{' '}
                                        <UserLabeled
                                          individual={approval.createdBy}
                                          id={approval.createdBy.user.id}
                                          className="text-0"
                                        />
                                      </div>
                                      <div className="text-2">{approval.message}</div>
                                    </div>
                                    <hr className="border-[var(--border-2)]" />
                                  </>
                                )
                            )}
                          </div>
                        </ModalLayout>
                      )
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

                          // @ts-ignore
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
                            // @ts-ignore
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
                            // @ts-ignore
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
        data={data?.eventOrganize}
      />
    </ViewLayout>
  );
}
