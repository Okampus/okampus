import { ReactComponent as CheckCircleFilledIcon } from '@okampus/assets/svg/icons/material/filled/check-circle.svg';
import { ReactComponent as CloseCircleFilledIcon } from '@okampus/assets/svg/icons/material/filled/close-circle.svg';
import { ReactComponent as CanceledFilledIcon } from '@okampus/assets/svg/icons/material/filled/cancel.svg';
import { ReactComponent as FilterFilledIcon } from '@okampus/assets/svg/icons/material/filled/filter.svg';

import { ApprovalState, ControlType } from '@okampus/shared/enums';
import { insertChangeRole, updateTeamJoin } from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';
import { formatDateDayOfWeek } from '@okampus/shared/utils';

import { AvatarImage, Skeleton } from '@okampus/ui/atoms';
import { NavigationContext, useCurrentUser, useTeamManage } from '@okampus/ui/hooks';
import { ActionButton, LabeledTeamJoin } from '@okampus/ui/molecules';
import { FormModal, FormSubmissionRender } from '@okampus/ui/organisms';
import { getAvatar } from '@okampus/ui/utils';

import { useMutation } from '@apollo/client';
import { useContext, useState } from 'react';

import type { TeamJoinWithUserInfo } from '@okampus/shared/graphql';
import type { FormField, Submission, FormSchema } from '@okampus/shared/types';

