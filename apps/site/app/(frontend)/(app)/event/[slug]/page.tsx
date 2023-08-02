'use client';

import QRCodeImage from '../../../../../components/atoms/Image/QRCodeImage';
import GroupItem from '../../../../../components/atoms/Item/GroupItem';
import ViewLayout from '../../../../../components/atoms/Layout/ViewLayout';
// import TextLocation from '../../../../../components/atoms/Text/TextLocation';
import ActionButton from '../../../../../components/molecules/Button/ActionButton';
import FormRenderer from '../../../../../components/organisms/FormRenderer';

import { notificationAtom } from '../../../../../context/global';
import { useEvent, useMe } from '../../../../../context/navigation';

import { useBottomSheet } from '../../../../../hooks/context/useBottomSheet';
import { useModal } from '../../../../../hooks/context/useModal';
import { useTranslation } from '../../../../../hooks/context/useTranslation';

import { mergeCache } from '../../../../../utils/apollo/merge-cache';

import { insertEventJoinMutation } from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';

import { IconShare2 } from '@tabler/icons-react';
import { useMutation } from '@apollo/client';
import { useAtom } from 'jotai';

export default function EventPage({ params }: { params: { slug: string } }) {
  const { event } = useEvent(params.slug);
  const me = useMe();

  const { format } = useTranslation();
  const [, setNotification] = useAtom(notificationAtom);

  const currentUserEventJoin = me?.user.eventJoins?.find((join) => join.event.id === event?.id);
  const { openModal } = useModal();
  const { closeBottomSheet, openBottomSheet } = useBottomSheet();

  // @ts-ignore
  const [insertEventJoin] = useMutation(insertEventJoinMutation);

  if (!event) return null;

  return (
    <ViewLayout
      className="relative"
      header={
        event.name
        // <div className="flex flex-col gap-2">
        //   {event.name}
        //   <span className="uppercase text-primary text-xl font-medium">
        //     {format('weekDayHour', new Date(event.start))}
        //   </span>
        //   <TextLocation className="text-lg font-medium" location={event.location} />
        // </div>
      }
    >
      <GroupItem heading="Programme de l'événement" groupClassName="text-justify font-medium whitespace-pre-line">
        {event.content.text}
      </GroupItem>
      <div className="absolute bottom-0 inset-x-0 border-t border-[var(--border-3)] h-24 flex items-center justify-between px-8 bg-main">
        <div className="flex flex-col">
          <div className="uppercase font-semibold text-primary">{format('weekDayHour', new Date(event.start))}</div>
          <div className="font-semibold text-0 line-clamp-1">{event.name}</div>
        </div>

        <div className="flex gap-8 items-center tabular-nums">
          <div className="text-lg font-semibold text-0">
            {event.price === 0 ? 'Gratuit' : format('euro', event.price)}
          </div>
          {currentUserEventJoin ? (
            <ActionButton
              action={{
                label: 'Mon QR code',
                linkOrActionOrMenu: () =>
                  openModal({
                    node: (
                      <QRCodeImage
                        data={`${window.location.origin}/confirm-attendance/${currentUserEventJoin.id}`}
                        showData={true}
                      />
                    ),
                  }),
              }}
            />
          ) : (
            <ActionButton
              action={{
                type: ActionType.Primary,
                linkOrActionOrMenu: () =>
                  event.joinForm
                    ? openBottomSheet({
                        node: (
                          <FormRenderer
                            form={event.joinForm}
                            onSubmit={(values) => {
                              const submission = Object.entries(values).map(([slug, value]) => ({ slug, value }));
                              const object = {
                                eventId: event.id,
                                joinedById: me?.user.id,
                                formSubmission: {
                                  data: {
                                    submission,
                                    formId: event.joinForm?.id,
                                    tenantId: me?.user.tenant.id,
                                    createdById: me?.user.individual.id,
                                  },
                                },
                              };
                              insertEventJoin({
                                // @ts-ignore
                                variables: { object },
                                onCompleted: ({ insertEventJoinOne: data }) => {
                                  if (!data || !me) return;
                                  mergeCache(
                                    { __typename: 'User', id: me.user.id },
                                    { fieldName: 'eventJoins', fragmentOn: 'EventJoin', data }
                                  );
                                  closeBottomSheet();
                                  // @ts-ignore
                                  setMe({ ...me, eventJoins: [...(me?.eventJoins || []), data] });
                                  setNotification({
                                    type: ToastType.Success,
                                    message: 'Votre inscription a bien été prise en compte !',
                                  });
                                },
                              });
                            }}
                          />
                        ),
                      })
                    : insertEventJoin({
                        // @ts-ignore
                        variables: { object: { eventId: event.id, joinedById: me?.id } },
                        onCompleted: ({ insertEventJoinOne: data }) => {
                          if (!data || !me?.user) return;
                          mergeCache(
                            { __typename: 'User', id: me.user.id },
                            { fieldName: 'eventJoins', fragmentOn: 'EventJoin', data }
                          );
                          // @ts-ignore
                          setMe({ ...me, eventJoins: [...(me?.eventJoins || []), data] });
                          setNotification({
                            type: ToastType.Success,
                            message: 'Votre inscription a bien été prise en compte !',
                          });
                        },
                      }),
                label: "S'inscrire",
              }}
            />
          )}
          <IconShare2
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/event/${event.slug}`);
              setNotification({ type: ToastType.Info, message: "Lien de l'événement copié !" });
            }}
          />
        </div>
      </div>
    </ViewLayout>
  );
}
