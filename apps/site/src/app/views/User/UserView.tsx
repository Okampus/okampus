import { ReactComponent as CheckCircleIcon } from '@okampus/assets/svg/icons/material/outlined/check-circle.svg';

import { USER_ROUTE, USER_ROUTES } from '@okampus/shared/consts';
import { Align } from '@okampus/shared/enums';
import { isNotNull, sum } from '@okampus/shared/utils';

import { Popover, PopoverTrigger, PopoverContent } from '@okampus/ui/atoms';
import { NavigationContext, useUser } from '@okampus/ui/hooks';
import { Dashboard } from '@okampus/ui/organisms';
import { TabsTopbarView } from '@okampus/ui/templates';

import { useContext } from 'react';

export function UserView() {
  const { tenant } = useContext(NavigationContext);
  const { user } = useUser();

  if (!user || !user.individual?.actor) return null;

  const projectActions = user.actions.filter((action) => action.project);
  const totalAttendances = sum(
    user.eventJoins.map((eventJoin) => {
      return eventJoin
        ? eventJoin.presence
          ? eventJoin.event.pointsPresence + sum(eventJoin.actions?.map((action) => action.points).filter(isNotNull))
          : -0.25
        : 0;
    })
  );
  const totalActions = sum(projectActions.map((action) => action.points || 0));

  // const color = getColorHexFromData(user.individual?.actor?.name);
  const menus = [
    {
      key: USER_ROUTES.PROFILE,
      label: 'Profil',
      element: () => (
        <div className="h-full w-full flex flex-col text-1 items-start gap-10">
          <div className="title">
            Total semestre / {totalAttendances + totalActions} points {tenant?.pointName}
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col p-4 bg-2 rounded-lg gap-4 text-lg">
              <div className="subtitle">Présences à des événements</div>
              <div>
                <Dashboard
                  data={user.eventJoins}
                  columns={[
                    {
                      label: 'Événement',
                      render: (eventJoin) => eventJoin.event?.name,
                    },
                    {
                      label: 'Points présence',
                      align: Align.Right,
                      render: (eventJoin) => {
                        return eventJoin.presence ? (
                          <div className="text-green-500 font-semibold flex justify-between w-full">
                            <div>Présent</div>{' '}
                            <div>
                              {eventJoin.event.pointsPresence} {tenant?.pointName}
                            </div>
                          </div>
                        ) : (
                          <div className="text-red-500 font-semibold flex justify-between w-full">
                            <div>Absent</div> <div>-0.25 {tenant?.pointName}</div>
                          </div>
                        );
                      },
                    },
                    {
                      label: 'Points action',
                      align: Align.Left,
                      render: (eventJoin) => {
                        const actions = eventJoin.actions;
                        return (
                          <>
                            {actions.map((action) => (
                              <div className="flex gap-2 items-center text-lg font-semibold text-2">
                                <div className="text-green-500">
                                  +{action.points} {tenant?.pointName}
                                </div>{' '}
                                /
                                <CheckCircleIcon className="text-green-400 h-7 w-7 mb-0.5" />
                                <Popover forcePlacement={true} placement="bottom-start" placementOffset={10}>
                                  <PopoverTrigger>
                                    <div className="hover:underline">{action.name}</div>
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <div className="card-md bg-4">
                                      <div className="title">
                                        {action.name}{' '}
                                        <span className="text-green-400">
                                          +{action.points} {tenant?.pointName}
                                        </span>
                                      </div>
                                      <div className="text-lg text-2">{action.description}</div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
                                {/* <ActionButton action={{}} /> */}
                              </div>
                            ))}
                          </>
                        );
                      },
                    },
                    {
                      label: 'Total',
                      align: Align.Right,
                      render: (eventJoin) => {
                        return eventJoin.presence ? (
                          <div className="text-green-500 font-semibold">
                            +
                            {eventJoin.event.pointsPresence +
                              sum(eventJoin.actions?.map((action) => action.points).filter(isNotNull))}
                          </div>
                        ) : (
                          <div className="text-red-500 font-semibold">-0.25</div>
                        );
                      },
                    },
                  ]}
                />
                {/* {user.eventJoins.map((eventJoin) => (
                  <div>
                    {eventJoin.event?.contentMaster?.name} - {eventJoin.event?.presenceReward} points
                  </div>
                  // <div key={eventJoin.id as string} className="flex flex-col items-center justify-center">
                  //   <div className="w-20 h-20 rounded-full bg-gray-200" />
                  //   <div className="text-2xl font-semibold">{eventJoin.event?.contentMaster?.name}</div>
                  // </div>
                ))} */}
                <div className="px-4 flex justify-between w-full border-t border-color-0 pt-1.5">
                  <div>Total</div> <div className="text-green-500 font-semibold">+{totalAttendances}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col p-4 bg-2 rounded-lg gap-4 text-lg">
              <div className="subtitle">Actions LXP</div>
              <div>
                <Dashboard
                  columns={[
                    {
                      label: 'Projet',
                      render: (action) => action?.project?.name,
                    },
                    {
                      label: 'Points action',
                      align: Align.Left,
                      render: (action) => {
                        return (
                          <div className="flex gap-2 items-center text-lg font-semibold text-2">
                            <div className="text-green-500">
                              +{action.points} {tenant?.pointName}
                            </div>{' '}
                            /
                            <CheckCircleIcon className="text-green-400 h-7 w-7 mb-0.5" />
                            <Popover forcePlacement={true} placement="bottom-start" placementOffset={10}>
                              <PopoverTrigger>
                                <div className="hover:underline">{action.name}</div>
                              </PopoverTrigger>
                              <PopoverContent>
                                <div className="card-md bg-4">
                                  <div className="title">
                                    {action.name}{' '}
                                    <span className="text-green-400">
                                      +{action.points} {tenant?.pointName}
                                    </span>
                                  </div>
                                  <div className="text-lg text-2">{action.description}</div>
                                </div>
                              </PopoverContent>
                            </Popover>
                            {/* <ActionButton action={{}} /> */}
                          </div>
                        );
                      },
                    },
                  ]}
                  data={projectActions}
                />
                {/* {user.eventJoins.map((eventJoin) => (
                  <div>
                    {eventJoin.event?.contentMaster?.name} - {eventJoin.event?.presenceReward} points
                  </div>
                  // <div key={eventJoin.id as string} className="flex flex-col items-center justify-center">
                  //   <div className="w-20 h-20 rounded-full bg-gray-200" />
                  //   <div className="text-2xl font-semibold">{eventJoin.event?.contentMaster?.name}</div>
                  // </div>
                ))} */}
                <div className="px-4 flex justify-between w-full border-t border-color-0 pt-1.5">
                  <div>Total</div> <div className="text-green-500 font-semibold">+{totalActions}</div>
                </div>
              </div>
            </div>
          </div>
          {/* Aucune activité pour le moment. */}
        </div>
      ),
    },
  ];

  return <TabsTopbarView basePath={USER_ROUTE(user.individual?.actor?.slug)} menus={menus} />;
}
