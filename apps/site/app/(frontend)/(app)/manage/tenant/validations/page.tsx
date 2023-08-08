'use client';

import TextBadge from '../../../../../../components/atoms/Badge/TextBadge';
import TeamGroup from '../../../../../../components/molecules/Group/TeamGroup';
import BannerImage from '../../../../../../components/atoms/Image/BannerImage';
import ModalLayout from '../../../../../../components/atoms/Layout/ModalLayout';
import ViewLayout from '../../../../../../components/atoms/Layout/ViewLayout';

import EventApprovalModal from '../../../../../../components/modals/EventApprovalModal';
import ActionButton from '../../../../../../components/molecules/Button/ActionButton';
import FormSubmissionRender from '../../../../../../components/organisms/Form/FormSubmissionRender';
import UserLabeled from '../../../../../../components/molecules/Labeled/UserLabeled';
import TabList from '../../../../../../components/molecules/List/TabList';
import Dashboard from '../../../../../../components/organisms/Dashboard';

import { useTenantManage } from '../../../../../../context/navigation';
import { useTypedQueryAndSubscribe } from '../../../../../../hooks/apollo/useTypedQueryAndSubscribe';
import { useModal } from '../../../../../../hooks/context/useModal';
import { useTranslation } from '../../../../../../hooks/context/useTranslation';

import { EVENT_STATE_COLORS, EventState } from '@okampus/shared/enums';
import { OrderBy, eventManageInfo } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import { IconCheck, IconCircleCheck, IconCircleX, IconX } from '@tabler/icons-react';

import clsx from 'clsx';
import Link from 'next/link';
import { useState, useMemo } from 'react';

import type { FormSchema, Submission } from '@okampus/shared/types';

const REFUSED = 'refused';
const VALIDATED = 'validated';
const PUBLISHED = 'published';

export default function TenantValidationPage({ params }: { params: { slug: string } }) {
  const { tenantManage } = useTenantManage(params.slug);
  const { t } = useTranslation();

  const { openModal } = useModal();

  const steps = tenantManage?.eventApprovalSteps || [];
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
    return { nextEventApprovalStepId: { _eq: selectedTab }, state: { _eq: EventState.Submitted } };
  }, [selectedTab]);

  const variables = { where, orderBy: [{ start: OrderBy.ASC }] };
  const { data } = useTypedQueryAndSubscribe({ queryName: 'event', selector: [variables, eventManageInfo] });

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
                  <BannerImage className="h-12 rounded" src={event.banner?.url} name={event.name} />
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
              return <TeamGroup teams={event.eventOrganizes.map(({ team }) => team)} />;
            },
          },
          {
            label: 'Formulaire',
            render: (event) => {
              return (
                <div className="flex gap-2">
                  {event.eventApprovalSubmission ? (
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
                                  submission={event.eventApprovalSubmission?.submission as Submission<FormSchema>}
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
                    label={t(`enums.EventState.${event.state}`)}
                    color={EVENT_STATE_COLORS[event.state as EventState]}
                  />
                  <div
                    className="add-button"
                    onClick={() =>
                      openModal({
                        node: (
                          <ModalLayout className="max-w-[40rem]" header={t(`enums.EventState.${event.state}`)}>
                            <div className="flex flex-col gap-4">
                              {event.eventApprovals.map(
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
                                          {approval.eventApprovalStep?.name} :{' '}
                                          {approval.isApproved ? 'validé' : 'refusé'} par{' '}
                                          <UserLabeled
                                            individual={approval.createdBy}
                                            id={approval.createdBy?.user.id}
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
                        ),
                      })
                    }
                  >
                    Étape {event.nextEventApprovalStep ? event.nextEventApprovalStep.order : stepsCount} / {stepsCount}
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
                      iconOrSwitch: <IconCheck />,
                      label: 'Valider',
                      type: ActionType.Success,
                      linkOrActionOrMenu: () =>
                        openModal({ node: <EventApprovalModal event={event} isApproved={true} /> }),
                    }}
                  />
                  <ActionButton
                    action={{
                      iconOrSwitch: <IconX />,
                      label: 'Refuser',
                      type: ActionType.Danger,
                      linkOrActionOrMenu: () =>
                        openModal({ node: <EventApprovalModal event={event} isApproved={false} /> }),
                    }}
                  />
                </div>
              ) : null;
            },
          },
        ]}
        data={data?.event}
      />
    </ViewLayout>
  );
}