export function TeamJoinManageView() {
  const { currentUser } = useCurrentUser();
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

  const [
    selectedTab,
    // setSelectedTab
  ] = useState<typeof tabs[number]>(tabs[0]);
  const [selectedTeamJoin, setSelectedTeamJoin] = useState<TeamJoinWithUserInfo | null>(null);

  const [updateJoin] = useMutation(updateTeamJoin);
  const [insertTeamChangeRole] = useMutation(insertChangeRole);

  const { showOverlay, hideOverlay, setNotification } = useContext(NavigationContext);

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

  const filteredJoins = teamManage
    ? selectedTab.value === ALL
      ? teamManage.teamJoins
      : teamManage.teamJoins.filter((join) => join.state === selectedTab.value)
    : [];

  return (
    <div className="flex w-full gap-10">
      <div className="flex flex-col h-full w-[22rem] shrink-0">
        {!teamManage || !teamManage.actor ? (
          Array.from({ length: 10 }).map((_, index) => <Skeleton key={index} />)
        ) : (
          <div className="flex flex-col">
            <div className="pl-6 pr-3 py-4 h-20 border-b border-color-2 flex items-center">
              <div className="flex justify-between w-full">
                <div className="flex gap-2.5 items-center">
                  <div className="title">{selectedTab.label}</div>
                  <div className="text-2 text-2xl">({filteredJoins.length})</div>
                </div>
                <div className="flex gap-2">
                  {/* <Popover>
                    <PopoverTrigger>
                      <button className="text-0 bg-1 rounded-lg p-2.5">
                        <FilterFilledIcon className="w-6 h-6" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-0 rounded-2xl">
  
                    </PopoverContent>
                  </Popover> */}
                  <button className="text-0 bg-2 rounded-lg p-2.5">
                    <FilterFilledIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
            <ul className="p-2 flex flex-col">
              {filteredJoins.map((join) => (
                <li key={join.id as string}>
                  <LabeledTeamJoin teamJoin={join} onClick={() => setSelectedTeamJoin(join)} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-col w-[calc(100%-20rem)]">
        {!teamManage || !teamManage.actor ? (
          <Skeleton />
        ) : (
          <div>
            {/* <div className="px-content py-4 h-20 border-b border-color-2 flex items-center">
            <div className="flex justify-between">
              <div className="flex gap-1.5 items-center">
                <div className="text-0 text-xl font-bold">Vue d'ensemble</div>
              </div>
              <div className="flex gap-2">
                <button className="text-0 bg-1 rounded-lg p-2.5">
                  <FilterFilledIcon className="w-6 h-6" />
                </button>
                <button className="text-0 bg-1 rounded-lg p-2.5">
                  <EllipsisFilledIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div> */}
            <div className="pt-6">
              {
                selectedTeamJoin ? (
                  <div className="flex flex-col gap-6">
                    <div className="flex gap-10 items-center">
                      <div className="flex gap-item items-center">
                        <AvatarImage
                          size={36}
                          src={getAvatar(selectedTeamJoin.userInfo.individualById?.actor?.actorImages)}
                          name={selectedTeamJoin.userInfo.individualById?.actor?.name}
                          type="user"
                        />
                        <div className="flex flex-col gap-1">
                          <div className="text-1 font-semibold text-4xl">
                            {selectedTeamJoin.userInfo.individualById?.actor?.name}
                          </div>
                          <div className="text-3 text-xl">
                            A candidaté{' '}
                            <span className="text-0 font-medium">
                              {formatDateDayOfWeek(selectedTeamJoin.createdAt as string)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <FormSubmissionRender
                      schema={selectedTeamJoin.formSubmission?.formEdit.newVersion as FormField[]}
                      submission={selectedTeamJoin.formSubmission?.submission as Submission<FormSchema>}
                    />
                    <div className="flex flex-col text-0 gap-6">
                      <div className="flex gap-12 px-1">
                        <div className="flex flex-col gap-2">
                          <div className="font-semibold text-2 text-lg">Rôle souhaité</div>
                          <div className="font-semibold text-2 text-lg">{selectedTeamJoin.role?.name}</div>
                        </div>
                        {selectedTeamJoin.state === ApprovalState.Approved && (
                          <div className="flex flex-col gap-2">
                            <div className="font-semibold text-2 text-lg">Rôle attribué</div>
                            {/* <div style={{ color: selectedTeamJoin.roleByReceivedRoleId?.color }} className="font-semibold">
                          {selectedTeamJoin.roleByReceivedRoleId?.name}
                        </div> */}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-item">
                        {selectedTeamJoin.state === ApprovalState.Pending ? (
                          <>
                            <ActionButton
                              action={{
                                label: 'Accepter la candidature',
                                type: ActionType.Success,
                                linkOrActionOrMenu: () =>
                                  showOverlay(
                                    <FormModal
                                      title="Attribuer un rôle"
                                      schema={
                                        [
                                          {
                                            name: 'role',
                                            label: 'Rôle attribué',
                                            type: ControlType.Select,
                                            options: teamManage.roles.map((role) => ({
                                              label: role?.name as string,
                                              value: role?.id as string,
                                            })),
                                            isRequired: true,
                                          },
                                        ] as const
                                      }
                                      submitOptions={{
                                        label: 'Attribuer',
                                        type: ActionType.Action,
                                        onSubmit: (values) => {
                                          insertTeamChangeRole({
                                            variables: {
                                              insert: {
                                                createdById: currentUser?.individualById?.id as string,
                                                tenantId: teamManage.tenantId as string,
                                                receivedPoleId: teamManage.poles?.[0]?.id as string,
                                                receivedRoleId: values.role,
                                                teamId: teamManage.id as string,
                                                userId: selectedTeamJoin.userInfo.id as string,
                                                note: '',
                                              },
                                            },
                                            onCompleted: (data) => {
                                              updateJoin({
                                                variables: {
                                                  id: selectedTeamJoin.id as string,
                                                  update: {
                                                    teamChangeRoleId: data.insertChangeRoleOne?.id as string,
                                                    state: ApprovalState.Approved,
                                                  },
                                                },
                                                onCompleted: () => {
                                                  setNotification({
                                                    type: ToastType.Success,
                                                    message: `${selectedTeamJoin.individual?.actor?.name} a rejoint l'équipe ${teamManage.actor?.name} !`,
                                                  });
                                                  setSelectedTeamJoin(null);
                                                  hideOverlay();
                                                },
                                                onError: (error) =>
                                                  setNotification({
                                                    type: ToastType.Error,
                                                    message: error.message,
                                                  }),
                                              });
                                            },
                                          });
                                        },
                                      }}
                                    />
                                  ),
                                // {
                                //   showButtonModal({
                                //     title: `Adhésion de ${selectedTeamJoin.userInfo.individualById?.actor?.name}`,
                                //     content: (
                                //       <ValidateTeamJoinForm
                                //         teamJoin={selectedTeamJoin}
                                //         onSuccess={() => setSelectedTeamJoin(null)}
                                //       />
                                //     ),
                                //   });
                                // },
                              }}
                            />
                            <ActionButton
                              action={{
                                label: 'Refuser la candidature',
                                type: ActionType.Danger,
                                linkOrActionOrMenu: () =>
                                  updateJoin({
                                    variables: {
                                      id: selectedTeamJoin.id as string,
                                      update: {
                                        state: ApprovalState.Rejected,
                                      },
                                    },
                                    onCompleted: () => {
                                      setSelectedTeamJoin(null);
                                      setNotification({
                                        type: ToastType.Success,
                                        message: `L'adhésion de ${selectedTeamJoin.userInfo.individualById?.actor?.name} a été refusée !`,
                                      });
                                    },
                                    onError: (error) =>
                                      setNotification({
                                        type: ToastType.Error,
                                        message: error.message,
                                      }),
                                  }),
                              }}
                            />
                          </>
                        ) : selectedTeamJoin.state === ApprovalState.Approved ? (
                          <div className="text-[var(--success)] flex gap-2 text-3xl font-semibold">
                            <CheckCircleFilledIcon className="h-8 w-8" />
                            Candidature approuvée
                            <span className="text-0 font-medium">
                              {formatDateDayOfWeek(selectedTeamJoin?.changeRole?.createdAt as string)}
                            </span>
                          </div>
                        ) : selectedTeamJoin.state === ApprovalState.Rejected ? (
                          <div className="text-[var(--danger)] flex gap-2 text-3xl font-semibold">
                            <CloseCircleFilledIcon className="h-8 w-8" />
                            Candidature refusée
                            <span className="text-0 font-medium">
                              {formatDateDayOfWeek(selectedTeamJoin?.changeRole?.createdAt as string)}
                            </span>
                          </div>
                        ) : (
                          <div className="text-gray-500 flex gap-2 text-3xl font-semibold">
                            <CanceledFilledIcon className="h-8 w-8" />
                            Candidature annulée
                            <span className="text-0 font-medium">
                              {formatDateDayOfWeek(selectedTeamJoin?.changeRole?.createdAt as string)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : null
                // <div className="text-0">
                //   <div className="text-0 text-xl font-bold">Aucune adhésion sélectionnée</div>
                // </div>
              }
            </div>
          </div>
        )}
      </div>
    </div>
    // <TeamJoinView
    //   column={
    //     <div className="flex flex-col">
    //       <div className="pl-6 pr-3 py-4 h-20 border-b border-color-2 flex items-center">
    //         <div className="flex justify-between w-full">
    //           <div className="flex gap-1.5 items-center">
    //             <div className="text-0 text-xl font-bold">{selectedTab.label}</div>
    //             <div className="text-2 text-xl">({filteredJoins.length})</div>
    //           </div>
    //           <div className="flex gap-2">
    //             {/* <Popover>
    //               <PopoverTrigger>
    //                 <button className="text-0 bg-1 rounded-lg p-2.5">
    //                   <FilterFilledIcon className="w-6 h-6" />
    //                 </button>
    //               </PopoverTrigger>
    //               <PopoverContent className="bg-0 rounded-2xl">

    //               </PopoverContent>
    //             </Popover> */}
    //             <button className="text-0 bg-2 rounded-lg p-2.5">
    //               <FilterFilledIcon className="w-6 h-6" />
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //       <ul className="p-2 flex flex-col">
    //         {filteredJoins.map((join) => (
    //           <li key={join.id as string}>
    //             <LabeledTeamJoin teamJoin={join} onClick={() => setSelectedTeamJoin(join)} />
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   }
    // />
  );
}
