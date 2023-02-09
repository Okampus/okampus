import { createEventApprovalMutation, eventFragment, getEventsQuery, getFragmentData } from '@okampus/shared/graphql';
import { ReactComponent as CloseIcon } from '@okampus/assets/svg/icons/close.svg';
import { formatDateDayOfWeek } from '@okampus/shared/utils';
import { NavigationContext } from '@okampus/ui/hooks';

import { createRef, useContext, useState } from 'react';
// import { motion } from 'framer-motion';
// import { EventState } from '@okampus/shared/enums';
import { nanoid } from 'nanoid';
import { useMutation, useQuery } from '@apollo/client';

import type { EventInfoFragment } from '@okampus/shared/graphql';
// import { EventCard } from '@okampus/ui/molecules';
// import { TabsView } from '@okampus/ui/templates';

const printAddress = (address: { street?: string | null; zip?: number | null; city?: string | null }) => {
  let result = '';
  if (address.street) {
    result += address.street;
  }
  if (address.zip) {
    result += `, ${address.zip}`;
  }

  if (address.city) {
    result += ` ${address.city}`;
  }

  return result;
};

export const AdminEventDashboard = () => {
  // const [message, setMessage] = useState('');
  const message = createRef<HTMLTextAreaElement>();
  const { notifications, setNotifications } = useContext(NavigationContext);

  const [_selectedId, setSelectedId] = useState<string | null>(null);
  const { data: _, refetch } = useQuery(getEventsQuery);

  const [createEventApproval] = useMutation(createEventApprovalMutation, {
    onCompleted: (data) => {
      setSelectedId(null);
      refetch();

      const event = getFragmentData(eventFragment, data.createEventApproval.event);
      if (event) {
        if (data.createEventApproval.approved) {
          setNotifications([
            ...notifications,
            {
              id: nanoid(21),
              type: 'success',
              message: `${data.createEventApproval.step?.name} approuvée pour l'événement ${event.title} !`,
              timeout: 3000,
            },
          ]);
        } else {
          setNotifications([
            ...notifications,
            {
              id: nanoid(21),
              type: 'error',
              message: `${data.createEventApproval.step?.name} refusée pour l'événement ${event.title}`,
              timeout: 3000,
            },
          ]);
        }
      }

      // onSubmit(data);
      // setIsLoading(true);
      // setTimeout(() => setIsLoading(false), 1000);
      // console.log(data);
      // if (user !== data.login.id) {
      //   setUser(data.login.id);
      // }
      // navigate('/');
    },
    onError: () => {
      // setIsLoading(false);
    },
  });

  // const tabs = [
  //   {
  //     number: step1Events?.length,
  //     title: 'Validation de principe',
  //     content: (
  //       <div className="grid grid-cols-2 gap-4">
  //         {step1Events?.length > 0 &&
  //           (step1Events as ITenantEvent[]).map((event, idx) => (
  //             <motion.div layoutId={event.id ?? idx.toString()}>
  //               <EventCard
  //                 key={idx}
  //                 event={event}
  //                 classes="bg-hover-1 cursor-pointer"
  //                 onClick={() => setSelectedId(event.id ?? idx.toString())}
  //               />
  //             </motion.div>
  //           ))}
  //       </div>
  //     ),
  //   },
  //   {
  //     number: step2Events?.length,
  //     title: 'Validation campus',
  //     content: (
  //       <div className="grid grid-cols-2 gap-4">
  //         {step2Events?.length > 0 &&
  //           (step2Events as ITenantEvent[]).map((event, idx) => (
  //             <motion.div layoutId={event.id ?? idx.toString()}>
  //               <EventCard
  //                 key={idx}
  //                 event={event}
  //                 classes="bg-hover-1 cursor-pointer"
  //                 onClick={() => setSelectedId(event.id ?? idx.toString())}
  //               />
  //             </motion.div>
  //           ))}
  //       </div>
  //     ),
  //   },
  //   {
  //     number: step3Events?.length,
  //     title: 'Validation du directeur',
  //     content: (
  //       <div className="grid grid-cols-2 gap-4">
  //         {step3Events?.length > 0 &&
  //           (step3Events as ITenantEvent[]).map((event, idx) => (
  //             <motion.div layoutId={event.id ?? idx.toString()}>
  //               <EventCard
  //                 key={idx}
  //                 event={event}
  //                 classes="bg-hover-1 cursor-pointer"
  //                 onClick={() => setSelectedId(event.id ?? idx.toString())}
  //               />
  //             </motion.div>
  //           ))}
  //       </div>
  //     ),
  //   },
  //   {
  //     number: validatedEvents?.length,
  //     title: 'Événements validés',
  //     content: (
  //       <div className="grid grid-cols-2 gap-4">
  //         {validatedEvents?.length > 0 &&
  //           (validatedEvents as ITenantEvent[]).map((event, idx) => (
  //             <motion.div layoutId={event.id ?? idx.toString()}>
  //               <EventCard
  //                 key={idx}
  //                 event={event}
  //                 classes="bg-hover-1 cursor-pointer"
  //                 onClick={() => setSelectedId(event.id ?? idx.toString())}
  //               />
  //             </motion.div>
  //           ))}
  //       </div>
  //     ),
  //   },
  // ];

  const _renderEventValidation = (selectedEvent: EventInfoFragment) => {
    // const events = data.events;

    // const selectedEvent = data.events.edges.find((event: { node: ITenantEvent }) => event.node.id === selectedId)
    //   ?.node as ITenantEvent;
    return (
      <div className="flex flex-col gap-8 p-2">
        <div className="flex justify-between">
          <h1 className="font-medium text-1 text-2xl">Validation : {selectedEvent.title}</h1>
          <CloseIcon className="hover:cursor-pointer" height={35} onClick={() => setSelectedId(null)} />
        </div>
        <div className="flex gap-10">
          <div className="flex flex-col gap-2 items-end">
            <h1 className="text-2">Date de début</h1>
            <h1 className="text-2">Date de fin</h1>
            <h1 className="text-2">Lieu</h1>
            <h1 className="text-2">Description</h1>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-1">{formatDateDayOfWeek(selectedEvent.start)}</h1>
            <h1 className="text-1">{formatDateDayOfWeek(selectedEvent.end)}</h1>
            <h1 className="text-1">{printAddress(selectedEvent.location)}</h1>
            {/* <h1 className="text-1">{(selectedEvent?.rootContent as IContent).text}</h1> */}
          </div>
        </div>
        <div>
          <div className="text-2 text-lg">Message</div>
          <textarea
            rows={4}
            ref={message}
            // value={message}
            // onChange={(e) => setMessage(e.target.value)}
            className="text-black w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm"
          />
        </div>
        <div className="flex justify-between gap-4">
          <button
            className="text-white rounded-lg px-4 py-2 w-full bg-green-500"
            onClick={() => {
              if (selectedEvent.lastEventApprovalStep?.id)
                createEventApproval({
                  variables: {
                    eventApproval: {
                      message: message.current?.value,
                      approved: true,
                      eventId: selectedEvent.id,
                      stepId: selectedEvent.lastEventApprovalStep.id,
                    },
                  },
                });
            }}
          >
            Valider
          </button>
          <button
            className="text-white rounded-lg px-4 py-2 w-full bg-red-500"
            onClick={() => {
              if (selectedEvent.lastEventApprovalStep?.id)
                createEventApproval({
                  variables: {
                    eventApproval: {
                      message: message.current?.value,
                      approved: false,
                      eventId: selectedEvent.id,
                      stepId: selectedEvent.lastEventApprovalStep.id,
                    },
                  },
                });
            }}
          >
            Refuser
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* {selectedId && (
        <Backdrop classes="flex justify-center items-center " onClick={() => setSelectedId(null)}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            layoutId={selectedId}
            className="bg-2 border border-color-2 text-0 rounded-lg p-4"
          >
            {renderEventValidation()}
          </motion.div>
        </Backdrop>
      )} */}
      <div className="flex flex-col gap-10 h-full pb-10">
        <div className="flex flex-col gap-5 h-full">
          {/* <h1 className="text-xl font-medium text-1">Événéments en attente de validation</h1> */}
          {/* <TabsView tabs={tabs} /> */}
        </div>
        <div className="flex gap-10">
          <div className="flex flex-col gap-4 text-1">
            <h1 className="text-xl font-medium">En attente depuis le plus longtemps</h1>
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
            <h1 className="text-xl font-medium">Derniers événements</h1>
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
    </>
  );
};
