'use client';

import SocialIcon from '../../../../../components/atoms/Icon/SocialIcon';
import QRImage from '../../../../../components/atoms/Image/QRCodeImage';
import ILocation from '../../../../../components/atoms/Inline/ILocation';
import ITag from '../../../../../components/atoms/Inline/ITag';
import GroupItem from '../../../../../components/atoms/Item/GroupItem';
import ViewLayout from '../../../../../components/atoms/Layout/ViewLayout';

import ActionButton from '../../../../../components/molecules/Button/ActionButton';
import TeamLabeled from '../../../../../components/molecules/Labeled/TeamLabeled';
import CTAButton from '../../../../../components/molecules/Button/CTAButton';
import FollowButton from '../../../../../components/molecules/Button/FollowButton';
import UserGroup from '../../../../../components/molecules/Group/UserGroup';
import FormRenderer from '../../../../../components/organisms/FormRenderer';

import { notificationAtom } from '../../../../../context/global';
import { useEvent, useMe } from '../../../../../context/navigation';

import { useBottomSheet } from '../../../../../hooks/context/useBottomSheet';
import { useModal } from '../../../../../hooks/context/useModal';
import { useTranslation } from '../../../../../hooks/context/useTranslation';

import { mergeCache } from '../../../../../utils/apollo/merge-cache';

import { useInsertEventJoinMutation } from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';
import { IconGps, IconMail, IconQrcode, IconWorldWww } from '@tabler/icons-react';

import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { useMemo } from 'react';

