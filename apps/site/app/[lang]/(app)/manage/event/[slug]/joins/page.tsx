'use client';

import ViewLayout from '../../../../../../_components/atoms/Layout/ViewLayout';
import AvatarImage from '../../../../../../_components/atoms/Image/AvatarImage';
import EmptyStateImage from '../../../../../../_components/atoms/Image/EmptyStateImage';
import ActionButton from '../../../../../../_components/molecules/Button/ActionButton';
import FormSubmissionRender from '../../../../../../_components/organisms/Form/FormSubmissionRender';
import UserLabeled from '../../../../../../_components/molecules/Labeled/UserLabeled';
import ApprovalDashboard from '../../../../../../_components/organisms/ApprovalDashboard';

import { notificationAtom } from '../../../../../../_context/global';
import { useEventManage } from '../../../../../../_context/navigation';
import { useTranslation } from '../../../../../../_hooks/context/useTranslation';

import { ReactComponent as ToggleUserEmptyState } from '@okampus/assets/svg/empty-state/toggle-user.svg';

import { ApprovalState } from '@okampus/shared/enums';
import { useUpdateEventJoinMutation } from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';

import { ClockCounterClockwise } from '@phosphor-icons/react';
import { useAtom } from 'jotai';

import type { Submission, FormSchema } from '@okampus/shared/types';

export default function ManageEventAttendancePage({ params }: { params: { slug: string } }) {
  const { eventManage } = useEventManage(params.slug);
  const [, setNotification] = useAtom(notificationAtom);
  const [updateEventJoin] = useUpdateEventJoinMutation();

  const { t, format } = useTranslation();

  if (!eventManage) return null;

  return (
    <ViewLayout
      header="Validation des inscriptions"
      bottomPadded={false}
      scrollable={false}
      sidePanelIcon={<ClockCounterClockwise className="h-7 w-7" />}
    >
      <ApprovalDashboard
        className="pt-8"
        stateFilter={(join, states) => states.includes(join.state as ApprovalState)}
        searchFilter={(join, query) => {
          const lowerQuery = query.toLowerCase();
          const actor = join.joinedBy.actor;
          return (
            actor.name.toLowerCase().includes(lowerQuery) ||
            actor.email?.toLowerCase().includes(lowerQuery) ||
            join.joinedBy?.firstName.toLowerCase().includes(lowerQuery) ||
            join.joinedBy?.lastName.toLowerCase().includes(lowerQuery)
          );
        }}
        states={Object.values(ApprovalState).map((state) => ({
          label: t(`enums.ApprovalState.${state}`),
          value: state,
        }))}
        renderHeader={({ joinedBy }) => (
          <div className="flex items-center gap-2.5 text-0">
            Inscription de <UserLabeled user={joinedBy} small={true} />
          </div>
        )}
        renderItem={(join) => (
          <UserLabeled showCardOnClick={false} user={join.joinedBy} content={t(`enums.ApprovalState.${join.state}`)} />
        )}
        renderSelected={(join) => (
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 items-center">
              <AvatarImage actor={join.joinedBy.actor} size={18} type="user" />
              <div className="flex flex-col">
                <div className="text-1 font-semibold text-lg">{join.joinedBy.actor.name}</div>
                <div className="text-2 text-xs font-medium">{join.joinedBy.actor.email}</div>
              </div>
            </div>
            <hr className="border-[var(--border-3)]" />
            {join.joinFormSubmission && (
              <FormSubmissionRender
                schema={join.joinFormSubmission?.form.schema as FormSchema}
                submission={join.joinFormSubmission?.submission as Submission<FormSchema>}
              />
            )}
            <div className="flex flex-col text-0 gap-6">
              <div className="flex gap-4">
                {join.processedAt ? (
                  <div>
                    {t(`enums.ApprovalState.${join.state}`)} le {format('weekDayHour', new Date(join.processedAt))} par{' '}
                    {join.processedBy?.actor?.name}
                  </div>
                ) : (
                  <>
                    <ActionButton
                      action={{
                        label: `Accepter l'inscription`,
                        type: ActionType.Success,
                        linkOrActionOrMenu: () =>
                          updateEventJoin({
                            variables: { id: join.id, update: { state: ApprovalState.Approved } },
                            onCompleted: () => {
                              setNotification({
                                type: ToastType.Success,
                                message: `L'inscription de ${join.joinedBy.actor.name} a été acceptée !`,
                              });
                            },
                            onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
                          }),
                      }}
                    />
                    <ActionButton
                      action={{
                        label: 'Refuser',
                        type: ActionType.Danger,
                        linkOrActionOrMenu: () =>
                          updateEventJoin({
                            variables: { id: join.id, update: { state: ApprovalState.Rejected } },
                            onCompleted: () => {
                              setNotification({
                                type: ToastType.Info,
                                message: `L'inscription de ${join.joinedBy.actor.name} a été refusée !`,
                              });
                            },
                            onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
                          }),
                      }}
                    />
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
    </ViewLayout>
  );
}
