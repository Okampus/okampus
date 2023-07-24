'use client';

import ActionButton from '../../../../../../../components/molecules/Button/ActionButton';
import UserLabeled from '../../../../../../../components/molecules/Labeled/UserLabeled';
import Dashboard from '../../../../../../../components/organisms/Dashboard';

import { useEventManage, useTenant } from '../../../../../../../context/navigation';
import { useTranslation } from '../../../../../../../hooks/context/useTranslation';

import { Align, ProcessedVia } from '@okampus/shared/enums';
import { updateEventJoinMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import { useMutation } from '@apollo/client';
import { IconCheck, IconX } from '@tabler/icons-react';

import clsx from 'clsx';

export default function ManageEventAttendancePage({ params }: { params: { slug: string } }) {
  const { eventManage } = useEventManage(params.slug);
  const { format } = useTranslation();

  const { tenant } = useTenant();

  const [updateEventJoin] = useMutation(updateEventJoinMutation);

  if (!eventManage) return null;

  return (
    <div className="flex flex-col h-full">
      <Dashboard
        columns={[
          {
            label: 'Participant',
            render: (eventJoin) => {
              return <UserLabeled individual={eventJoin.joinedBy.individual} id={eventJoin.joinedBy.id} />;
            },
          },
          // {
          //   label: 'Action du participant',
          //   align: Align.Right,
          //   render: (eventJoin) => {
          //     const attendance = eventJoin.eventAttendances[0];
          //     if (!attendance) return;

          //     // const action = eventJoin.action;
          //     // if (!action)
          //     //   return (
          //     //     <ActionButton
          //     //       className="w-full"
          //     //       action={{
          //     //         label: 'Ajouter une action',
          //     //         linkOrActionOrMenu: () =>
          //     //           showOverlay(
          //     //             <MultiStepForm
          //     //               defaultValues={getDefaultFormData(insertActionSchema)}
          //     //               title="Ajouter une action"
          //     //               onClose={hideOverlay}
          //     //               // onSubmit={(values) =>
          //     //               //   insertAction({
          //     //               //     variables: {
          //     //               //       object: {
          //     //               //         eventJoinId: eventJoin.id,
          //     //               //         ...values,
          //     //               //       },
          //     //               //     },
          //     //               //     onCompleted: ({ insertActionOne: data }) => {
          //     //               //       const id = eventJoin.id as string;
          //     //               //       mergeCache(
          //     //               //         { __typename: 'EventJoin', id },
          //     //               //         { fieldName: 'action', fragmentOn: 'Action', data }
          //     //               //       );
          //     //               //       hideOverlay();
          //     //               //     },
          //     //               //   })
          //     //               // }
          //     //               steps={[
          //     //                 {
          //     //                   label: "Description de l'action",
          //     //                   render: ({ values, setValues }) => (
          //     //                     <FormSchemaRender
          //     //                       schema={insertActionSchema}
          //     //                       data={values}
          //     //                       onChange={setValues}
          //     //                     />
          //     //                   ),
          //     //                 },
          //     //               ]}
          //     //             />
          //     //           ),
          //     //         // showButtonModal({
          //     //         //   title: 'Créer une action',
          //     //         //   content: (
          //     //         //     <EventInsertAction
          //     //         //       eventJoinId={eventJoin.id}
          //     //         //       userId={eventJoin.joinedBy.id}
          //     //         //       teamId={eventManage.teamEvents[0].teamId}
          //     //         //     />
          //     //         //   ),
          //     //         // }),,
          //     //         iconOrSwitch: <PlusIcon />,
          //     //       }}
          //     //     />
          //     //   );

          //     // return JSON.stringify(action);

          //     // return (
          //     //   <div className="flex gap-2 items-center text-lg font-semibold text-2">
          //     //     <Popover forcePlacement={true} placement="bottom-start" placementOffset={10}>
          //     //       <PopoverTrigger>
          //     //         <div className="flex gap-4 items-center">
          //     //           <div className="hover:underline">{action.name}</div>
          //     //           <div className="flex gap-2 items-center">
          //     //             <div className="text-lg font-medium text-green-400">
          //     //               +{action?.score} {tenant?.pointName}
          //     //             </div>
          //     //             <CheckCircleIcon className="text-green-400 h-7 w-7 mb-0.5" />
          //     //           </div>
          //     //         </div>
          //     //       </PopoverTrigger>
          //     //       <PopoverContent>
          //     //         <div className="card-md bg-4">
          //     //           <div className="title">
          //     //             {action.name}{' '}
          //     //             <span className="text-green-400">
          //     //               +{action.score} {tenant?.pointName}
          //     //             </span>
          //     //           </div>
          //     //           <div className="text-lg text-2">{action.description}</div>
          //     //         </div>
          //     //       </PopoverContent>
          //     //     </Popover>
          //     //     {/* <ActionButton action={{}} /> */}
          //     //   </div>
          //     //   // <div className="flex gap-4 text-lg font-semibold rounded bg-3 py-4 px-6 w-full">
          //     //   // <div className="text-xl font-medium">
          //     //   /* <span className="text-green-400">
          //     //       +{action.score} {tenant?.pointName}
          //     //     </span> */
          //     //   // </div>
          //     // );
          //   },
          // },
          {
            label: `${tenant?.pointName} Présence`,
            render: (eventJoin) => {
              const present = eventJoin.isPresent;
              return (
                <div className={clsx('font-medium', present ? 'text-green-400' : 'text-2')}>
                  {present === null
                    ? '-'
                    : present
                    ? `+${eventManage.pointsAwardedForAttendance} ${tenant?.pointName}`
                    : `0 ${tenant?.pointName}`}
                </div>
              );
            },
            align: Align.Center,
          },
          {
            label: 'Confirmation de présence / absence',
            classes: 'gap-4',
            align: Align.Right,
            render: (eventJoin) => {
              const isPresentButton = (
                <ActionButton
                  small={true}
                  action={{
                    label: 'Noter présent',
                    linkOrActionOrMenu: () =>
                      updateEventJoin({
                        // @ts-ignore
                        variables: { id: eventJoin.id, update: { isPresent: true } },
                      }),
                    iconOrSwitch: <IconCheck />,
                    type: ActionType.Success,
                  }}
                />
              );

              const isAbsentButton = (
                <ActionButton
                  small={true}
                  action={{
                    label: 'Noter absent',
                    linkOrActionOrMenu: () =>
                      updateEventJoin({
                        // @ts-ignore
                        variables: { id: eventJoin.id, update: { isPresent: false } },
                      }),
                    iconOrSwitch: <IconX />,
                  }}
                />
              );

              if (!eventJoin.participationProcessedAt)
                return (
                  <>
                    {isAbsentButton}
                    {isPresentButton}
                  </>
                );

              // const date = formatDateStandard(eventJoin.participationProcessedAt);
              // const time = formatHourSimple(eventJoin.participationProcessedAt);

              if (eventJoin.isPresent) {
                const via = eventJoin.participationProcessedVia === ProcessedVia.QR ? 'QR code validé' : 'Noté présent';
                return (
                  <>
                    <div className="font-medium w-full flex items-center justify-center gap-2 bg-green-100 dark:bg-green-900 py-1.5 px-4 rounded">
                      <IconCheck className="w-8 h-8 text-green-500" />
                      <div className="text-green-800 dark:text-green-300">
                        {via} le {format('weekDayHour', new Date(eventJoin.participationProcessedAt))}
                      </div>
                    </div>
                    {isAbsentButton}
                  </>
                );
              } else {
                return (
                  <>
                    <div className="font-medium w-full flex items-center justify-center gap-2 bg-red-100 dark:bg-red-900 py-1.5 px-4 rounded">
                      <IconX className="w-8 h-8 text-red-500" />
                      <div className="text-red-800 dark:text-red-200">
                        Noté absent le {format('weekDayHour', new Date(eventJoin.participationProcessedAt))}
                      </div>
                    </div>
                    {isPresentButton}
                  </>
                );
              }

              // if (!eventJoin.isPresent) return <div className="text-red-500">Désinscrit</div>;
              // return (
              //   <ActionButton
              //     className="w-full"
              //     action={{
              //       label: 'Noter présent',
              //       linkOrActionOrMenu: () => console.log('Noter présent'),
              //     }}
              //   />
              // );
            },
          },
          {
            label: 'Confirmé par',
            align: Align.Left,
            render: (eventJoin) => {
              // const attendance = eventJoin.eventAttendances[0];
              if (
                eventJoin.participationProcessedAt &&
                eventJoin.participationProcessedBy &&
                eventJoin.participationProcessedBy?.user
              ) {
                return (
                  <UserLabeled
                    id={eventJoin.participationProcessedBy.user.id}
                    individual={eventJoin.participationProcessedBy}
                  />
                );
              }
              return null;
            },
          },
        ]}
        data={eventManage.eventJoins}
      />
    </div>
  );
}
