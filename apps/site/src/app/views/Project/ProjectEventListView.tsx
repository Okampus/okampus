import { ReactComponent as UserGroupIcon } from '@okampus/assets/svg/icons/material/filled/user-group.svg';
import { ReactComponent as CheckIcon } from '@okampus/assets/svg/icons/material/filled/check.svg';
import { ReactComponent as CloseIcon } from '@okampus/assets/svg/icons/material/filled/close.svg';
import { ReactComponent as QRCodeIcon } from '@okampus/assets/svg/icons/material/filled/qr-code.svg';

import { AVATAR_USER_ROUNDED, EVENT_MANAGE_ROUTES, EVENT_MANAGE_TAB_ROUTE, EVENT_ROUTE } from '@okampus/shared/consts';
import { AttendanceStatus } from '@okampus/shared/enums';
import {
  eventWithJoinInfo,
  insertEventJoinMutation,
  teamMemberBaseInfo,
  useTypedQuery,
  userBaseInfo,
} from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';
import { formatDateRangeDayOfWeek } from '@okampus/shared/utils';

import { Popover, PopoverContent, PopoverTrigger } from '@okampus/ui/atoms';
import { useCurrentUser, NavigationContext } from '@okampus/ui/hooks';
import { ActionButton, LabeledUser, QRCodeImage } from '@okampus/ui/molecules';
import { FormSchemaRender, MultiStepForm, getDefaultFormData } from '@okampus/ui/organisms';
import { getAvatar } from '@okampus/ui/utils';

import { SITE_URL } from '#site/app/consts';

import { useMutation } from '@apollo/client';

import clsx from 'clsx';

import { useContext } from 'react';
import { Link } from 'react-router-dom';

import type { FormSchema } from '@okampus/shared/types';

import type { ProjectDetailsInfo, UserBaseInfo, EventJoinBaseInfo, EventWithJoinInfo } from '@okampus/shared/graphql';

// TODO: refactor this ugly CSS as table
const PresenceCell = ({ status }: { status?: AttendanceStatus }) => {
  let color = 'bg-transparent';
  let icon = null;

  switch (status) {
    case AttendanceStatus.Sure: {
      color = 'dark:bg-green-800 bg-green-300';
      icon = (
        <>
          <CheckIcon className="w-8 h-8 text-green-500" />
          <div className="text-green-600 dark:text-green-400">Inscrit</div>
        </>
      );
      break;
    }
    default: {
      color = 'bg-2';
      icon = (
        <>
          <CloseIcon className="w-8 h-8 text-4" />
          Non-inscrit
        </>
      );
      break;
    }
  }

  return (
    <div className="min-w-[4rem] grow w-0 h-16 flex items-center justify-center font-medium">
      <div className={clsx('w-full flex items-center justify-center gap-2 h-full', color)}>{icon}</div>
    </div>
  );
};

