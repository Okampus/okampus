// import {
//   eventManageBaseInfo,
//   // insertEventMutation, updateEventMutation,
//   useTypedQuery,
// } from '@okampus/shared/graphql';
// import { ActionType } from '@okampus/shared/types';
// import { EventState } from '@okampus/shared/enums';

// import {
//   NavigationContext,
//   // useCurrentUser,
//   // useTeamManage,
// } from '@okampus/ui/hooks';
// import { ActionButton, EventCard } from '@okampus/ui/molecules';

// import { EVENT_MANAGE_ROUTE } from '@okampus/shared/consts';
// import { TeamEventCreateForm } from '#site/app/components/Form/MultiStepForm/TeamEventCreateForm';
// import { useContext } from 'react';
// import { useMutation } from '@apollo/client';

export function TeamEventManageView() {
  // const { teamManage } = useTeamManage();
  // const { data } = useTypedQuery({
  //   event: [{ where: { teamEvents: { team: { id: { _eq: teamManage?.id } } } }, limit: 10 }, eventManageBaseInfo],
  // });

  // const {
  //   // showOverlay, hideOverlay,
  //   tenant,
  // } = useContext(NavigationContext);
  // // const { currentUser } = useCurrentUser();

  // const [updateEvent] = useMutation(updateEventMutation);
  // const [createEvent] = useMutation(insertEventMutation, { onCompleted: hideOverlay });

  return (
    <div className="flex flex-col gap-4 px-content py-content">
      <div className="flex justify-between items-start">
        <h1 className="title">Gestion des événements</h1>
        {/* <ActionButton
          action={{
            label: 'Créer un événement',
            linkOrActionOrMenu: () => showOverlay(<TeamEventCreateForm onClose={hideOverlay} />),
            // <MultiStepForm
            //   defaultValues={defaultValues}
            //   title="Créer un événement"
            //   onClose={hideOverlay}
            //   steps={[
            //     {
            //       label: 'Pour quel projet organisez-vous cet événement ?',
            //       render: ({ values, setValues, setIsDirty, goToNextStep }) => {
            //         return (
            //           <div>
            //             {projects?.project ? (
            //               <SelectInput
            //                 items={projects.project.map((project) => ({ label: project.name, value: project }))}
            //                 value={values.project ?? null}
            //                 onChange={(value) => {
            //                   setValues({ ...values, project: { id: value?.id as string, name: value?.name } });
            //                   setIsDirty();
            //                   goToNextStep();
            //                 }}
            //                 options={{
            //                   label: 'Sélectionnez un projet',
            //                   name: 'project',
            //                 }}
            //               />
            //             ) : (
            //               <div>
            //                 <div className="title">Vous n'avez pas encore de projet</div>
            //                 <ActionButton
            //                   action={{
            //                     label: 'Créer un projet',
            //                     linkOrActionOrMenu: () => console.log('create project'),
            //                     type: ActionType.Success,
            //                   }}
            //                 />
            //               </div>
            //             )}
            //           </div>
            //         );
            //       },
            //     },
            //     {
            //       label: "Donnez quelques informations sur l'événement",
            //       render: ({ values, setValues }) => {
            //         return (
            //           <div className="text-1 flex flex-col gap-6">
            //             <div className="px-24">
            //               Vous avez sélectionné le projet <span className="font-bold">{values.project?.name}</span>
            //             </div>
            //             <TextInput
            //               label="Nom de l'événement"
            //               name="name"
            //               value={values.name ?? ''}
            //               onChange={(e) => setValues({ ...values, name: e.target.value })}
            //             />
            //             <div className="flex gap-4">
            //               <TextInput
            //                 label="Date de début de l'événement"
            //                 type="date"
            //                 name="startDate"
            //                 value={values.startDate ?? ''}
            //                 onChange={(e) => setValues({ ...values, startDate: e.target.value })}
            //               />
            //               <TextInput
            //                 label="Heure de début"
            //                 type="time"
            //                 name="startTime"
            //                 value={values.startTime ?? ''}
            //                 onChange={(e) => setValues({ ...values, startTime: e.target.value })}
            //               />
            //             </div>
            //             <div className="flex gap-4">
            //               <TextInput
            //                 label="Date de fin de l'événement"
            //                 type="date"
            //                 name="endDate"
            //                 value={values.endDate ?? ''}
            //                 onChange={(e) => setValues({ ...values, endDate: e.target.value })}
            //               />
            //               <TextInput
            //                 label="Heure de fin"
            //                 type="time"
            //                 name="endTime"
            //                 value={values.endTime ?? ''}
            //                 onChange={(e) => setValues({ ...values, endTime: e.target.value })}
            //               />
            //             </div>
            //           </div>
            //         );
            //       },
            //     },
            //   ]}
            //   onSubmit={({ project, name, startDate, startTime, endDate, endTime }) => {
            //     const start = new Date(`${startDate}T${startTime}:00`);
            //     const end = new Date(`${endDate}T${endTime}:00`);

            //     createEvent({
            //       variables: {
            //         object: {
            //           state: EventState.Submitted,
            //           contentMaster: { data: { name, slug: toSlug(name ?? '') } },
            //           teamEvents: { data: [{ teamId: teamManage?.id }] },
            //           addressId: tenant?.campuses[0]?.address?.id,
            //           projectId: project?.id,
            //           supervisorId: currentUser?.id,
            //           start,
            //           end,
            //         },
            //       },
            //     });
            //   }}
            // />
          }}
        /> */}
      </div>
      {/* {data?.event.map((event, idx) => (
        <div className="flex gap-4">
          <EventCard key={idx} event={event} link={EVENT_MANAGE_ROUTE(event?.slug)} />
          {event.state === EventState.Approved ? (
            <ActionButton
              action={{
                label: "Publier l'événement",
                linkOrActionOrMenu: () => {
                  if (!tenant) return;
                  // updateEvent({ variables: { id: event.id, update: { state: EventState.Published } } });
                },
                // linkOrActionOrMenu: () => tenant && updateEvent({ variables: { id: event.id, state: EventState.Published } }),
                type: ActionType.Success,
              }}
            />
          ) : event.state === EventState.Published ? (
            <ActionButton
              action={{
                label: "Dépublier l'événement",
                linkOrActionOrMenu: () => {
                  if (!tenant) return;
                  // updateEvent({ variables: { id: event.id, update: { state: EventState.Approved } } });
                },
                // linkOrActionOrMenu: () => tenant && updateEvent({ variables: { id: event.id, state: EventState.Published } }),
                type: ActionType.Danger,
              }}
            />
          ) : event.state === EventState.Draft ? (
            <ActionButton
              action={{
                label: "Soumettre l'événement",
                linkOrActionOrMenu: () => {
                  if (!tenant) return;
                  // updateEvent({ variables: { id: event.id, update: { state: EventState.Submitted } } });
                },
                // linkOrActionOrMenu: () => tenant && updateEvent({ variables: { id: event.id, state: EventState.Published } }),
                type: ActionType.Success,
              }}
            />
          ) : event.state === EventState.Submitted ? (
            <ActionButton
              action={{
                label: "Annuler l'événement",
                linkOrActionOrMenu: () => {
                  if (!tenant) return;
                  // updateEvent({ variables: { id: event.id, update: { state: EventState.Draft } } });
                },
                // linkOrActionOrMenu: () => tenant && updateEvent({ variables: { id: event.id, state: EventState.Published } }),
                type: ActionType.Danger,
              }}
            />
          ) : null}
        </div>
      ))} */}
    </div>
  );
}
