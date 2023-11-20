'use client';

import CTAButton from '../../_components/molecules/Button/CTAButton';
import FormRenderer from '../../_components/organisms/FormRenderer';

import { useMe } from '../../_hooks/context/useMe';
import { useBottomSheet } from '../../_hooks/context/useBottomSheet';
import QRImage from '../../_components/atoms/Image/QRCodeImage';
import { useModal } from '../../_hooks/context/useModal';
import { ActionType } from '@okampus/shared/enums';

import { QrCode } from '@phosphor-icons/react';
import type { EventDetails } from '../../../types/prisma/Event/event-details';
import type { ActionCTA } from '../../_components/molecules/Button/CTAButton';

export type EventButtonProps = { event: EventDetails };
export default function EventButton({ event }: EventButtonProps) {
  const { data: me } = useMe();
  const { openModal } = useModal();
  const { closeBottomSheet, openBottomSheet } = useBottomSheet();

  const currentUserEventJoin = me.eventJoins.find((join) => join.event.id === event.id);

  let action: ActionCTA;
  let type = ActionType.Action;
  let label: React.ReactNode = `Gérer ${event.name}`;

  if (event.eventOrganizes.some((eventOrganize) => eventOrganize.team.actor.id === me.id)) {
    action = `/manage/event/${event.slug}`;
  } else if (currentUserEventJoin) {
    action = () =>
      openModal({
        node: (
          <QRImage data={`${window.location.origin}/validate/event-join/${currentUserEventJoin.id}`} showData={true} />
        ),
        header: '',
      });
    label = (
      <div className="flex gap-4 items-center">
        <QrCode />
        Mon QR code
      </div>
    );
    // <CTAButton
    //   className="w-full mt-4 uppercase"
    //   type={ActionType.Info}
    //   action={() =>
    //     openModal({
    //       node: (
    //         <QRImage data={`${window.location.origin}/validate/event-join/${currentUserEventJoin.id}`} showData={true} />
    //       ),
    //     })
    //   }
    // >
    //   <div className="flex gap-4 items-center">
    //     <QrCode />
    //     Mon QR code
    //   </div>
    // </CTAButton>;
  } else {
    type = ActionType.Primary;
    label = "S'inscrire";
    action = () =>
      // event.joinForm
      //   ?
      // TODO: if no form, show a confirmation modal
      openBottomSheet({
        header: `Formulaire d'inscription / ${event.name}`,
        node: event.joinForm && (
          <FormRenderer
            form={event.joinForm}
            submit={(values) => {
              // // TODO
              // const submission = Object.entries(values).map(([slug, value]) => ({ slug, value }));
              // const object = {
              //   eventId: event.id,
              //   joinedById: me.id,
              //   formSubmission: { data: { submission, formId: event.joinForm?.id, createdById: me.id } },
              // };
              // insertEventJoin({
              //   variables: { object },
              //   onCompleted: ({ insertEventJoinOne }) => {
              //     if (!insertEventJoinOne) return;
              //     updateFragment<MeInfo>({
              //       __typename: 'Me',
              //       fragment: MeFragment,
              //       where: { slug: me.slug },
              //       update: (data) =>
              //         produce(data, (data) => {
              //           data.eventJoins.push(insertEventJoinOne);
              //         }),
              //     });
              //     closeBottomSheet();
              //     setNotification({
              //       type: ToastType.Success,
              //       message: 'Votre inscription a bien été prise en compte !',
              //     });
              //   },
              // });
            }}
          />
        ),
      });
  }

  // <CTAButton
  //   className="w-full mt-4 !h-[var(--h-topbar)]"
  //   type={ActionType.Primary}
  //   action={
  //     () =>
  //       // event.joinForm
  //       //   ?
  //       // TODO: if no form, show a confirmation modal
  //       openBottomSheet({
  //         node: event.joinForm && (
  //           <FormRenderer
  //             form={event.joinForm}
  //             name={`Formulaire d'inscription / ${event.name}`}
  //             submit={(values) => {
  //               // // TODO
  //               // const submission = Object.entries(values).map(([slug, value]) => ({ slug, value }));
  //               // const object = {
  //               //   eventId: event.id,
  //               //   joinedById: me.id,
  //               //   formSubmission: { data: { submission, formId: event.joinForm?.id, createdById: me.id } },
  //               // };
  //               // insertEventJoin({
  //               //   variables: { object },
  //               //   onCompleted: ({ insertEventJoinOne }) => {
  //               //     if (!insertEventJoinOne) return;
  //               //     updateFragment<MeInfo>({
  //               //       __typename: 'Me',
  //               //       fragment: MeFragment,
  //               //       where: { slug: me.slug },
  //               //       update: (data) =>
  //               //         produce(data, (data) => {
  //               //           data.eventJoins.push(insertEventJoinOne);
  //               //         }),
  //               //     });
  //               //     closeBottomSheet();
  //               //     setNotification({
  //               //       type: ToastType.Success,
  //               //       message: 'Votre inscription a bien été prise en compte !',
  //               //     });
  //               //   },
  //               // });
  //             }}
  //           />
  //         ),
  //       })
  //     // : insertEventJoin({
  //     //     variables: { object: { eventId: event.id, joinedById: me.id } },
  //     //     onCompleted: ({ insertEventJoinOne }) => {
  //     //       if (!insertEventJoinOne) return;

  //     //       updateFragment<MeInfo>({
  //     //         __typename: 'Me',
  //     //         fragment: MeFragment,
  //     //         where: { slug: me.slug },
  //     //         update: (data) =>
  //     //           produce(data, (data) => {
  //     //             data.eventJoins.push(insertEventJoinOne);
  //     //           }),
  //     //       });

  //     //       setNotification({
  //     //         type: ToastType.Success,
  //     //         message: 'Votre inscription a bien été prise en compte !',
  //     //       });
  //     //     },
  //     //   })
  //   }
  // >
  //   S&apos;inscrire {event.price ? `— ${format('euro', event.price)}` : 'gratuitement'}
  // </CTAButton>;
  // }

  return (
    <CTAButton type={type} action={action}>
      {label}
    </CTAButton>
  );
}
