// import { useQuery } from '@apollo/client';
// import { IPaginated, ITenantEvent } from '@okampus/shared/dtos';
// import { getEventsQuery } from '@okampus/shared/graphql';
import { CreateEventForm } from '../../components/Forms/CreateEventForm';

import { SmallCalendar } from '@okampus/ui/molecules';
// import { getEventsQuery } from '@okampus/shared/graphql';
import { NavigationContext } from '@okampus/ui/hooks';

import { motion } from 'framer-motion';
import { nanoid } from 'nanoid';
// import { useContext, useState } from 'react';
// import { NavigationContext } from './NavigationContext';
// import { EventCard } from '@okampus/ui/molecules';
import { useContext } from 'react';
// import { ITenantEvent } from '@okampus/shared/dtos';
// import { useQuery } from '@apollo/client';

// type EventManageType = {
//   events: IPaginated<ITenantEvent>;
//   // setEvents: (events: IPaginated<ITenantEvent>) => void;
//   showModal: (modal: { title: string; content: JSX.Element }) => void;
//   hideModal: () => void;
//   addNotification: (notification: { id: string; type: 'success' | 'error'; message: string; timeout?: number }) => void;
// };

export function EventManageView() {
  const currentId = nanoid(21);
  // const [newEvents, setNewEvents] = useState<(ITenantEvent & { key: string })[]>([]);
  const { showModal, hideModal, setNotifications, notifications } = useContext(NavigationContext);

  // const { data } = useQuery(getEventsQuery);
  const addNotification = (notification: {
    id: string;
    type: 'success' | 'error';
    message: string;
    timeout?: number;
  }) => {
    setNotifications([...notifications, notification]);
  };

  return (
    <div className="p-view flex gap-10">
      <div className="flex-shrink-0 w-64 flex flex-col gap-4">
        <SmallCalendar />
        <button
          className="hover:cursor-pointer rounded-lg bg-opposite text-opposite py-2 px-3 text-sm font-semibold"
          onClick={() =>
            showModal({
              title: 'Nouvel événement',
              content: (
                <motion.div layoutId={currentId}>
                  <CreateEventForm
                    onSubmit={() => {
                      // setNewEvents([...newEvents, { ...(event as ITenantEvent), key: currentId }]);
                      hideModal();
                      // refetch();
                      addNotification({
                        id: nanoid(21),
                        type: 'success',
                        message:
                          "Événement soumis ! L'équipe de gestion de la vie associative validera l'évènement sous peu.",
                        timeout: 6000,
                      });
                    }}
                  />
                </motion.div>
              ),
            })
          }
        >
          Créer un événement
        </button>
        {/* <button
          className="hover:cursor-pointer rounded-lg bg-opposite text-opposite py-2 px-3 text-sm font-semibold text-white"
          onClick={() =>
            setNotifications([...notifications, { id: nanoid(21), type: 'success', message: 'Hello world' }])
          }
        >
          Ajouter une notif
        </button> */}
      </div>
      <div></div>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4 text-1">
          <h1 className="text-xl font-medium">Événements qui arrivent</h1>
          <div className="rounded-lg border border-color-3 p-4 bg-2">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta, velit.
          </div>
          <div className="rounded-lg border border-color-3 p-4 bg-2">
            Explicabo reprehenderit necessitatibus voluptatem tenetur dolore quidem soluta eaque maiores.
          </div>
          <div className="rounded-lg border border-color-3 p-4 bg-2">
            Quas nobis iste harum possimus, accusamus voluptas dolores veritatis aspernatur.
          </div>
        </div>
        <div className="flex flex-col gap-4 text-1">
          <h1 className="text-xl font-medium">Événements en attente de validation</h1>
          {/* {data.events.edges.map((event: { node: ITenantEvent }, idx: number) => (
            <motion.div layoutId={event.node.id ?? idx.toString()}>
              <EventCard
                key={idx}
                event={event.node}
                classes="bg-hover-1 cursor-pointer"
                // onClick={() => setSelectedId(event.node.id ?? idx.toString())}
              />
            </motion.div>
          ))} */}
          {/* {newEvents.map((event, idx) => (
            <motion.div layoutId={event.key}>
              <EventCard key={idx} event={event} classes="bg-hover-1 cursor-pointer" />
            </motion.div>
          ))} */}
          {/* {selectedId && (
            <motion.div layoutId={selectedId}>
              <EventCard event={}></EventCard>
            </motion.div>
          )} */}
          <div className="rounded-lg border border-color-3 p-4 bg-2">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta, velit.
          </div>
          <div className="rounded-lg border border-color-3 p-4 bg-2">
            Explicabo reprehenderit necessitatibus voluptatem tenetur dolore quidem soluta eaque maiores.
          </div>
          <div className="rounded-lg border border-color-3 p-4 bg-2">
            Quas nobis iste harum possimus, accusamus voluptas dolores veritatis aspernatur.
          </div>
        </div>
      </div>
    </div>
  );
}
