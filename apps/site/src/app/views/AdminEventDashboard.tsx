import { useMutation, useQuery } from '@apollo/client';
import { Address, IContent, ITenantEvent } from '@okampus/shared/dtos';
// import { ITenantEvent } from '@okampus/shared/dtos';
import { createEventApprovalMutation, getEventsQuery } from '@okampus/shared/graphql';
import { ReactComponent as CloseIcon } from '@okampus/assets/svg/icons/close.svg';
import { createRef, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { formatDate } from '@okampus/shared/utils';
import { EventState } from '@okampus/shared/enums';
import { nanoid } from 'nanoid';
import { NavigationContext } from '../context/NavigationContext';
import { EventCard } from '@okampus/ui/molecules';
import { TabsView } from '@okampus/ui/templates';
import { Backdrop } from '../components/layout/Backdrop';

const printAddress = (address: Address) => {
  return `${address.street} ${address.zip} ${address.city}`;
};

export const AdminEventDashboard = () => {
  // const [message, setMessage] = useState('');
  const message = createRef<HTMLTextAreaElement>();
  const { notifications, setNotifications } = useContext(NavigationContext);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data, refetch } = useQuery(getEventsQuery);

  const [createEventApproval] = useMutation(createEventApprovalMutation, {
    onCompleted: (data) => {
      setSelectedId(null);
      refetch();

      if (data.createEventApproval.step.approved) {
        setNotifications([
          ...notifications,
          {
            id: nanoid(21),
            type: 'success',
            message: `${data.createEventApproval.step.name} approuvée pour l'événement ${data.createEventApproval.event.title} !`,
            timeout: 3000,
          },
        ]);
      } else {
        setNotifications([
          ...notifications,
          {
            id: nanoid(21),
            type: 'error',
            message: `${data.createEventApproval.step.name} refusée pour l'événement ${data.createEventApproval.event.title}`,
            timeout: 3000,
          },
        ]);
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

  const steps = ['1674225589347769505', '1674225589348688264', '1674225589348093572'];
  // console.log('data', data?.events?.edges);
  const nonRefusedEvents =
    data?.events?.edges.filter((event: { node: ITenantEvent }) => event.node.state !== EventState.Rejected) ?? [];

  const step1Events = nonRefusedEvents
    .filter((event: { node: ITenantEvent }) => event.node.lastEventApprovalStep === null)
    .map((event: { node: ITenantEvent }) => event.node);
  const step2Events = nonRefusedEvents
    .filter((event: { node: ITenantEvent }) => event.node.lastEventApprovalStep?.order === 1)
    .map((event: { node: ITenantEvent }) => event.node);
  const step3Events = nonRefusedEvents
    .filter((event: { node: ITenantEvent }) => event.node.lastEventApprovalStep?.order === 2)
    .map((event: { node: ITenantEvent }) => event.node);
  const validatedEvents = nonRefusedEvents
    .filter((event: { node: ITenantEvent }) => event.node.lastEventApprovalStep?.order === 3)
    .map((event: { node: ITenantEvent }) => event.node);

  console.log('nStep1Events', step1Events);
  console.log('nStep2Events', step2Events);
  console.log('nStep3Events', step3Events);
  console.log('nValidatedEvents', validatedEvents);

  const tabs = [
    {
      number: step1Events?.length,
      title: 'Validation de principe',
      content: (
        <div className="grid grid-cols-2 gap-4">
          {step1Events?.length > 0 &&
            (step1Events as ITenantEvent[]).map((event, idx) => (
              <motion.div layoutId={event.id ?? idx.toString()}>
                <EventCard
                  key={idx}
                  event={event}
                  classes="bg-hover-1 cursor-pointer"
                  onClick={() => setSelectedId(event.id ?? idx.toString())}
                />
              </motion.div>
            ))}
        </div>
      ),
    },
    {
      number: step2Events?.length,
      title: 'Validation campus',
      content: (
        <div className="grid grid-cols-2 gap-4">
          {step2Events?.length > 0 &&
            (step2Events as ITenantEvent[]).map((event, idx) => (
              <motion.div layoutId={event.id ?? idx.toString()}>
                <EventCard
                  key={idx}
                  event={event}
                  classes="bg-hover-1 cursor-pointer"
                  onClick={() => setSelectedId(event.id ?? idx.toString())}
                />
              </motion.div>
            ))}
        </div>
      ),
    },
    {
      number: step3Events?.length,
      title: 'Validation du directeur',
      content: (
        <div className="grid grid-cols-2 gap-4">
          {step3Events?.length > 0 &&
            (step3Events as ITenantEvent[]).map((event, idx) => (
              <motion.div layoutId={event.id ?? idx.toString()}>
                <EventCard
                  key={idx}
                  event={event}
                  classes="bg-hover-1 cursor-pointer"
                  onClick={() => setSelectedId(event.id ?? idx.toString())}
                />
              </motion.div>
            ))}
        </div>
      ),
    },
    {
      number: validatedEvents?.length,
      title: 'Événements validés',
      content: (
        <div className="grid grid-cols-2 gap-4">
          {validatedEvents?.length > 0 &&
            (validatedEvents as ITenantEvent[]).map((event, idx) => (
              <motion.div layoutId={event.id ?? idx.toString()}>
                <EventCard
                  key={idx}
                  event={event}
                  classes="bg-hover-1 cursor-pointer"
                  onClick={() => setSelectedId(event.id ?? idx.toString())}
                />
              </motion.div>
            ))}
        </div>
      ),
    },
  ];

  const renderEventValidation = () => {
    const selectedEvent = data?.events?.edges.find((event: { node: ITenantEvent }) => event.node.id === selectedId)
      ?.node as ITenantEvent;
    return (
      <div className="flex flex-col gap-8 p-2">
        <div className="flex justify-between">
          <h1 className="font-medium text-1 text-2xl">Validation : {selectedEvent?.title}</h1>
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
            <h1 className="text-1">{formatDate(selectedEvent?.start)}</h1>
            <h1 className="text-1">{formatDate(selectedEvent?.end)}</h1>
            <h1 className="text-1">{printAddress(selectedEvent?.location)}</h1>
            <h1 className="text-1">{(selectedEvent?.rootContent as IContent).text}</h1>
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
              createEventApproval({
                variables: {
                  eventApproval: {
                    message: message.current?.value,
                    approved: true,
                    eventId: selectedEvent.id,
                    stepId: selectedEvent.lastEventApprovalStep
                      ? steps[selectedEvent.lastEventApprovalStep.order as number]
                      : steps[0],
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
              createEventApproval({
                variables: {
                  eventApproval: {
                    message: message.current?.value,
                    approved: false,
                    eventId: selectedEvent.id,
                    stepId: selectedEvent.lastEventApprovalStep
                      ? steps[selectedEvent.lastEventApprovalStep.order as number]
                      : steps[0],
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
      {selectedId && (
        <Backdrop classes="flex justify-center items-center " onClick={() => setSelectedId(null)}>
          <motion.div
            onClick={(e) => e.stopPropagation()}
            layoutId={selectedId}
            className="bg-2 border bc-2 text-0 rounded-lg p-4"
          >
            {renderEventValidation()}
          </motion.div>
        </Backdrop>
      )}
      <div className="flex flex-col gap-10 h-full pb-10">
        <div className="flex flex-col gap-5 h-full">
          {/* <h1 className="text-xl font-medium text-1">Événéments en attente de validation</h1> */}
          <TabsView tabs={tabs} />
        </div>
        <div className="flex gap-10">
          <div className="flex flex-col gap-4 text-1">
            <h1 className="text-xl font-medium">En attente depuis le plus longtemps</h1>
            <div className="rounded-lg border bc-3 p-4 bg-2">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta, velit.
            </div>
            <div className="rounded-lg border bc-3 p-4 bg-2">
              Explicabo reprehenderit necessitatibus voluptatem tenetur dolore quidem soluta eaque maiores.
            </div>
            <div className="rounded-lg border bc-3 p-4 bg-2">
              Quas nobis iste harum possimus, accusamus voluptas dolores veritatis aspernatur.
            </div>
          </div>
          <div className="flex flex-col gap-4 text-1">
            <h1 className="text-xl font-medium">Derniers événements</h1>
            <div className="rounded-lg border bc-3 p-4 bg-2">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta, velit.
            </div>
            <div className="rounded-lg border bc-3 p-4 bg-2">
              Explicabo reprehenderit necessitatibus voluptatem tenetur dolore quidem soluta eaque maiores.
            </div>
            <div className="rounded-lg border bc-3 p-4 bg-2">
              Quas nobis iste harum possimus, accusamus voluptas dolores veritatis aspernatur.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