export default function EventPage({ params }: { params: { slug: string } }) {
  const MapWithMarker = useMemo(
    () => dynamic(() => import('../../../../../components/atoms/Map/MapWithMarker'), { ssr: false }),
    [],
  );

  const { event } = useEvent(params.slug);
  const me = useMe();

  const { format } = useTranslation();
  const [, setNotification] = useAtom(notificationAtom);

  const currentUserEventJoin = me.user.eventJoins?.find((join) => join.event.id === event?.id);
  const { openModal } = useModal();
  const { closeBottomSheet, openBottomSheet } = useBottomSheet();

  const [insertEventJoin] = useInsertEventJoinMutation();

  if (!event) return null;

  const actionCta = currentUserEventJoin ? (
    <CTAButton
      className="w-full mt-4 uppercase"
      action={() =>
        openModal({
          node: (
            <QRImage data={`${window.location.origin}/confirm-attendance/${currentUserEventJoin.id}`} showData={true} />
          ),
        })
      }
    >
      <div className="flex gap-4 items-center">
        <IconQrcode />
        Mon QR code
      </div>
    </CTAButton>
  ) : (
    <CTAButton
      className="w-full mt-4 !h-[var(--h-topbar)] uppercase"
      type={ActionType.Primary}
      action={() =>
        event.joinForm
          ? openBottomSheet({
              node: (
                <FormRenderer
                  form={event.joinForm}
                  onSubmit={(values) => {
                    const submission = Object.entries(values).map(([slug, value]) => ({ slug, value }));
                    const object = {
                      eventId: event.id,
                      joinedById: me.user.id,
                      formSubmission: {
                        data: {
                          submission,
                          formId: event.joinForm?.id,
                          tenantId: me.user.tenant.id,
                          createdById: me.user.individual.id,
                        },
                      },
                    };
                    insertEventJoin({
                      variables: { object },
                      onCompleted: ({ insertEventJoinOne: data }) => {
                        if (!data) return;
                        mergeCache(
                          { __typename: 'User', id: me.user.id },
                          { fieldName: 'eventJoins', fragmentOn: 'EventJoin', data },
                        );
                        closeBottomSheet();
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
              variables: { object: { eventId: event.id, joinedById: me.user.individual.id } },
              onCompleted: ({ insertEventJoinOne: data }) => {
                if (!data) return;
                mergeCache(
                  { __typename: 'User', id: me.user.id },
                  { fieldName: 'eventJoins', fragmentOn: 'EventJoin', data },
                );
                setNotification({
                  type: ToastType.Success,
                  message: 'Votre inscription a bien été prise en compte !',
                });
              },
            })
      }
    >
      S&apos;inscrire {event.price ? `— ${format('euro', event.price)}` : 'Gratuitement'}
    </CTAButton>
  );

  const start = new Date(event.start);
  const attendingCount = event.eventJoinsAggregate.aggregate?.count ?? 0;

  const address = event.location?.address;

  return (
    <ViewLayout hasCta={true} bottomPadded={true} innerClassName="relative" header={event.name}>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_32rem] gap-x-20 gap-6 items-start">
        <div className="flex flex-col">
          <hr className="md:hidden border-color-2 mb-6" />
          <div className="flex items-center flex-wrap gap-3 text-0 text-xl font-medium">
            Organisé par
            {event.eventOrganizes.map(({ team }) => (
              <>
                <TeamLabeled
                  key={team.id}
                  className="items-center text-xl"
                  labelClassName="text-xl tracking-tighter"
                  avatarSize={14}
                  team={team}
                />
                {event.eventOrganizes.length > 1 && <span className="text-xl">X</span>}
              </>
            ))}
          </div>
          <hr className="border-color-2 my-6" />
          <GroupItem heading="Programme de l'événement" groupClassName="text-justify font-medium whitespace-pre-line">
            {event.description}
          </GroupItem>
          <hr className="border-color-2 my-6" />
          <GroupItem heading="A propos des organisateurs" groupClassName="text-justify font-medium whitespace-pre-line">
            <div className="flex flex-col gap-3">
              {event.eventOrganizes.map(({ team }) => (
                <div key={team.id} className="flex justify-between items-start flex-wrap gap-6">
                  <div className="flex flex-col items-start gap-2">
                    <TeamLabeled
                      key={team.id}
                      className="items-center text-xl shrink-0"
                      labelClassName="tracking-tighter"
                      avatarSize={20}
                      team={team}
                      content={`${team.teamMembersAggregate.aggregate?.count} membres`}
                    />
                    <div className="flex gap-2.5 justify-center items-center">
                      {[...team.actor.socials]
                        ?.sort((a, b) => a.order - b.order)
                        .map((social) => (
                          <a
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8"
                          >
                            <SocialIcon social={social.type} small={true} className="text-0" />
                          </a>
                        ))}
                      {team.actor.email && (
                        <>
                          {team.actor.socials.length > 0 && (
                            <div className="w-[2px] h-6 bg-[var(--border-color-1)] rounded-md" />
                          )}
                          <Link href={`mailto:${team.actor.email}`} className="w-8 h-8">
                            <IconMail className="text-0 w-full h-full" />
                          </Link>
                        </>
                      )}
                      {team.actor.website && (
                        <>
                          {team.actor.email ||
                            (team.actor.socials.length > 0 && (
                              <div className="w-[2px] h-6 bg-[var(--border-color-1)] rounded-md" />
                            ))}
                          <a href={team.actor.website} target="_blank" rel="noopener noreferrer" className="w-8 h-8">
                            <IconWorldWww className="text-0 w-full h-full" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-10">
                    <FollowButton actorId={team.actor.id} />
                  </div>
                </div>
              ))}
            </div>
          </GroupItem>
        </div>
        <div className="xl-max:order-first flex flex-col gap-6">
          <div className="flex flex-col gap-1 xl:border-2 border-color-1 xl:rounded-xl xl:px-8 xl:py-7">
            <div className="font-semibold text-0 text-xl flex items-center flex-wrap gap-x-3">
              <p className="capitalize inline tracking-tighter">{format('weekDayLong', start)} </p>
              <ITag className="text-sm" content={format('relativeTimeLong', start.getTime())} />
            </div>
            <div className="tracking-tighter tabular-nums text-2 uppercase font-medium">
              {format('dayHourRange', [start, new Date(event.end)])}
            </div>
            <div className="mt-2 font-medium flex items-center gap-2">
              <UserGroup
                size={10}
                title="Inscrits"
                users={event.eventJoins.slice(0, 3).map(({ joinedBy }) => joinedBy)}
              />
              {attendingCount} inscrits
              {event.maxParticipants ? (
                <>
                  {' '}
                  •{' '}
                  <span className="inline text-primary">{event.maxParticipants - attendingCount} places restantes</span>
                </>
              ) : null}
            </div>
            {actionCta}
          </div>
          <div className="flex flex-col gap-1 xl:border-2 border-color-1 xl:rounded-xl xl:px-8 xl:py-7">
            <div className="font-semibold text-0 text-xl flex items-center flex-wrap gap-x-3">Point de rendez-vous</div>
            <ILocation location={event.location} inline={false} />
            {address && (
              <>
                {address.latitude && address.longitude ? (
                  <MapWithMarker
                    className="h-[20rem] rounded-xl my-4"
                    center={[address.latitude, address.longitude]}
                    initMarkerOpened={true}
                    markerContent={<ILocation location={event.location} inline={false} />}
                  />
                ) : null}
                <ActionButton
                  action={{
                    iconOrSwitch: <IconGps />,
                    type: ActionType.Action,
                    label: "Voir l'itinéraire",
                    linkOrActionOrMenu: `https://www.google.com/maps/dir/?api=1&destination=${address.latitude},${address.longitude}`,
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </ViewLayout>
  );
}
