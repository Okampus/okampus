import SocialIcon from '../../../../_components/atoms/Icon/SocialIcon';
import QRImage from '../../../../_components/atoms/Image/QRCodeImage';
// import ILocation from '../../../../_components/atoms/Inline/ILocation';
import ITag from '../../../../_components/atoms/Inline/ITag';
import ViewLayout from '../../../../_components/atoms/Layout/ViewLayout';
// import ActionButton from '../../../../_components/molecules/Button/ActionButton';
import CTAButton from '../../../../_components/molecules/Button/CTAButton';
import FollowButton from '../../../../_components/molecules/Button/FollowButton';
import TeamLabeled from '../../../../_components/molecules/Labeled/TeamLabeled';
import SimpleList from '../../../../_components/molecules/List/SimpleList';
import FormRenderer from '../../../../_components/organisms/FormRenderer';
import { notificationAtom } from '../../../../_context/global';
import { useMe } from '../../../../_context/navigation';
import { useBottomSheet } from '../../../../_hooks/context/useBottomSheet';
import { useModal } from '../../../../_hooks/context/useModal';
import { useTranslation } from '../../../../_hooks/context/useTranslation';
import { updateFragment } from '../../../../../utils/apollo/update-fragment';
import { MeFragment } from '../../../../../utils/apollo/fragments';
import { ActionType, ToastType } from '@okampus/shared/types';
import { useInsertEventJoinMutation } from '@okampus/shared/graphql';
import { produce } from 'immer';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useMemo } from 'react';
import {
  QrCode,
  At,
  Globe,
  // NavigationArrow
} from '@phosphor-icons/react/dist/ssr';
import type { EventInfo, MeInfo } from '../../../../../utils/apollo/fragments';

const importMapWithMarker = () => import('../../../../_components/atoms/Map/MapWithMarker');

