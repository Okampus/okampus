import { TabsView } from '@okampus/ui/templates';
import { FormEditView } from '#site/app/components/Form/FormEdit/FormEditView';

import { ReactComponent as CheckIcon } from '@okampus/assets/svg/icons/material/filled/check.svg';
// import { ReactComponent as CheckCircleIcon } from '@okampus/assets/svg/icons/material/outlined/check-circle.svg';
import { ReactComponent as CloseIcon } from '@okampus/assets/svg/icons/material/filled/close.svg';
// import { ReactComponent as PlusIcon } from '@okampus/assets/svg/icons/material/filled/add.svg';

import { EVENT_MANAGE_ROUTE, EVENT_MANAGE_ROUTES } from '@okampus/shared/consts';
import { Align, SettledVia } from '@okampus/shared/enums';
// import { ActionType } from '@okampus/shared/types';
import { formatDateStandard, formatHourSimple } from '@okampus/shared/utils';

// import { Popover, PopoverContent, PopoverTrigger } from '@okampus/ui/atoms';
import { NavigationContext, useEventManage } from '@okampus/ui/hooks';
import {
  // ActionButton,
  FormItem,
  LabeledUser,
} from '@okampus/ui/molecules';
import {
  Dashboard,
  // FormSchemaRender, MultiStepForm, getDefaultFormData
} from '@okampus/ui/organisms';
import { getAvatar } from '@okampus/ui/utils';

// import { mergeCache } from '#site/app/utils/apollo/merge-cache';
// import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import { useContext } from 'react';

import type { FormBaseInfo } from '@okampus/shared/graphql';

export function EventManageView() {
  const { showOverlay, tenant } = useContext(NavigationContext);
  const { eventManage } = useEventManage();
  // const [insertEventAttendance] = useMutation(insertEventAttendanceMutation);
  // const [insertAction] = useMutation(insertActionMutation);

  if (!eventManage) return null;

  const editForm = (form: FormBaseInfo) => {
    showOverlay(<FormEditView id={form.id as string} />);
  };

  // const insertActionSchema = [
  //   {
  //     name: 'name',
  //     type: ControlType.Text,
  //     label: "Nom de l'action",
  //     placeholder: "Nom de l'action",
  //   },
  //   {
  //     name: 'score',
  //     type: ControlType.Number,
  //     label: 'Nombre de points LXP attribués',
  //     placeholder: 'Nombre de points LXP attribués',
  //   },
  //   {
  //     name: 'description',
  //     type: ControlType.Markdown,
  //     label: 'Description',
  //     placeholder: "Description de l'action",
  //   },
  // ] as const;

  const menus = [
    {
      key: EVENT_MANAGE_ROUTES.OVERVIEW,
      label: "Vue d'ensemble",
      element: () => (
        <div className="text-0">
          <div className="title">{eventManage?.name}</div>
          {eventManage.form && <FormItem onClick={editForm} form={eventManage.form} />}
          {/* <div>{eventManage.contentMaster?.content?.text}</div>
          <div className="mt-10">Responsable: {eventManage.userInfo.individualById?.actor?.name}</div> */}
        </div>
      ),
    },
    {
      key: EVENT_MANAGE_ROUTES.ATTENDANCE,
      label: 'Liste de présence',
      element: () => (
        <div className="flex flex-col h-full">
          <Dashboard
            columns={[
              {
                label: 'Participant',
                render: (eventJoin) => {
                  return (
                    <LabeledUser
                      id={eventJoin.userInfo.id as string}
                      name={eventJoin.userInfo.individualById?.actor?.name ?? ''}
                      avatar={{
                        src: getAvatar(eventJoin.userInfo.individualById?.actor?.actorImages),
                        size: 14,
                      }}
                    />
                  );
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
              //     //         //       userId={eventJoin.userInfo.id}
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
                  const present = eventJoin.presence;
                  return (
                    <div className={clsx('text-lg font-medium', present ? 'text-green-400' : 'text-red-500')}>
                      {present ? `+${eventManage.pointsPresence}` : -0.25} {tenant?.pointName}
                    </div>
                  );
                },
                align: Align.Center,
              },
              {
                label: 'Confirmation de présence / absence',
                render: (eventJoin) => {
                  if (!eventJoin.presence)
                    return (
                      <div></div>
                      // <div className="flex gap-4">
                      //   <ActionButton
                      //     className="grow"
                      //     action={{
                      //       label: 'Noter présent',
                      //       linkOrActionOrMenu: () =>
                      //         insertEventAttendance({
                      //           variables: {
                      //             object: {
                      //               eventJoinId: eventJoin.id,
                      //               participated: true,
                      //               confirmedVia: AttendanceConfirmedVia.Manual,
                      //             },
                      //           },
                      //         }),
                      //       type: ActionType.Action,
                      //     }}
                      //   />
                      //   <ActionButton
                      //     className="grow"
                      //     action={{
                      //       label: 'Noter absent',
                      //       linkOrActionOrMenu: () =>
                      //         insertEventAttendance({
                      //           variables: {
                      //             object: {
                      //               eventJoinId: eventJoin.id,
                      //               participated: false,
                      //               confirmedVia: AttendanceConfirmedVia.Manual,
                      //             },
                      //           },
                      //         }),
                      //       type: ActionType.Danger,
                      //     }}
                      //   />
                      // </div>
                    );

                  if (!eventJoin.presenceSettledAt) return;

                  const date = formatDateStandard(eventJoin.presenceSettledAt);
                  const time = formatHourSimple(eventJoin.presenceSettledAt);

                  if (eventJoin.presence) {
                    const via = eventJoin.presenceSettledVia === SettledVia.QR ? 'QR code validé' : 'Noté présent';
                    return (
                      <div className="text-lg font-medium w-full flex items-center justify-center gap-2 bg-green-100 dark:bg-green-900 py-3 px-4 rounded">
                        <CheckIcon className="w-8 h-8 text-green-500" />
                        <div className="text-green-800 dark:text-green-300">
                          {via} le {date} à {time}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-lg font-medium w-full flex items-center justify-center gap-2 bg-red-100 dark:bg-red-900 py-3 px-4 rounded">
                        <CloseIcon className="w-8 h-8 text-red-500" />
                        <div className="text-red-800 dark:text-red-200">
                          Noté absent le {date} à {time}
                        </div>
                      </div>
                    );
                  }

                  // if (!eventJoin.presence) return <div className="text-red-500">Désinscrit</div>;
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
                  const actor = eventJoin.individualByPresenceSettledById?.actor;
                  if (eventJoin.presenceSettledAt && actor?.individual?.userInfo) {
                    return (
                      <LabeledUser
                        id={actor.individual.userInfo.id}
                        name={actor.name}
                        avatar={{ src: getAvatar(actor.actorImages), size: 14 }}
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
      ),
    },
  ];

  return <TabsView menus={menus} basePath={EVENT_MANAGE_ROUTE(eventManage?.slug)} />;
}