export type ProjectEventListViewProps = { project: ProjectDetailsInfo };
export function ProjectEventListView({ project }: ProjectEventListViewProps) {
  const { hideOverlay, showOverlay } = useContext(NavigationContext);
  const { currentUser } = useCurrentUser();

  const [createEventJoin, { data: eventJoin }] = useMutation(insertEventJoinMutation);

  const { data } = useTypedQuery({
    event: [
      { where: { projectId: { _eq: project.id } } },
      {
        ...eventWithJoinInfo,
        userInfo: {
          ...userBaseInfo,
          teamMembers: [{ where: { team: { projects: { id: { _eq: project.id } } } } }, teamMemberBaseInfo],
        },
      },
    ],
  });

  if (!project) return null;

  const events = data?.event;
  if (!events) return null;

  const myAvatar = {
    src: getAvatar(currentUser?.individualById?.actor?.actorImages),
    name: currentUser?.individualById?.actor?.name,
    size: 14,
    rounded: AVATAR_USER_ROUNDED,
  };

  const myEventJoins: Record<string, EventJoinBaseInfo> = {};
  const allEventJoins: Record<string, { user: UserBaseInfo; eventJoins: Record<string, EventJoinBaseInfo> }> = {};
  for (const event of events) {
    const eventId = event.id as string;
    for (const participant of event.eventJoins) {
      const id = participant.userInfo.id as string;
      if (id === currentUser?.id) myEventJoins[eventId] = participant;
      else if (allEventJoins[id]) allEventJoins[id].eventJoins[eventId] = participant;
      else allEventJoins[id] = { user: participant.userInfo, eventJoins: { [eventId]: participant } };
    }
  }

  const allEventJoinsEntries = Object.entries(allEventJoins);

  const register = (event: EventWithJoinInfo) => {
    console.log('Event', event.form, event);
    if (event.form) {
      console.log('Schema', event.form.schema);
      showOverlay(
        <MultiStepForm
          defaultValues={getDefaultFormData(event.form.schema as FormSchema)}
          // title={`${event.contentMaster?.name} / Inscription`}
          onClose={hideOverlay}
          initialStep={{
            header: "Veuillez remplir le formulaire d'inscription",
            content: ({ values, setValues, goToNextStep }) => {
              return (
                <div className="flex flex-col items-center gap-10">
                  <FormSchemaRender schema={event.form?.schema as FormSchema} data={values} onChange={setValues} />
                  <ActionButton
                    action={{
                      label: "M'inscrire !",
                      linkOrActionOrMenu: () => goToNextStep(0),
                      type: ActionType.Success,
                    }}
                  />
                </div>
              );
            },
            nextSteps: [
              {
                header: 'Voici votre ticket',
                content: () => {
                  createEventJoin({
                    variables: {
                      object: {
                        eventId: event.id,
                        joinerId: currentUser?.id,
                      },
                    },
                    onCompleted: (data) => {
                      console.log('Data', data.insertEventJoinOne, data.insertEventJoinOne?.id);
                    },
                  });

                  if (!eventJoin) return null;
                  return (
                    <QRCodeImage
                      showLink={true}
                      text={`${SITE_URL}${EVENT_MANAGE_TAB_ROUTE({
                        slug: eventJoin.insertEventJoinOne?.event.contentMaster?.slug,
                        tab: EVENT_MANAGE_ROUTES.CONFIRM_PRESENCE,
                      })}/${eventJoin.insertEventJoinOne?.id}`}
                    />
                  );
                },
              },
            ],
          }}
          onSubmit={hideOverlay}
        />
        // onSubmit={({ project, name, startDate, startTime, endDate, endTime }) => {
        //   const start = new Date(`${startDate}T${startTime}:00`);
        //   const end = new Date(`${endDate}T${endTime}:00`);

        //   console.log('Date', start, end, tenant?.campuses[0]);
        //   createEvent({
        //     variables: {
        //       object: {
        //         contentMaster: { data: { name, slug: toSlug(name) } },
        //         teamEvents: { data: [{ teamId: teamManage?.id }] },
        //         locationId: tenant?.campuses[0]?.actorAddress?.id,
        //         projectId: project?.id,
        //         supervisorId: currentUser?.id,
        //         start,
        //         end,
        //         state: EventState.Submitted,
        //       },
        //     },
        //   });
        // }}
      );
    } else {
      createEventJoin({
        variables: {
          object: {
            eventId: event.id,
            joinerId: currentUser?.id,
          },
        },
        onCompleted: (data) => {
          console.log('Data', data.insertEventJoinOne, data.insertEventJoinOne?.id);
        },
      });
      console.log('No schema', event);
    }
  };

  return (
    <div className="text-1 w-full h-full flex flex-col overflow-x-scroll scrollbar">
      <div className="flex h-20 bg-1 w-fit min-w-full shrink-0">
        <div className="w-64 shrink-0 flex items-center justify-center header">Événement</div>
        {events.map((event) => (
          <Link
            to={EVENT_ROUTE(event.contentMaster?.slug)}
            className="min-w-[4rem] grow w-0 flex items-center justify-center text-0 font-semibold px-3 line-clamp-2 text-center text-lg"
            key={event.id as string}
          >
            {event.contentMaster?.name}
          </Link>
        ))}
      </div>
      <div className="flex h-20 bg-2 w-fit min-w-full shrink-0">
        <div className="w-64 shrink-0 flex items-center justify-center header text-center">Date & heure</div>
        {events.map((event) => (
          <div
            className="min-w-[4rem] grow w-0 flex items-center justify-center px-3 text-center "
            key={event.id as string}
          >
            {formatDateRangeDayOfWeek(event.start as string, event.end as string)}
          </div>
        ))}
      </div>
      <div className="flex h-14 bg-1 w-fit min-w-full shrink-0">
        <div className="w-64 shrink-0 flex items-center justify-center header">Responsable</div>
        {events.map((event) => {
          const avatar = {
            src: getAvatar(event.userInfo.individualById?.actor?.actorImages),
            name: event.userInfo.individualById?.actor?.name,
            rounded: AVATAR_USER_ROUNDED,
            size: 12,
          };
          return (
            <div className="min-w-[4rem] grow w-0 flex items-center justify-center px-1.5">
              <LabeledUser
                id={event.userInfo.id as string}
                key={event.id as string}
                avatar={avatar}
                className="gap-2"
                name={event.userInfo.individualById?.actor?.name || ''}
              />
            </div>
          );
          // <LabeledMemberHorizontal
          //   avatar={getAvatar(event.userInfo.individualById?.actor?.actorImages)}
          //   name={event.userInfo.individualById?.actor?.name}
          //   role={event.userInfo.teamMembers[0].teamMemberRoles[0].role.name}
          // />
        })}
      </div>
      <div className="flex h-14 border-b-2 border-color-2 bg-0 w-fit min-w-full shrink-0">
        <div className="w-64 shrink-0 flex items-center justify-center header">Participants</div>
        {events.map((event) => (
          <div
            className="min-w-[4rem] grow w-0 flex items-center justify-center gap-2 text-xl font-semibold"
            key={event.id as string}
          >
            <UserGroupIcon className="h-7" />
            {event.eventJoins.length}
          </div>
        ))}
      </div>
      <div className="flex h-20 w-fit min-w-full shrink-0">
        <div className="w-64 shrink-0 h-20 flex items-center justify-start px-3 bg-0">
          <LabeledUser
            key={currentUser?.id as string}
            id={currentUser?.id as string}
            name={currentUser?.individualById?.actor?.name || ''}
            subtitle={<div className="text-3 text-sm">Vous</div>}
            avatar={myAvatar}
            className="gap-2"
          />
        </div>
        {events.map((event) => {
          const eventJoin = myEventJoins[event.id as string];
          return eventJoin ? (
            <div className="min-w-[4rem] grow w-0 flex items-center justify-center gap-2 px-2">
              <CheckIcon className="w-8 h-8 text-green-500" />
              <div className="text-green-600 dark:text-green-300">Inscrit</div>
              <Popover placementOffset={10}>
                <PopoverTrigger>
                  <QRCodeIcon className="w-8 h-8 bg-gray-400 text-white p-1 rounded ml-2" />
                </PopoverTrigger>
                <PopoverContent>
                  <QRCodeImage
                    showLink={true}
                    text={`${SITE_URL}${EVENT_MANAGE_TAB_ROUTE({
                      slug: event.contentMaster?.slug,
                      tab: EVENT_MANAGE_ROUTES.CONFIRM_PRESENCE,
                    })}/${eventJoin.id}`}
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="min-w-[4rem] grow w-0 flex items-center justify-center gap-4 px-2">
              <ActionButton
                className="w-full"
                action={{
                  label: "M'inscrire",
                  linkOrActionOrMenu: () => register(event),
                  type: ActionType.Success,
                  // iconOrSwitch: <CheckIcon className="w-8 h-8 text-green-300" />,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="h-full overflow-y-scroll scrollbar w-fit min-w-full pb-2">
        {allEventJoinsEntries.map(([id, { user, eventJoins }]) => {
          const avatar = {
            src: getAvatar(user.individualById?.actor?.actorImages),
            name: user.individualById?.actor?.name,
            rounded: AVATAR_USER_ROUNDED,
            size: 12,
          };
          return (
            <div className="flex" key={id}>
              <div className="w-64 shrink-0 h-16 flex items-center justify-start bg-0 px-3">
                <LabeledUser
                  id={user.id as string}
                  key={user.id as string}
                  avatar={avatar}
                  className="gap-2"
                  name={user.individualById?.actor?.name || ''}
                />
              </div>
              {events.map((event) => {
                const eventJoin = eventJoins[event.id as string];
                return <PresenceCell status={eventJoin?.attendanceStatus as AttendanceStatus} />;
                // const color = !eventJoin?.attendanceStatus eventJoin?.attendanceStatus === RegistrationStatus.Sure ? 'bg-green-500' : 'bg-red-500';
                // return (
                //   <div className="w-64 shrink-0 h-16 flex items-center justify-center" key={event.id as string}>
                //     {eventJoin?.attendanceStatus === RegistrationStatus.Sure ?}
                //   </div>
                // );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