export type EventViewProps = { event: EventInfo | null };
export default function EventView({ event }: EventViewProps) {
  const MapWithMarker = useMemo(() => dynamic(importMapWithMarker, { ssr: false }), []);

  const me = useMe();
  const currentUserEventJoin = me.eventJoins?.find((join) => join.event.id === event?.id);

  const { format } = useTranslation();
  const [, setNotification] = useAtom(notificationAtom);

  const { openModal } = useModal();
  const { closeBottomSheet, openBottomSheet } = useBottomSheet();

  const [insertEventJoin] = useInsertEventJoinMutation();

  if (!event) return null;

  const actionCta = currentUserEventJoin ? (
    <CTAButton
      className="w-full mt-4 uppercase"
      type={ActionType.Info}
      action={() =>
        openModal({
          node: (
            <QRImage data={`${window.location.origin}/confirm-attendance/${currentUserEventJoin.id}`} showData={true} />
          ),
        })
      }
    >
      <div className="flex gap-4 items-center">
        <QrCode />
        Mon QR code
      </div>
    </CTAButton>
  ) : (
    <CTAButton
      className="w-full mt-4 !h-[var(--h-topbar)]"
      type={ActionType.Primary}
      action={() =>
        event.joinForm
          ? openBottomSheet({
              node: (
                <FormRenderer
                  form={event.joinForm}
                  name={`Formulaire d'inscription / ${event.name}`}
                  onSubmit={(values) => {
                    const submission = Object.entries(values).map(([slug, value]) => ({ slug, value }));
                    const object = {
                      eventId: event.id,
                      joinedById: me.id,
                      formSubmission: { data: { submission, formId: event.joinForm?.id, createdById: me.id } },
                    };
                    insertEventJoin({
                      variables: { object },
                      onCompleted: ({ insertEventJoinOne }) => {
                        if (!insertEventJoinOne) return;

                        updateFragment<MeInfo>({
                          __typename: 'Me',
                          fragment: MeFragment,
                          where: { slug: me.slug },
                          update: (data) =>
                            produce(data, (data) => {
                              data.eventJoins.push(insertEventJoinOne);
                            }),
                        });

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
              variables: { object: { eventId: event.id, joinedById: me.id } },
              onCompleted: ({ insertEventJoinOne }) => {
                if (!insertEventJoinOne) return;

                updateFragment<MeInfo>({
                  __typename: 'Me',
                  fragment: MeFragment,
                  where: { slug: me.slug },
                  update: (data) =>
                    produce(data, (data) => {
                      data.eventJoins.push(insertEventJoinOne);
                    }),
                });

                setNotification({
                  type: ToastType.Success,
                  message: 'Votre inscription a bien été prise en compte !',
                });
              },
            })
      }
    >
      S&apos;inscrire {event.price ? `— ${format('euro', event.price)}` : 'gratuitement'}
    </CTAButton>
  );

  const start = new Date(event.start);
  const attendingCount = event.eventJoinsAggregate.aggregate?.count ?? 0;

  const address = event.location?.address;

  return (
    <ViewLayout hasCta={true} bottomPadded={true} innerClassName="relative" header={event.name}>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_32rem] gap-x-20 gap-6 items-start">
        <div className="flex flex-col">
          <hr className="md:hidden border-[var(--border-2)] mb-6" />
          <SimpleList heading="Organisé par" groupClassName="text-justify font-medium whitespace-pre-line">
            <div className="flex flex-col gap-3">
              {event.eventOrganizes.map(({ team }) => (
                <div key={team.id} className="flex justify-between items-start flex-wrap gap-6">
                  <div className="flex flex-col items-start gap-2">
                    <TeamLabeled
                      key={team.id}
                      className="items-center text-xl shrink-0"
                      avatarSize={42}
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
                            <div className="w-[2px] h-6 bg-[var(--border-[var(--border-1)])] rounded-md" />
                          )}
                          <Link href={`mailto:${team.actor.email}`} className="w-8 h-8">
                            <At className="text-0 w-full h-full" />
                          </Link>
                        </>
                      )}
                      {team.actor.website && (
                        <>
                          {team.actor.email ||
                            (team.actor.socials.length > 0 && (
                              <div className="w-[2px] h-6 bg-[var(--border-[var(--border-1)])] rounded-md" />
                            ))}
                          <a href={team.actor.website} target="_blank" rel="noopener noreferrer" className="w-8 h-8">
                            <Globe className="text-0 w-full h-full" />
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
          </SimpleList>
          <hr className="border-[var(--border-2)] my-6" />
          <SimpleList heading="Programme de l'événement" groupClassName="text-justify font-medium whitespace-pre-line">
            {event.description}
          </SimpleList>
          <hr className="border-[var(--border-2)] my-6" />
        </div>
        <div className="xl-max:order-first flex flex-col gap-6">
          <div className="flex flex-col gap-1 border-[var(--border-1)] xl:border-2 xl:rounded-xl xl:px-8 xl:py-7 xl-max:pt-4">
            <div className="font-semibold text-0 text-xl flex items-center flex-wrap gap-x-3">
              <p className="capitalize inline tracking-tighter">{format('weekDayLong', start)} </p>
              <ITag className="text-sm" content={format('relativeTimeLong', start.getTime())} />
            </div>
            <div className="tracking-tighter tabular-nums text-2 uppercase font-medium">
              {format('dayHourRange', [start, new Date(event.end)])}
            </div>
            <div className="mt-2 font-medium flex items-center gap-2">
              <Link href={`/event/${event.slug}/joins`}>{attendingCount} inscrits</Link> •
              <span className="inline text-primary">
                {event.maxParticipants
                  ? `${event.maxParticipants - attendingCount} places restantes`
                  : 'Places illimitées'}
              </span>
            </div>
            {actionCta}
            <hr className="border-[var(--border-2)] mt-6 mb-2 xl:hidden" />
          </div>
          <div className="flex flex-col gap-1 border-[var(--border-1)] xl:border-2 xl:rounded-xl xl:px-8 xl:py-7">
            <div className="font-semibold text-0 text-xl flex items-center flex-wrap gap-x-3">Point de rendez-vous</div>
            {/* <ILocation location={event.location} inline={false} />
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
                  linkInNewTab={true}
                  action={{
                    iconOrSwitch: <NavigationArrow />,
                    type: ActionType.Action,
                    label: "Voir l'itinéraire",
                    linkOrActionOrMenu: `https://www.google.com/maps/dir/?api=1&destination=${address.latitude},${address.longitude}`,
                  }}
                />
              </>
            )} */}
          </div>
        </div>
      </div>
    </ViewLayout>
  );
}
