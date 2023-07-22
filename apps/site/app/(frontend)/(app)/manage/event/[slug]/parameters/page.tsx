'use client';

import ViewLayout from '../../../../../../../components/atoms/Layout/ViewLayout';
import AvatarImage from '../../../../../../../components/atoms/Image/AvatarImage';
import ActionButton from '../../../../../../../components/molecules/Button/ActionButton';
import FormSubmissionRender from '../../../../../../../components/molecules/Form/FormSubmissionRender';
import UserLabeled from '../../../../../../../components/molecules/Labeled/UserLabeled';
import ApprovalDashboard from '../../../../../../../components/organisms/ApprovalDashboard';

import { notificationAtom } from '../../../../../../../context/global';
import { useEventManage } from '../../../../../../../context/navigation';

import { useTranslation } from '../../../../../../../hooks/context/useTranslation';

import { ApprovalState } from '@okampus/shared/enums';
import { updateEventJoinMutation } from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';

import { useMutation } from '@apollo/client';
import { useAtom } from 'jotai';

import type { FormField, Submission, FormSchema } from '@okampus/shared/types';

export default function ManageEventAttendancePage({ params }: { params: { slug: string } }) {
  const { eventManage } = useEventManage(params.slug);
  const [, setNotification] = useAtom(notificationAtom);

  const [updateEventJoin] = useMutation(updateEventJoinMutation);

  const { t } = useTranslation();

  if (!eventManage) return null;

  return (
    <ViewLayout header="Inscriptions" bottomPadded={false} scrollable={false}>
      <ApprovalDashboard
        className="mt-8"
        stateFilter={(join, states) => states.includes(join.state as ApprovalState)}
        searchFilter={(join, query) => {
          const lowerQuery = query.toLowerCase();
          const actor = join.joinedBy.individual?.actor;
          return (
            actor?.name.toLowerCase().includes(lowerQuery) ||
            actor?.email.toLowerCase().includes(lowerQuery) ||
            join.joinedBy?.firstName.toLowerCase().includes(lowerQuery) ||
            join.joinedBy?.lastName.toLowerCase().includes(lowerQuery)
          );
        }}
        states={Object.values(ApprovalState).map((state) => ({
          label: t(`enums.ApprovalState.${state}`),
          value: state,
        }))}
        renderHeader={(join) => (
          <div className="flex items-center gap-2.5 text-0">
            Inscription de <UserLabeled individual={join.joinedBy.individual} id={join.joinedBy.id} small={true} />
          </div>
        )}
        renderItem={(join) => (
          <UserLabeled
            showCardOnClick={false}
            individual={join.joinedBy.individual}
            id={join.joinedBy.id}
            content={t(`enums.ApprovalState.${join.state}`)}
          />
        )}
        renderSelected={(join) => (
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 items-center">
              <AvatarImage actor={join.joinedBy.individual?.actor} size={18} type="user" />
              <div className="flex flex-col">
                <div className="text-1 font-semibold text-lg">{join.joinedBy.individual?.actor?.name}</div>
                <div className="text-2 text-xs font-medium">{join.joinedBy.individual?.actor?.email}</div>
              </div>
            </div>
            <hr className="border-color-3" />
            <FormSubmissionRender
              schema={join.formSubmission?.form.schema as FormField[]}
              submission={join.formSubmission?.submission as Submission<FormSchema>}
            />
            <div className="flex flex-col text-0 gap-6">
              <div className="flex gap-4">
                {join.state === ApprovalState.Pending ? (
                  <>
                    <ActionButton
                      action={{
                        label: `Accepter l'inscription`,
                        type: ActionType.Success,
                        linkOrActionOrMenu: () =>
                          updateEventJoin({
                            // @ts-ignore
                            variables: { id: join.id, update: { state: ApprovalState.Approved } },
                            onCompleted: () => {
                              setNotification({
                                type: ToastType.Success,
                                message: `L'inscription de ${join.joinedBy.individual?.actor?.name} a été acceptée !`,
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
                            // @ts-ignore
                            variables: { id: join.id, update: { state: ApprovalState.Rejected } },
                            onCompleted: () => {
                              setNotification({
                                type: ToastType.Success,
                                message: `L'adhésion de ${join.joinedBy.individual?.actor?.name} a été refusée !`,
                              });
                            },
                            onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
                          }),
                      }}
                    />
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )}
        items={eventManage.eventJoins}
      />
    </ViewLayout>
  );
}
