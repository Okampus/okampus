import TextBadge from '../../../../../../_components/atoms/Badge/TextBadge';
import BannerImage from '../../../../../../_components/atoms/Image/BannerImage';
import BaseView from '../../../../../../_components/templates/BaseView';

import Button from '../../../../../../_components/molecules/Button/Button';
import Dashboard from '../../../../../../_components/organisms/Dashboard';

// import { useTenantManage } from '../../../../../../_context/navigation';

import prisma from '../../../../../../../database/prisma/db';

import { tenantWithProcesses } from '../../../../../../../types/prisma/Tenant/tenant-with-processes';

import { getTranslation } from '../../../../../../../server/ssr/getTranslation';
import { eventWithApprovals } from '../../../../../../../types/prisma/Event/event-with-approvals';
import { EVENT_STATE_COLORS } from '@okampus/shared/consts';
import { ActionType } from '@okampus/shared/enums';

import { EventState } from '@prisma/client';
import { Check, X } from '@phosphor-icons/react/dist/ssr';

import Link from 'next/link';
// import { useState, useMemo } from 'react';

import { notFound } from 'next/navigation';
import type { DomainParams } from '../../../../../../params.type';

const REFUSED = 'refused';
const VALIDATED = 'validated';
const PUBLISHED = 'published';

export default async function TenantEventApprovalsPage({ params }: DomainParams) {
  // const { tenantManage } = useTenantManage();
  // TODO: fix where
  const tenantManage = await prisma.tenant.findFirst({
    where: { domain: params.domain },
    select: { ...tenantWithProcesses.select, scopedEvents: eventWithApprovals },
  });

  if (!tenantManage) notFound();

  const { t } = await getTranslation(params.locale);

  // const { openModal } = useModal();

  // const steps = tenantManage.scopedEventApprovalSteps;

  // const [selectedTab, setSelectedTab] = useState(steps[0].id || VALIDATED);

  // const tabs = [
  //   ...steps.map((step) => ({ key: step.id, label: step.name, onClick: () => setSelectedTab(step.id) })),
  //   { key: REFUSED, label: 'Refusés', onClick: () => setSelectedTab(REFUSED) },
  //   { key: VALIDATED, label: 'Validés', onClick: () => setSelectedTab(VALIDATED) },
  //   { key: PUBLISHED, label: 'Publiés', onClick: () => setSelectedTab(PUBLISHED) },
  // ];

  // const where = useMemo(() => {
  //   if (selectedTab === REFUSED) return { state: { _eq: EventState.Rejected } };
  //   if (selectedTab === VALIDATED) return { state: { _eq: EventState.Approved } };
  //   if (selectedTab === PUBLISHED) return { state: { _eq: EventState.Published } };
  //   return { nextApprovalStepId: { _eq: selectedTab }, state: { _eq: EventState.Submitted } };
  // }, [selectedTab]);

  // const variables = { where, orderBy: [{ start: OrderBy.Desc }] };
  // const { data } = useQueryAndSubscribe<GetEventsValidationQuery, GetEventsValidationQueryVariables>({
  //   query: GetEventsDocument,
  //   variables,
  // });

  // const events = data.event;

  if (!tenantManage) return null;

  return (
    <BaseView header="Validation des événements" unscrollable={true}>
      {/* <TabList className="shrink-0 mb-4" selected={selectedTab} tabs={tabs} /> */}
      <Dashboard
        columns={[
          {
            label: 'Événement',
            render: (event) => {
              return (
                <div className="flex gap-4 items-center">
                  <BannerImage className="h-12 rounded-xl" src={event.banner} name={event.name} />
                  <div>
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
              return null;
              // return <TeamGroup teams={event.eventOrganizes.map(({ team }) => team)} size={42} />;
            },
          },
          {
            label: 'Formulaire',
            render: (event) => {
              return (
                <div className="flex gap-2">
                  {event.eventApprovalSubmission ? (
                    <Button
                    // action={{
                    //   label: 'Voir',
                    //   linkOrActionOrMenu: () => {
                    //     // openModal({
                    //     //   node: (
                    //     //     <ModalLayout header={`Validation de l'événement ${event.name}`}>
                    //     //       {tenantManage.eventValidationForm && event.eventApprovalSubmission && (
                    //     //         <FormSubmissionRender
                    //     //           schema={tenantManage.eventValidationForm.schema as FormSchema}
                    //     //           submission={event.eventApprovalSubmission.submission as SubmissionType<FormSchema>}
                    //     //         />
                    //     //       )}
                    //     //     </ModalLayout>
                    //     //   ),
                    //     // });
                    //   },
                    // }}
                    >
                      Voir
                    </Button>
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
                  <TextBadge color={EVENT_STATE_COLORS[event.state]}>
                    {t('enums', `EventState.${event.state}`)}
                  </TextBadge>
                  <div
                    className="button-underline"
                    onClick={
                      () => {}
                      // openModal({
                      //   node: (
                      //     <ModalLayout className="max-w-[40rem]" header={t('enums', `EventState.${event.state}`)}>
                      //       <div className="flex flex-col gap-4">
                      //         {event.eventApprovals.map(
                      //           (approval) =>
                      //             approval.createdBy && (
                      //               <>
                      //                 <div key={approval.id} className="flex flex-col gap-3">
                      //                   <div
                      //                     className={clsx(
                      //                       'text-lg flex items-center flex-wrap gap-2',
                      //                       approval.isApproved ? 'text-[var(--success)]' : 'text-[var(--danger)]',
                      //                     )}
                      //                   >
                      //                     {approval.isApproved ? <CheckCircle /> : <XCircle />}
                      //                     {approval.eventApprovalStep.name} :{' '}
                      //                     {approval.isApproved ? 'validé' : 'refusé'} par{' '}
                      //                     <UserLabeled user={approval.createdBy} className="text-0" />
                      //                   </div>
                      //                   <div className="text-2">{approval.message}</div>
                      //                 </div>
                      //                 <hr className="border-[var(--border-2)]" />
                      //               </>
                      //             ),
                      //         )}
                      //       </div>
                      //     </ModalLayout>
                      //   ),
                      // })
                    }
                  >
                    Étape{' '}
                    {event.nextApprovalStep
                      ? event.nextApprovalStep.order
                      : tenantManage.scopedEventApprovalSteps.length}{' '}
                    / {tenantManage.scopedEventApprovalSteps.length}
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
                  <Button
                    type={ActionType.Success}
                    // action={{
                    //   iconOrSwitch: <Check />,
                    //   label: 'Valider',
                    //   type={ActionType.Success}

                    //   linkOrActionOrMenu: () => {
                    //     // openModal({ node: <EventApprovalForm event={event} isApproved={true} /> })
                    //   },
                    // }}
                  >
                    Valider
                    <Check />
                  </Button>
                  <Button
                    type={ActionType.Danger}
                    // action={{
                    //   iconOrSwitch: <X />,
                    //   label: 'Refuser',
                    //   type={ActionType.Danger}

                    //   linkOrActionOrMenu: () => {
                    //     // openModal({ node: <EventApprovalForm event={event} isApproved={false} /> })
                    //   },
                    // }}
                  >
                    Refuser
                    <X />
                  </Button>
                </div>
              ) : null;
            },
          },
        ]}
        data={tenantManage.scopedEvents}
      />
    </BaseView>
  );
}
