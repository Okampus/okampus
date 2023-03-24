import { ValidateTeamJoinForm } from './ValidateTeamJoinForm';
import { ReactComponent as ValidateFilledIcon } from '@okampus/assets/svg/icons/material/filled/validate.svg';
import { ReactComponent as RefuseFilledIcon } from '@okampus/assets/svg/icons/material/filled/refuse.svg';
import { ReactComponent as CanceledFilledIcon } from '@okampus/assets/svg/icons/material/filled/cancel.svg';

import { ApprovalState } from '@okampus/shared/enums';
import {
  formSubmissionFragment,
  getFragmentData,
  userFragment,
  teamJoinFragment,
  updateTeamJoinMutation,
} from '@okampus/shared/graphql';

import { ActionButton, Avatar, Skeleton } from '@okampus/ui/atoms';
import { NavigationContext, useTeamManage } from '@okampus/ui/hooks';
import { LabeledTeamJoin } from '@okampus/ui/molecules';

import { DynamicFormSubmission } from '@okampus/ui/organisms';
import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';
import { getAvatar } from '@okampus/ui/utils';
import { formatDateDayOfWeek } from '@okampus/shared/utils';
import { ActionType, ToastType } from '@okampus/shared/types';
import { useContext, useState } from 'react';

import { useMutation } from '@apollo/client';

import type { FormSubmissionInfoFragment, UserInfoFragment, TeamJoinInfoFragment } from '@okampus/shared/graphql';

type TeamJoinViewProps = { column: React.ReactNode; panel: React.ReactNode };
const TeamJoinView = ({ column, panel }: TeamJoinViewProps) => (
  <div className="flex h-full">
    <div className="flex flex-col h-full border-r border-color-3 w-80 shrink-0">{column}</div>
    <div className="flex flex-col h-full w-full">{panel}</div>
  </div>
);

export type TeamJoinUser = {
  join: TeamJoinInfoFragment;
  joiner: UserInfoFragment;
  createdBy: UserInfoFragment | null;
  formSubmission: FormSubmissionInfoFragment | null;
};

