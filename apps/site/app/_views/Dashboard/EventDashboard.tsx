'use client';

import TextBadge from '../../_components/atoms/Badge/TextBadge';
import BannerImage from '../../_components/atoms/Image/BannerImage';
import Button from '../../_components/molecules/Button/Button';
import UserStack from '../../_components/molecules/Stack/UserStack';
import Dashboard from '../../_components/organisms/Dashboard';

import { dateFormatters } from '../../../utils/format/format';

import { COLORS, EVENT_STATE_COLORS } from '@okampus/shared/consts';
import { ActionType } from '@okampus/shared/enums';

import { Eye, Upload, EyeSlash, Pencil } from '@phosphor-icons/react';
import { EventState } from '@prisma/client';
import { useFormatter, useTranslations } from 'next-intl';

import type { EventOrganizeManage } from '../../../types/prisma/EventOrganize/event-organize-manage';

export type EventDashboardProps = {
  eventOrganizes: EventOrganizeManage[];
  stepsCount: number;
};
export default function EventDashboard({ eventOrganizes, stepsCount }: EventDashboardProps) {
  const format = useFormatter();
  const t = useTranslations();

  return (
    <Dashboard
      columns={[
        {
          label: 'Événement',
          render: (eventOrganize) => {
            return (
              <div className="flex gap-4 items-center">
                <BannerImage
                  className="h-12 rounded-xl"
                  src={eventOrganize.event.banner}
                  name={eventOrganize.event.name}
                />
                <div>
                  <div className="font-semibold text-0">{eventOrganize.event.name}</div>
                  {eventOrganize.project ? (
                    <TextBadge color={COLORS[eventOrganize.project.color]}>{eventOrganize.project.name}</TextBadge>
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
            return (
              <div className="text-1 font-medium">{format.dateTime(new Date(date), dateFormatters.weekDayHour)}</div>
            );
          },
        },
        {
          label: 'Responsables',
          render: (eventOrganize) => {
            return <UserStack users={eventOrganize.eventSupervisors.map((supervisor) => supervisor.user)} />;
          },
        },
        {
          label: 'Formulaire',
          render: (eventOrganize) => {
            return (
              <div className="flex gap-2">
                {eventOrganize.event.eventApprovalSubmission ? (
                  <Button
                  // action={() =>
                  //   openModal({
                  //     title: `Validation de l'événement ${eventOrganize.event.name}`,
                  //     node: (
                  //       <FormSubmissionRender
                  //         schema={teamManage.tenantScope.eventValidationForm?.schema as FormSchema}
                  //         submission={
                  //           eventOrganize.event.eventApprovalSubmission?.submission as SubmissionType<FormSchema>
                  //         }
                  //       />
                  //     ),
                  //   })
                  // }
                  >
                    <Eye />
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
          render: (eventOrganize) => {
            return (
              <div className="flex items-center gap-2">
                <TextBadge color={EVENT_STATE_COLORS[eventOrganize.event.state]}>
                  {t(`Enums.EventState.${eventOrganize.event.state}`)}
                </TextBadge>
                <div
                  className="button-underline"
                  // onClick={() =>
                  //   openModal({
                  //     node: (
                  //       <ModalLayout
                  //         className="max-w-[40rem]"
                  //         header={t('enums', `EventState.${eventOrganize.event.state}`)}
                  //       >
                  //         <div className="flex flex-col gap-4">
                  //           {eventOrganize.event.eventApprovals.map(
                  //             (approval) =>
                  //               approval.createdBy && (
                  //                 <>
                  //                   <div key={approval.id} className="flex flex-col gap-3">
                  //                     <div
                  //                       className={clsx(
                  //                         'text-lg flex items-center flex-wrap gap-2',
                  //                         approval.isApproved ? 'text-[var(--success)]' : 'text-[var(--danger)]',
                  //                       )}
                  //                     >
                  //                       {approval.isApproved ? <CheckCircle /> : <XCircle />}
                  //                       {approval.eventApprovalStep?.name} :{' '}
                  //                       {approval.isApproved ? 'validé' : 'refusé'} par{' '}
                  //                       <UserLabeled user={approval.createdBy} className="text-0" />
                  //                     </div>
                  //                     <div className="text-2">{approval.message}</div>
                  //                   </div>
                  //                   <hr className="border-[var(--border-2)]" />
                  //                 </>
                  //               ),
                  //           )}
                  //         </div>
                  //       </ModalLayout>
                  //     ),
                  //   })
                  // }
                >
                  Étape {eventOrganize.event.nextApprovalStep ? eventOrganize.event.nextApprovalStep.order : stepsCount}{' '}
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
                  <Button
                    action={() => {
                      const state = eventOrganize.event.nextApprovalStep ? EventState.Submitted : EventState.Approved;
                      // updateEvent({ variables: { id: eventOrganize.event.id, update: { state } } });
                    }}
                  >
                    <Upload />
                    Envoyer
                  </Button>
                ) : (
                  <Button
                  // updateEvent({
                  //   variables: { id: eventOrganize.event.id, update: { state: EventState.Draft } },
                  // });
                  >
                    <EyeSlash />
                    Cacher
                  </Button>
                )}
                {eventOrganize.event.state === EventState.Approved && (
                  <Button
                  // updateEvent({
                  //   variables: { id: eventOrganize.event.id, update: { state: EventState.Published } },
                  // });
                  >
                    <Eye />
                    Publier
                  </Button>
                )}
                <Button
                  type={ActionType.Action}
                  action={`/manage/event/${eventOrganize.event.slug}`}
                  // small={true}
                  // action={{
                  //   iconOrSwitch: <Pencil />,
                  //   action={`/manage/event/${eventOrganize.event.slug}`}
                  //   type={ActionType.Action}

                  // }}
                >
                  Modifier
                  <Pencil />
                </Button>
              </div>
            );
          },
        },
      ]}
      data={eventOrganizes}
    />
  );
}
