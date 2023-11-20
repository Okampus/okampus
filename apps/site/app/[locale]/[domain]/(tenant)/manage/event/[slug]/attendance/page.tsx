import prisma from '../../../../../../../../database/prisma/db';
import BaseView from '../../../../../../../_components/templates/BaseView';
import Button from '../../../../../../../_components/molecules/Button/Button';
import UserLabeled from '../../../../../../../_components/molecules/Labeled/UserLabeled';
import Dashboard from '../../../../../../../_components/organisms/Dashboard';

// import { useEventManage, useTenant } from '../../../../../../../_context/navigation';

import { eventDetails } from '../../../../../../../../types/prisma/Event/event-details';
import { getTranslation } from '../../../../../../../../server/ssr/getTranslation';
import { Align } from '@okampus/shared/enums';
import { ActionType } from '@okampus/shared/enums';

import { Check, ClockCounterClockwise, X } from '@phosphor-icons/react/dist/ssr';

import { ProcessedVia } from '@prisma/client';
import clsx from 'clsx';
import type { DomainSlugParams } from '../../../../../../../params.type';

// TODO: static params
export default async function ManageEventAttendancePage({ params }: DomainSlugParams) {
  // const { eventManage } = useEventManage(params.slug);
  const eventManage = await prisma.event.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: { ...eventDetails.select, tenantScope: { select: { pointName: true } } },
  });

  const { format } = await getTranslation(params.locale);

  // const { data: tenant } = useTenant();

  // const [updateEventJoin] = useUpdateEventJoinMutation();

  if (!eventManage) return null;

  return (
    <BaseView header={`Gérer : ${eventManage.name}`} sidePanelButton={<ClockCounterClockwise className="h-7 w-7" />}>
      <Dashboard
        columns={[
          {
            label: 'Participant',
            render: (eventJoin) => {
              return <UserLabeled user={eventJoin.joinedBy} />;
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
            label: `${eventManage.tenantScope.pointName} Présence`,
            render: (eventJoin) => {
              const present = eventJoin.isPresent;
              return (
                <div className={clsx('font-medium', present ? 'text-green-400' : 'text-2')}>
                  {present === null
                    ? '-'
                    : present
                    ? `+${eventManage.pointsAwardedForAttendance} ${eventManage.tenantScope.pointName}`
                    : `0 ${eventManage.tenantScope.pointName}`}
                </div>
              );
            },
            align: Align.Center,
          },
          {
            label: 'Confirmation de présence / absence',
            classes: 'gap-4',
            align: Align.Left,
            render: (eventJoin) => {
              const isPresentButton = (
                <Button
                  type={ActionType.Success}
                  // linkOrActionOrMenu: () =>
                  //   updateEventJoin({ variables: { id: eventJoin.id, update: { isPresent: true } } }),
                >
                  Noter présent
                  <Check />
                </Button>
              );

              const isAbsentButton = (
                <Button
                // linkOrActionOrMenu: () =>
                //   updateEventJoin({
                //     variables: { id: eventJoin.id, update: { isPresent: false } },
                //   }),
                >
                  Noter absent
                  <X />
                </Button>
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
                      <Check className="w-8 h-8 text-green-500" />
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
                      <X className="w-8 h-8 text-red-500" />
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
              //       action={() => console.log('Noter présent')}
              //     }}
              //   />
              // );
            },
          },
          {
            label: 'Confirmé par',
            align: Align.Left,
            render: ({ participationProcessedAt, participationProcessedBy }) => {
              if (participationProcessedAt && participationProcessedBy) {
                return <UserLabeled user={participationProcessedBy} />;
              }
              return null;
            },
          },
        ]}
        data={eventManage.eventJoins}
      />
    </BaseView>
  );
}
