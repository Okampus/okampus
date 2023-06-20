import { TabsTopbarView } from '@okampus/ui/templates';
import { EVENT_ROUTE, EVENT_ROUTES } from '@okampus/shared/consts';
import { formatDateDayOfWeekNoHour } from '@okampus/shared/utils';

import { NavigationContext, useCurrentUser, useEvent } from '@okampus/ui/hooks';
import { ActionButton } from '@okampus/ui/molecules';
import { BannerImage } from '@okampus/ui/atoms';
import { EventSidePanel } from '#site/app/components/SidePanel/EventSidePanel';
import { ActionType } from '@okampus/shared/types';
import { insertEventJoinMutation } from '@okampus/shared/graphql';
import { useContext, useEffect } from 'react';

import { useMutation } from '@apollo/client';
import type { EventDetailsInfo } from '@okampus/shared/graphql';

export function EventView() {
  const { event } = useEvent();

  if (!event) return null;
  return <EventViewWrapper event={event} />;
}

export function EventViewWrapper({ event }: { event: EventDetailsInfo }) {
  const { showSidePanel, hideSidePanel } = useContext(NavigationContext);
  const { currentUser } = useCurrentUser();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [createEventJoin] = useMutation(insertEventJoinMutation);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => event && showSidePanel(<EventSidePanel event={event} />), [event]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => hideSidePanel(), []);
  // const [createEventJoin] = useMutation(insertEventJoinMutation);

  // eslint-disable-next-line unicorn/no-array-reduce
  // const missingRoles: [string, EventRoleBaseInfo[]][] = [];
  // for (const role of event.eventRoles) {
  //   const id = role.id as string;
  //   const existing = missingRoles.find((r) => r[0] === id);
  //   if (existing) {
  //     existing[1].push(role);
  //   } else {
  //     missingRoles.push([id, [role]]);
  //   }
  // }

  let amIRegistered = false;
  for (const participant of event.eventJoinsAggregate.nodes) {
    if (participant.joiner?.id === currentUser?.id) {
      amIRegistered = true;
      break;
    }
  }

  // const helpWanted = missingRoles.length > 0;

  const menus = [
    {
      key: EVENT_ROUTES.OVERVIEW,
      label: "Résumé de l'événement",
      element: () => (
        <div className="flex flex-col gap-10">
          <div className="lg:mt-[var(--padding-vertical-view)] lg:px-16">
            <BannerImage src={event.banner?.url} name={event?.name} />
          </div>
          <div className="flex flex-col gap-4 px-content">
            <div className="flex justify-between items-center">
              <div>
                <div className="title text-2 !font-medium">{formatDateDayOfWeekNoHour(event.start as string)}</div>
                <div className="text-5xl text-0 font-bold">{event?.name}</div>
              </div>
              <ActionButton
                action={{
                  linkOrActionOrMenu: () =>
                    !amIRegistered &&
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    createEventJoin({ variables: { object: { eventId: event.id, joinerId: currentUser?.id } } }),
                  label: amIRegistered ? 'Je participe' : 'Participer',
                  active: amIRegistered,
                  type: ActionType.Action,
                }}
              />
            </div>
            {/* <div className="title text-1">À propos</div> */}
            <div className="mt-6 text-2 font-medium leading-7">{event?.content.text}</div>
          </div>
        </div>
      ),
    },
    {
      key: EVENT_ROUTES.ROLES,
      label: 'Rôles',
      element: () => null,
      // helpWanted ? (
      //   <div className="flex flex-col gap-10">
      //     <div className="title text-1">Nous recherchons des volontaires</div>
      //     <div className="flex flex-col">
      //       {missingRoles.map(([id, roles]) => (
      //         <div className="flex flex-col gap-8" key={id}>
      //           <div>
      //             <div className="subtitle text-0">
      //               {roles[0].name} <span className="text-blue-400 text-lg">({roles.length} événement)</span>
      //             </div>
      //             <div className="text-2">{roles[0].description}</div>
      //           </div>
      //           <div className="flex flex-col gap-2">
      //             {roles.map((role) => (
      //               <div className="flex p-3 items-center gap-6 text-0 bg-1-hover rounded-xl" key={role.id as string}>
      //                 {/* <DateCard date={role.event.start as string} small={true} className="flex-0" /> */}
      //                 <div className="flex-1 w-full text-lg font-bold">
      //                   {role.event?.name && capitalize(role.event.name)}
      //                 </div>
      //                 <div className="flex-1 w-full text-lg text-center font-medium">
      //                   {formatDateDayOfWeek(role.event.start as string)}
      //                 </div>
      //                 <div className="flex-1 w-full text-lg text-center font-medium">
      //                   {role.rewardMinimum as number} à {role.rewardMaximum as number} points {tenant?.pointName}
      //                 </div>
      //                 <ActionButton
      //                   action={{
      //                     linkOrActionOrMenu: () => console.log('test'),
      //                     label: 'Candidater pour le poste',
      //                   }}
      //                 />
      //               </div>
      //             ))}
      //             <hr className="border-color-3 my-8" />
      //           </div>
      //         </div>
      //       ))}
      //     </div>
      //   </div>
      // ) : null,
    },
  ];

  return <TabsTopbarView menus={menus} basePath={EVENT_ROUTE(event?.slug)} />;
}
