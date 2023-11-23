import BaseView from '../../../../../../../_components/templates/BaseView';
import AvatarImage from '../../../../../../../_components/atoms/Image/AvatarImage';
import EmptyStateImage from '../../../../../../../_components/atoms/Image/EmptyStateImage';
import Button from '../../../../../../../_components/molecules/Button/Button';
import FormSubmissionRender from '../../../../../../../_components/organisms/Form/FormSubmissionRender';
import UserLabeled from '../../../../../../../_components/molecules/Labeled/UserLabeled';
import ApprovalDashboard from '../../../../../../../_components/organisms/ApprovalDashboard';

import { eventDetails } from '../../../../../../../../types/prisma/Event/event-details';
import { formMinimal } from '../../../../../../../../types/prisma/Form/form-minimal';
import { userMinimal } from '../../../../../../../../types/prisma/User/user-minimal';

import { dateFormatters } from '../../../../../../../../utils/format/format';

import prisma from '../../../../../../../../database/prisma/db';

import { ReactComponent as ToggleUserEmptyState } from '@okampus/assets/svg/empty-state/toggle-user.svg';
// import { useUpdateEventJoinMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/enums';

import { ClockCounterClockwise } from '@phosphor-icons/react/dist/ssr';
import { ApprovalState } from '@prisma/client';
import { getFormatter, getTranslations } from 'next-intl/server';

import type { DomainSlugParams } from '../../../../../../../params.type';
import type { FormSchema, SubmissionType } from '@okampus/shared/types';

export default async function ManageEventAttendancePage({ params }: DomainSlugParams) {
  // const { eventManage } = useEventManage(params.slug);
  const eventManage = await prisma.event.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: {
      ...eventDetails.select,
      joinForm: formMinimal,
      eventJoins: {
        select: {
          id: true,
          joinFormSubmission: true,
          processedAt: true,
          state: true,
          joinedBy: userMinimal,
          processedBy: userMinimal,
        },
      },
      tenantScope: { select: { pointName: true } },
    },
  });
  // TODO
  // const [updateEventJoin] = useUpdateEventJoinMutation();

  const t = await getTranslations();
  const format = await getFormatter({ locale: params.locale });

  if (!eventManage) return null;

  return (
    <BaseView
      header="Validation des inscriptions"
      unscrollable={true}
      sidePanelButton={<ClockCounterClockwise className="h-7 w-7" />}
    >
      <ApprovalDashboard
        className="pt-8"
        stateFilter={(join, states) => states.includes(join.state)}
        searchFilter={(join, query) => {
          const lowerQuery = query.toLowerCase();
          const actor = join.joinedBy.actor;
          return (
            actor.name.toLowerCase().includes(lowerQuery) ||
            actor.email?.toLowerCase().includes(lowerQuery) ||
            join.joinedBy.firstName.toLowerCase().includes(lowerQuery) ||
            join.joinedBy.lastName.toLowerCase().includes(lowerQuery)
          );
        }}
        states={Object.values(ApprovalState).map((state) => ({
          label: t(`Enums.ApprovalState.${state}`),
          value: state,
        }))}
        renderHeader={({ joinedBy }) => (
          <div className="flex items-center gap-2.5 text-0">
            Inscription de <UserLabeled user={joinedBy} small={true} />
          </div>
        )}
        renderItem={(join) => (
          <UserLabeled showCardOnClick={false} user={join.joinedBy} content={t(`Enums.ApprovalState.${join.state}`)} />
        )}
        renderSelected={(join) => (
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 items-center">
              <AvatarImage actor={join.joinedBy.actor} size={18} />
              <div>
                <div className="text-1 font-semibold text-lg">{join.joinedBy.actor.name}</div>
                <div className="text-2 text-xs font-medium">{join.joinedBy.actor.email}</div>
              </div>
            </div>
            <hr className="border-[var(--border-3)]" />
            {eventManage.joinForm && join.joinFormSubmission && (
              <FormSubmissionRender
                // TODO: validate schema & submission
                schema={eventManage.joinForm.schema as FormSchema}
                submission={join.joinFormSubmission.submission as SubmissionType<FormSchema>}
              />
            )}
            <div className="flex flex-col text-0 gap-6">
              <div className="flex gap-4">
                {join.processedAt && join.processedBy ? (
                  <div>
                    {t(`Enums.ApprovalState.${join.state}`)} le{' '}
                    {format.dateTime(new Date(join.processedAt), dateFormatters.weekDayHour)} par{' '}
                    {join.processedBy.actor.name}
                  </div>
                ) : (
                  <>
                    <Button
                      type={ActionType.Success}
                      // action={{
                      //   label: `Accepter l'inscription`,
                      //   action={() => {}}
                      //   // TODO
                      //   // updateEventJoin({
                      //   //   variables: { id: join.id, update: { state: ApprovalState.Approved } },
                      //   //   onCompleted: () => {
                      //   //     setNotification({
                      //   //       type: ToastType.Success,
                      //   //       message: `L'inscription de ${join.joinedBy.actor.name} a été acceptée !`,
                      //   //     });
                      //   //   },
                      //   //   onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
                      //   // }),
                      // }}
                    >
                      Accepter l&apos;inscription
                    </Button>
                    <Button
                      type={ActionType.Danger}
                      // action={{
                      //   label: 'Refuser',
                      //   action={() => {}}
                      //   // TODO
                      //   // updateEventJoin({
                      //   //   variables: { id: join.id, update: { state: ApprovalState.Rejected } },
                      //   //   onCompleted: () => {
                      //   //     setNotification({
                      //   //       type: ToastType.Info,
                      //   //       message: `L'inscription de ${join.joinedBy.actor.name} a été refusée !`,
                      //   //     });
                      //   //   },
                      //   //   onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
                      //   // }),
                      // }}
                    >
                      Refuser
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        items={eventManage.eventJoins}
        emptyState={
          <EmptyStateImage
            image={<ToggleUserEmptyState className="max-w-sm" />}
            title={`Gérez les inscriptions de ${eventManage.name}`}
            subtitle="Sélectionner une inscription sur la gauche pour en voir les détails."
          />
        }
      />
    </BaseView>
  );
}
