'use client';

import TextBadge from '../../../../../_components/atoms/Badge/TextBadge';
import TeamGroup from '../../../../../_components/molecules/Group/TeamGroup';
import BannerImage from '../../../../../_components/atoms/Image/BannerImage';
import ModalLayout from '../../../../../_components/atoms/Layout/ModalLayout';
import ViewLayout from '../../../../../_components/atoms/Layout/ViewLayout';

import EventApprovalForm from '../../../../../_components/forms/MultiStepForm/EventApprovalForm/EventApprovalForm';
import ActionButton from '../../../../../_components/molecules/Button/ActionButton';
import FormSubmissionRender from '../../../../../_components/organisms/Form/FormSubmissionRender';
import UserLabeled from '../../../../../_components/molecules/Labeled/UserLabeled';
import TabList from '../../../../../_components/molecules/List/TabList';
import Dashboard from '../../../../../_components/organisms/Dashboard';

import { useTenantManage } from '../../../../../_context/navigation';
import { useQueryAndSubscribe } from '../../../../../_hooks/apollo/useQueryAndSubscribe';
import { useTranslation } from '../../../../../_hooks/context/useTranslation';
import { useModal } from '../../../../../_hooks/context/useModal';

import { GetEventsDocument, OrderBy } from '@okampus/shared/graphql';
import { EVENT_STATE_COLORS, EventState } from '@okampus/shared/enums';
import { ActionType } from '@okampus/shared/types';

import { Check, CheckCircle, XCircle, X } from '@phosphor-icons/react';

import clsx from 'clsx';
import Link from 'next/link';
import { useState, useMemo } from 'react';

import type { GetEventsValidationQuery, GetEventsValidationQueryVariables } from '@okampus/shared/graphql';
import type { FormSchema, Submission } from '@okampus/shared/types';

const REFUSED = 'refused';
const VALIDATED = 'validated';
const PUBLISHED = 'published';

export default function TenantEventApprovalsPage() {
  const { tenantManage } = useTenantManage();
  const { t } = useTranslation();

  const { openModal } = useModal();

  const steps = tenantManage?.eventApprovalSteps ?? [];
  const stepsCount = tenantManage?.eventApprovalSteps.length;

  const [selectedTab, setSelectedTab] = useState(steps[0]?.id || VALIDATED);

  const tabs = [
    ...steps.map((step) => ({ key: step.id, label: step.name, onClick: () => setSelectedTab(step.id) })),
    { key: REFUSED, label: 'Refusés', onClick: () => setSelectedTab(REFUSED) },
    { key: VALIDATED, label: 'Validés', onClick: () => setSelectedTab(VALIDATED) },
    { key: PUBLISHED, label: 'Publiés', onClick: () => setSelectedTab(PUBLISHED) },
  ];

  const where = useMemo(() => {
    if (selectedTab === REFUSED) return { state: { _eq: EventState.Rejected } };
    if (selectedTab === VALIDATED) return { state: { _eq: EventState.Approved } };
    if (selectedTab === PUBLISHED) return { state: { _eq: EventState.Published } };
    return { nextApprovalStepId: { _eq: selectedTab }, state: { _eq: EventState.Submitted } };
  }, [selectedTab]);

  const variables = { where, orderBy: [{ start: OrderBy.Desc }] };
  const { data } = useQueryAndSubscribe<GetEventsValidationQuery, GetEventsValidationQueryVariables>({
    query: GetEventsDocument,
    variables,
  });

  const events = data?.event;

  if (!tenantManage) return null;

  return (
    <ViewLayout header="Validation des événements" scrollable={false} bottomPadded={false}>
      <TabList className="shrink-0 mb-4" selected={selectedTab} tabs={tabs} />
      <Dashboard
        columns={[
          {
            label: 'Événement',
            render: (event) => {
              return (
                <div className="flex gap-4 items-center">
                  <BannerImage className="h-12 rounded-xl" src={event.banner?.url} name={event.name} />
                  <div className="flex flex-col">
                    <div className="font-semibold text-0">{event.name}</div>
                    <Link href={`/event/${event.slug}`} className="font-medium underline">
                      Voir les détails
                    </Link>
                  </div>
                </div>
              );
            },
          },
          {
            label: 'Organisateurs',
            render: (event) => {
              return <TeamGroup teams={event.eventOrganizes.map(({ team }) => team)} size={42} />;
            },
          },
          {
            label: 'Formulaire',
            render: (event) => {
              return (
                <div className="flex gap-2">
                  {event.approvalSubmission ? (
                    <ActionButton
                      small={true}
                      action={{
                        label: 'Voir',
                        linkOrActionOrMenu: () =>
                          openModal({
                            node: (
                              <ModalLayout header={`Validation de l'événement ${event.name}`}>
                                <FormSubmissionRender
                                  schema={tenantManage?.eventValidationForm?.schema as FormSchema}
                                  submission={event.approvalSubmission?.submission as Submission<FormSchema>}
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
            render: (event) => {
              return (
                <div className="flex items-center gap-2">
                  <TextBadge
                    label={t('enums', `EventState.${event.state}`)}
                    color={EVENT_STATE_COLORS[event.state as EventState]}
                  />
                  <div
                    className="add-button"
                    onClick={() =>
                      openModal({
                        node: (
                          <ModalLayout className="max-w-[40rem]" header={t('enums', `EventState.${event.state}`)}>
                            <div className="flex flex-col gap-4">
                              {event.eventApprovals.map(
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
                    Étape {event.nextApprovalStep ? event.nextApprovalStep.order : stepsCount} / {stepsCount}
                  </div>
                </div>
              );
            },
          },
          {
            label: 'Action',
            render: (event) => {
              return event.state === EventState.Submitted ? (
                <div className="flex gap-2">
                  <ActionButton
                    action={{
                      iconOrSwitch: <Check />,
                      label: 'Valider',
                      type: ActionType.Success,
                      linkOrActionOrMenu: () =>
                        openModal({ node: <EventApprovalForm event={event} isApproved={true} /> }),
                    }}
                  />
                  <ActionButton
                    action={{
                      iconOrSwitch: <X />,
                      label: 'Refuser',
                      type: ActionType.Danger,
                      linkOrActionOrMenu: () =>
                        openModal({ node: <EventApprovalForm event={event} isApproved={false} /> }),
                    }}
                  />
                </div>
              ) : null;
            },
          },
        ]}
        data={events}
      />
    </ViewLayout>
  );
}