export function TeamJoinManageView() {
  const { teamManage } = useTeamManage();

  const ALL = 'All';
  const tabs = [
    {
      label: 'Historique',
      value: ALL,
    },
    {
      label: 'En attente',
      value: ApprovalState.Pending,
    },
    {
      label: 'Acceptées',
      value: ApprovalState.Approved,
    },
    {
      label: 'Refusées',
      value: ApprovalState.Rejected,
    },
    {
      label: 'Annulées',
      value: ApprovalState.Canceled,
    },
  ];

  const [selectedTab, setSelectedTab] = useState<(typeof tabs)[number]>(tabs[0]);
  const [selectedUser, setSelectedUser] = useState<TeamJoinUser | null>(null);

  const [updateTeamJoin] = useMutation(updateTeamJoinMutation);

  const { showModal, hideModal, addNotification } = useContext(NavigationContext);

  // const teamJoinCards = {
  //   Team: {
  //     icon: TeamOutlinedIcon,
  //     iconFilled: TeamFilledIcon,
  //     iconClassName: 'text-blue-300',
  //     cardClassName: 'bg-blue-50 dark:bg-blue-900',
  //     label: 'postes à pourvoir',
  //     action: "Gérer les rôles de l'équipe",
  //   },
  //   [ApprovalState.Pending]: {
  //     icon: PendingOutlinedIcon,
  //     iconFilled: PendingFilledIcon,
  //     iconClassName: 'text-0',
  //     cardClassName: 'bg-0',
  //     label: 'en attente',
  //     action: 'Filtrer les adhésions en attente',
  //   },
  //   [ApprovalState.Approved]: {
  //     icon: ValidateOutlinedIcon,
  //     iconFilled: ValidateFilledIcon,
  //     iconClassName: 'text-green-400',
  //     cardClassName: 'bg-green-50 dark:bg-green-900',
  //     label: 'acceptées',
  //     action: 'Filtrer les adhésions acceptées',
  //   },
  //   [ApprovalState.Rejected]: {
  //     icon: RefuseOutlinedIcon,
  //     iconFilled: RefuseFilledIcon,
  //     iconClassName: 'text-red-400',
  //     cardClassName: 'bg-red-50 dark:bg-red-900',
  //     label: 'refusées',
  //     action: 'Filtrer les adhésions refusées',
  //   },
  //   [ApprovalState.Canceled]: {
  //     icon: CancelOutlinedIcon,
  //     iconFilled: CancelFilledIcon,
  //     iconClassName: 'text-gray-400',
  //     cardClassName: 'bg-gray-50 dark:bg-slate-800',
  //     label: 'annulées',
  //     action: 'Filtrer les adhésions annulées',
  //   },
  // };

  if (!teamManage || !teamManage.actor)
    return (
      <TeamJoinView
        column={
          <>
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} />
            ))}
          </>
        }
        panel={<Skeleton />}
      />
    );

  const joins = teamManage.joins.map((join) => {
    const loadedJoin = getFragmentData(teamJoinFragment, join);
    return {
      ...loadedJoin,
      createdBy: getFragmentData(
        userFragment,
        loadedJoin.createdBy?.__typename === 'UserModel' ? loadedJoin.createdBy : null
      ),
      joiner: getFragmentData(userFragment, loadedJoin.joiner),
      formSubmission: getFragmentData(formSubmissionFragment, loadedJoin.formSubmission) ?? null,
    };
  });

  const filteredJoins = selectedTab.value === ALL ? joins : joins.filter((join) => join.state === selectedTab.value);

  return (
    <TeamJoinView
      column={
        <div className="flex flex-col border-color-3">
          <div className="bg-0 pl-[var(--padding-view)] pr-6 py-4 font-heading h-20 flex items-center">
            <div className="flex justify-between">
              <div className="flex gap-1.5 items-center">
                <div className="text-0 text-xl font-bold">{selectedTab.label}</div>
                <div className="text-2 text-xl">({filteredJoins.length})</div>
              </div>
              <div className="flex gap-2">
                {/* <Popover>
                  <PopoverTrigger>
                    <button className="text-0 bg-1 rounded-xl p-2.5">
                      <FilterFilledIcon className="w-6 h-6" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="bg-0 rounded-2xl">

                  </PopoverContent>
                </Popover> */}
                {/* <button className="text-0 bg-1 rounded-xl p-2.5">
                  <EllipsisFilledIcon className="w-6 h-6" />
                </button> */}
              </div>
            </div>
          </div>
          <ul className="p-2 flex flex-col">
            {filteredJoins.map((join) => (
              <li key={join.id}>
                <LabeledTeamJoin
                  teamJoin={join}
                  joiner={join.joiner}
                  createdBy={join.createdBy ?? null}
                  formSubmission={join.formSubmission}
                  onClick={() =>
                    setSelectedUser({
                      join,
                      joiner: join.joiner,
                      createdBy: join.createdBy ?? null,
                      formSubmission: join.formSubmission,
                    })
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      }
      panel={
        <div>
          <div className="bg-0 px-view py-4 font-heading h-20 flex items-center">
            <div className="flex justify-between">
              <div className="flex gap-1.5 items-center">
                <div className="text-0 text-xl font-bold">
                  {selectedUser ? selectedUser.formSubmission?.description : "Vue d'ensemble"}
                </div>
              </div>
              {/* <div className="flex gap-2">
                <button className="text-0 bg-1 rounded-xl p-2.5">
                  <FilterFilledIcon className="w-6 h-6" />
                </button>
                <button className="text-0 bg-1 rounded-xl p-2.5">
                  <EllipsisFilledIcon className="w-6 h-6" />
                </button>
              </div> */}
            </div>
          </div>
          <div className="p-view">
            {selectedUser ? (
              <div className="flex flex-col gap-6">
                <div className="flex gap-10 items-center">
                  <div className="flex gap-item items-center">
                    <Avatar
                      size={36}
                      src={getAvatar(selectedUser.joiner.actor?.actorImages)}
                      name={selectedUser.joiner.actor?.name}
                      rounded={AVATAR_USER_ROUNDED}
                    />
                    <div className="flex flex-col gap-1">
                      <div className="text-1 font-semibold text-4xl">{selectedUser.joiner.actor?.name}</div>
                      <div className="text-3 text-xl">
                        A candidaté{' '}
                        <span className="text-0 font-medium">{formatDateDayOfWeek(selectedUser.join?.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="border-color-3" />
                <DynamicFormSubmission fields={selectedUser.formSubmission?.submission} />
                <hr className="border-color-3" />
                <div className="flex flex-col text-0 gap-6">
                  <div className="flex gap-12">
                    <div className="flex flex-col gap-2">
                      <div className="font-heading font-semibold text-2 text-lg">Rôle souhaité</div>
                      <div style={{ color: selectedUser.join.askedRole.color }} className="font-semibold">
                        {selectedUser.join.askedRole.name}
                      </div>
                    </div>
                    {selectedUser.join.state === ApprovalState.Approved && (
                      <div className="flex flex-col gap-2">
                        <div className="font-heading font-semibold text-2 text-lg">Rôle attribué</div>
                        <div style={{ color: selectedUser.join.askedRole.color }} className="font-semibold">
                          {selectedUser.join.receivedRole?.name}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-item">
                    {selectedUser.join.state === ApprovalState.Pending ? (
                      <>
                        <ActionButton
                          variant={ActionType.Confirm}
                          onClick={() => {
                            showModal({
                              title: `Adhésion de ${selectedUser.joiner.actor?.name}`,
                              content: (
                                <ValidateTeamJoinForm teamJoin={selectedUser} onSuccess={() => setSelectedUser(null)} />
                              ),
                            });
                          }}
                        >
                          Accepter la candidature
                        </ActionButton>
                        <ActionButton
                          variant={ActionType.Danger}
                          onClick={() =>
                            updateTeamJoin({
                              variables: {
                                updateTeamJoin: {
                                  id: selectedUser.join.id,
                                  state: ApprovalState.Rejected,
                                },
                              },
                              onCompleted: () => {
                                setSelectedUser(null);
                                addNotification({
                                  type: ToastType.Success,
                                  message: `L'adhésion de ${selectedUser.joiner.actor?.name} a été refusée !`,
                                });
                              },
                              onError: (error) =>
                                addNotification({
                                  type: ToastType.Error,
                                  message: error.message,
                                }),
                            })
                          }
                        >
                          Refuser
                        </ActionButton>
                      </>
                    ) : selectedUser.join.state === ApprovalState.Approved ? (
                      <div className="text-[var(--success)] flex gap-2 text-3xl font-heading font-semibold">
                        <ValidateFilledIcon className="h-8 w-8" />
                        Candidature approuvée
                        <span className="text-0 font-medium">{formatDateDayOfWeek(selectedUser.join?.updatedAt)}</span>
                      </div>
                    ) : selectedUser.join.state === ApprovalState.Rejected ? (
                      <div className="text-[var(--danger)] flex gap-2 text-3xl font-heading font-semibold">
                        <RefuseFilledIcon className="h-8 w-8" />
                        Candidature refusée
                        <span className="text-0 font-medium">{formatDateDayOfWeek(selectedUser.join?.updatedAt)}</span>
                      </div>
                    ) : (
                      <div className="text-gray-500 flex gap-2 text-3xl font-heading font-semibold">
                        <CanceledFilledIcon className="h-8 w-8" />
                        Candidature annulée
                        <span className="text-0 font-medium">{formatDateDayOfWeek(selectedUser.join?.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // <div>
              //   <div className="flex text-0 gap-item">
              //     <Avatar
              //       size={22}
              //       src={getAvatar(selectedUser.joiner.actor?.actorImages)}
              //       name={selectedUser.joiner.actor?.name}
              //       rounded={AVATAR_USER_ROUNDED}
              //     />
              //     <div className="flex flex-col font-heading">
              //       <div className="text-1 font-semibold">{selectedUser.joiner.actor?.name}</div>
              //       <div>{selectedUser.joiner.actor?.name}</div>
              //     </div>
              //   </div>
              // </div>
              <div className="text-0">
                <div className="text-0 text-xl font-bold">Aucune adhésion sélectionnée</div>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}
