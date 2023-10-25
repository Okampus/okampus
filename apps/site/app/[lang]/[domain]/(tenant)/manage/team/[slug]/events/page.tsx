'use client';

import BannerImage from '../../../../../../../_components/atoms/Image/BannerImage';
import TextBadge from '../../../../../../../_components/atoms/Badge/TextBadge';
import UserGroup from '../../../../../../../_components/molecules/Group/UserGroup';
import ModalLayout from '../../../../../../../_components/atoms/Layout/ModalLayout';
import ViewLayout from '../../../../../../../_components/atoms/Layout/ViewLayout';
import EventForm from '../../../../../../../_components/forms/MultiStepForm/EventForm/EventForm';
import ActionButton from '../../../../../../../_components/molecules/Button/ActionButton';
import FormSubmissionRender from '../../../../../../../_components/organisms/Form/FormSubmissionRender';
import TextInput from '../../../../../../../_components/molecules/Input/TextInput';
import UserLabeled from '../../../../../../../_components/molecules/Labeled/UserLabeled';
import Dashboard from '../../../../../../../_components/organisms/Dashboard';

import { useTeamManage, useTenant } from '../../../../../../../_context/navigation';
import { useModal } from '../../../../../../../_hooks/context/useModal';
import { useTranslation } from '../../../../../../../_hooks/context/useTranslation';
import { useQueryAndSubscribe } from '../../../../../../../_hooks/apollo/useQueryAndSubscribe';

import { COLORS, EVENT_STATE_COLORS } from '@okampus/shared/consts';
import {
  GetEventOrganizesDocument,
  OrderBy,
  useGetTenantEventApprovalDetailsQuery,
  useUpdateEventMutation,
} from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import { CheckCircle, XCircle, Pencil, Plus, MagnifyingGlass, Upload, Eye, EyeSlash } from '@phosphor-icons/react';
import { EventState } from '@prisma/client';

import clsx from 'clsx';
import { useState } from 'react';

import type { Colors } from '@prisma/client';
import type { GetEventOrganizesQuery, GetEventOrganizesQueryVariables } from '@okampus/shared/graphql';
import type { FormSchema, SubmissionType } from '@okampus/shared/types';

export default function TeamManageEventsPage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);
  const { tenant } = useTenant();

  const { t, format } = useTranslation();
  const { openModal } = useModal();

  const { data: tenantData } = useGetTenantEventApprovalDetailsQuery({ variables: { domain: tenant.domain } });
  const stepsCount = tenantData?.tenant[0].eventApprovalSteps.length;

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
          startContent={<MagnifyingGlass className="mr-2" />}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un événement"
        />
        <ActionButton
          action={{
            label: 'Créer un événement',
            linkOrActionOrMenu: () => openModal({ node: <EventForm teamManage={teamManage} /> }),
            iconOrSwitch: <Plus />,
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
                                    eventOrganize.event.eventApprovalSubmission
                                      ?.submission as SubmissionType<FormSchema>
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
                    label={t('enums', `EventState.${eventOrganize.event.state}`)}
                    color={EVENT_STATE_COLORS[eventOrganize.event.state as EventState]}
                  />
                  <div
                    className="add-button"
                    onClick={() =>
                      openModal({
                        node: (
                          <ModalLayout
                            className="max-w-[40rem]"
                            header={t('enums', `EventState.${eventOrganize.event.state}`)}
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
                                          {approval.isApproved ? <CheckCircle /> : <XCircle />}
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
                    {eventOrganize.event.nextApprovalStep ? eventOrganize.event.nextApprovalStep.order : stepsCount} /{' '}
                    {stepsCount}
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
                        iconOrSwitch: <Upload />,
                        linkOrActionOrMenu: () => {
                          const state = eventOrganize.event.nextApprovalStep
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
                        iconOrSwitch: <EyeSlash />,
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
                        iconOrSwitch: <Eye />,
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
                      iconOrSwitch: <Pencil />,
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
