'use client';

import EventButton from './EventButton';
import AttendeeCard from '../AttendeeCard';
import SocialIcon from '../../_components/atoms/Icon/SocialIcon';
import Section from '../../_components/atoms/Container/Section';
import AvatarImage from '../../_components/atoms/Image/AvatarImage';
import ILinkList from '../../_components/atoms/Inline/ILinkList';

import ShareButton from '../../_components/molecules/Button/ShareButton';
import Button from '../../_components/molecules/Button/Button';
import ChoiceList from '../../_components/molecules/List/ChoiceList';
import AvatarStack from '../../_components/molecules/Stack/AvatarStack';

import PanelView from '../../_components/templates/PanelView';

import { useBottomSheet } from '../../_hooks/context/useBottomSheet';
import { useMe } from '../../_hooks/context/useMe';
import { useModal } from '../../_hooks/context/useModal';

import { baseUrl, protocol } from '../../../config';
import { dateFormatters, dateRangeFormatters } from '../../../utils/format/format';

import { Bookmark, Clock, MapPin, PaperPlaneRight, Question, SealQuestion } from '@phosphor-icons/react';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useFormatter, useLocale } from 'next-intl';
import { useMemo } from 'react';

import type { EventDetails } from '../../../types/prisma/Event/event-details';
import type { Locale } from '../../../server/ssr/getLang';

const importMapWithMarker = () => import('../../_components/atoms/Map/MapWithMarker');

export type EventViewProps = { event: EventDetails };
export default function EventView({ event }: EventViewProps) {
  const MapWithMarker = useMemo(() => dynamic(importMapWithMarker, { ssr: false }), []);

  const locale = useLocale() as Locale;

  const { data: me } = useMe();
  const currentUserEventJoin = me.eventJoins?.find((join) => join.event.id === event?.id);

  const format = useFormatter();

  const { openModal } = useModal();
  const { closeBottomSheet, openBottomSheet } = useBottomSheet();

  // const [insertEventJoin] = useInsertEventJoinMutation();
  // const actionCta = currentUserEventJoin ? (
  //   <CTAButton
  //     className="w-full mt-4 uppercase"
  //     type={ActionType.Info}
  //     action={() =>
  //       openModal({
  //         node: (
  //           <QRImage data={`${window.location.origin}/validate/event-join/${currentUserEventJoin.id}`} showData={true} />
  //         ),
  //       })
  //     }
  //   >
  //     <div className="flex gap-4 items-center">
  //       <QrCode />
  //       Mon QR code
  //     </div>
  //   </CTAButton>
  // ) : (
  //   <CTAButton
  //     className="w-full mt-4 !h-[var(--h-topbar)]"
  //     type={ActionType.Primary}
  //     action={
  //       () =>
  //         // event.joinForm
  //         //   ?
  //         // TODO: if no form, show a confirmation modal
  //         openBottomSheet({
  //           node: event.joinForm && (
  //             <FormRenderer
  //               form={event.joinForm}
  //               name={`Formulaire d'inscription / ${event.name}`}
  //               submit={(values) => {
  //                 // // TODO
  //                 // const submission = Object.entries(values).map(([slug, value]) => ({ slug, value }));
  //                 // const object = {
  //                 //   eventId: event.id,
  //                 //   joinedById: me.id,
  //                 //   formSubmission: { data: { submission, formId: event.joinForm?.id, createdById: me.id } },
  //                 // };
  //                 // insertEventJoin({
  //                 //   variables: { object },
  //                 //   onCompleted: ({ insertEventJoinOne }) => {
  //                 //     if (!insertEventJoinOne) return;
  //                 //     updateFragment<MeInfo>({
  //                 //       __typename: 'Me',
  //                 //       fragment: MeFragment,
  //                 //       where: { slug: me.slug },
  //                 //       update: (data) =>
  //                 //         produce(data, (data) => {
  //                 //           data.eventJoins.push(insertEventJoinOne);
  //                 //         }),
  //                 //     });
  //                 //     closeBottomSheet();
  //                 //     setNotification({
  //                 //       type: ToastType.Success,
  //                 //       message: 'Votre inscription a bien été prise en compte !',
  //                 //     });
  //                 //   },
  //                 // });
  //               }}
  //             />
  //           ),
  //         })
  //       // : insertEventJoin({
  //       //     variables: { object: { eventId: event.id, joinedById: me.id } },
  //       //     onCompleted: ({ insertEventJoinOne }) => {
  //       //       if (!insertEventJoinOne) return;

  //       //       updateFragment<MeInfo>({
  //       //         __typename: 'Me',
  //       //         fragment: MeFragment,
  //       //         where: { slug: me.slug },
  //       //         update: (data) =>
  //       //           produce(data, (data) => {
  //       //             data.eventJoins.push(insertEventJoinOne);
  //       //           }),
  //       //       });

  //       //       setNotification({
  //       //         type: ToastType.Success,
  //       //         message: 'Votre inscription a bien été prise en compte !',
  //       //       });
  //       //     },
  //       //   })
  //     }
  //   >
  //     S&apos;inscrire {event.price ? `— ${format('euro', event.price)}` : 'gratuitement'}
  //   </CTAButton>
  // );

  const start = new Date(event.start);
  const attendingCount = event._count.eventJoins ?? 0;

  const supervisors = event.eventOrganizes.flatMap(({ eventSupervisors, team }) =>
    eventSupervisors.map(({ user }) => user),
  );

  const organisorLinks = supervisors.slice(0, 2).map((user) => ({
    href: `/user/${user.slug}`,
    label: user.actor.name,
  }));
  const remainingCount = supervisors.length - 2;

  return (
    <PanelView
      responsiveMode="prepend"
      hasCta={true}
      header={event.name}
      viewHeader={
        <div className="flex justify-between mb-14">
          <div className="flex items-center gap-6">
            <AvatarStack actors={supervisors.map((user) => user.actor)} size={52} limit={2} />
            <div>
              <div className="text-1">Événement supervisé par</div>
              <ILinkList
                links={[
                  ...organisorLinks,
                  ...(remainingCount > 0
                    ? [
                        {
                          href: `/event/${event.slug}/attendees`,
                          label: `et ${remainingCount} autre${remainingCount > 1 ? 's' : ''}`,
                        },
                      ]
                    : []),
                ]}
                className="text-0 font-semibold"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <ShareButton url={`${protocol}://${baseUrl}/event/${event.slug}`} text={event.summary} title={event.name} />
            <Button>
              <Bookmark size={28} />
              Sauvegarder
            </Button>
          </div>
        </div>
      }
      content={
        <>
          <Section title="Description" paddingMode="none">
            {event.description}
          </Section>
          <Section title="Participants">
            <div className="grid grid-cols-4 gap-6">
              {event.eventJoins.map(({ joinedBy }) => (
                <AttendeeCard key={joinedBy.id} user={joinedBy} title="Participant" />
              ))}
            </div>
          </Section>
        </>
      }
      panel={
        <>
          <Section title="Date & lieu" paddingMode="none">
            <div className="flex gap-6 mt-2">
              <Clock className="h-6 w-6 text-2" />
              <div className="text-0">
                {event.end
                  ? dateRangeFormatters[locale].dayHourRange.formatRange(start, event.end)
                  : format.dateTime(start, dateFormatters.weekDayLongHour)}
              </div>
            </div>
            <div className="flex gap-6">
              <MapPin className="h-6 w-6 text-2" />
              <div className="text-0">{event?.address?.name ?? event?.name ?? 'À déterminer'}</div>
            </div>
            <EventButton event={event} />
            {/* <CTAButton action={'/teams'}>Rejoindre l&apos;événement</CTAButton> */}
          </Section>
          <hr className="border-[var(--border-1)]" />
          <>
            {event.eventOrganizes.map(({ team }) => (
              <div key={team.id} className="flex items-center gap-3 mt-6">
                <Link href={`/team/${team.slug}`}>
                  <AvatarImage actor={team.actor} size={60} />
                </Link>
                <div>
                  <Link href={`/team/${team.slug}`} className="font-semibold text-0 hover:underline line-clamp-1">
                    {team.actor.name}
                  </Link>
                  <div
                    className="hover:underline cursor-pointer mt-1 flex gap-1.5 items-center text-[var(--info)]"
                    onClick={() =>
                      openModal({
                        header: `Contacter ${team.actor.name}`,
                        description: 'Si vous avez une question, la poser dans la FAQ.',
                        node: (
                          <ChoiceList
                            choices={[
                              {
                                prefix: <SealQuestion className="h-6 w-6" />,
                                label: "FAQ de l'événement",
                                action: `/event/${event.slug}/faq`,
                              },
                              {
                                prefix: <Question className="h-6 w-6" />,
                                label: "FAQ de l'équipe",
                                action: `/team/${team.slug}/faq`,
                              },
                              ...(team.actor.email
                                ? [
                                    {
                                      prefix: <PaperPlaneRight className="h-6 w-6" />,
                                      label: 'Contacter par mail',
                                      action: `mailto:${team.actor.email}`,
                                    },
                                  ]
                                : []),
                              ...team.actor.socials.map((social) => ({
                                prefix: <SocialIcon social={social.type} className="h-6 w-6" />,
                                label: `Contacter sur ${social.type}`,
                                action: social.url,
                              })),
                            ]}
                          />
                        ),
                      })
                    }
                  >
                    Contacter l&apos;association
                  </div>
                </div>
              </div>
            ))}
          </>
        </>
      }
    />
  );

  // return (
  //   <BaseView hasCta={true} header={event.name}>
  //     <div>
  //       <hr className="border-[var(--border-1)] mb-10" />
  //       <div className="flex items-start gap-28">
  //         <div>
  //           <Section title="Description">
  //             {event.description}
  //           </Section>
  //           <Section title="Participants">
  //             <div className="grid grid-cols-4 gap-6">
  //               {event.eventJoins.map(({ joinedBy }) => (
  //                 <AttendeeCard key={joinedBy.id} actor={joinedBy.actor} title="Participant" />
  //               ))}
  //             </div>
  //           </Section>
  //         </div>
  //         <div className="flex flex-col gap-6 w-[32rem] sticky top-20">
  //           <div className="p-6 bg-[var(--bg-main)] rounded-xl flex flex-col gap-6">
  //             {event.eventOrganizes.map(({ team }) => (
  //               <div key={team.id} className="flex items-center gap-3">
  //                 <Link href={`/team/${team.slug}`}>
  //                   <AvatarImage actor={team.actor} size={70} />
  //                 </Link>
  //                 <div>
  //                   <Link
  //                     href={`/team/${team.slug}`}
  //                     className="font-semibold text-0 text-lg hover:underline line-clamp-1"
  //                   >
  //                     {team.actor.name}
  //                   </Link>
  //                   <div
  //                     className="hover:underline cursor-pointer mt-1 flex gap-1.5 items-center text-[var(--info)]"
  //                     onClick={() =>
  //                       openModal({
  //                         header: `Contacter ${team.actor.name}`,
  //                         description: 'Si vous avez une question, vous pouvez poser votre question dans la FAQ.',
  //                         node: (
  //                           <ChoiceList
  //                             choices={[
  //                               {
  //                                 prefix: <SealQuestion className="h-6 w-6" />,
  //                                 label: "FAQ de l'événement",
  //                                 action: `/event/${event.slug}/faq`,
  //                               },
  //                               {
  //                                 prefix: <Question className="h-6 w-6" />,
  //                                 label: "FAQ de l'équipe",
  //                                 action: `/team/${team.slug}/faq`,
  //                               },
  //                               ...(team.actor.email
  //                                 ? [
  //                                     {
  //                                       prefix: <PaperPlaneRight className="h-6 w-6" />,
  //                                       label: 'Contacter par mail',
  //                                       action: `mailto:${team.actor.email}`,
  //                                     },
  //                                   ]
  //                                 : []),
  //                               ...team.actor.socials.map((social) => ({
  //                                 prefix: <SocialIcon social={social.type} className="h-6 w-6" />,
  //                                 label: `Contacter sur ${social.type}`,
  //                                 action: social.url,
  //                               })),
  //                             ]}
  //                           />
  //                         ),
  //                       })
  //                     }
  //                   >
  //                     Contacter <PaperPlaneRight />
  //                   </div>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //           <div className="p-6 bg-[var(--bg-main)] rounded-xl flex flex-col gap-6">
  //             <div className="flex gap-6 mt-2">
  //               <Clock className="h-6 w-6 text-2" />
  //               <div className="text-0">
  //                 {event.end ? format('dayHourRange', [start, event.end]) : format('weekDayLongHour', start)}
  //               </div>
  //             </div>
  //             <div className="flex gap-6">
  //               <MapPin className="h-6 w-6 text-2" />
  //               <div className="text-0">{event.location?.address?.name ?? event.location?.name ?? 'À déterminer'}</div>
  //             </div>
  //             <EventButton event={event} />
  //             {/* <CTAButton action={'/teams'}>Rejoindre l&apos;événement</CTAButton> */}
  //           </div>
  //         </div>
  //       </div>
  //       <hr className="border-[var(--border-1)] my-10" />
  //       <div></div>
  //     </div>
  //     <div className="grid grid-cols-1 xl:grid-cols-[1fr_32rem] gap-x-20 gap-6 items-start">
  //       <div>
  //         <hr className="md:hidden border-[var(--border-2)] mb-6" />
  //         <div className="flex flex-col gap-3">
  //           {event.eventOrganizes.map(({ team }) => (
  //             <div key={team.id} className="flex justify-between items-start flex-wrap gap-6">
  //               <div className="flex flex-col items-start gap-2">
  //                 <TeamLabeled
  //                   key={team.id}
  //                   className="items-center text-xl shrink-0"
  //                   avatarSize={42}
  //                   team={team}
  //                   content={`${team._count.teamMembers} membres`}
  //                 />
  //                 <div className="flex gap-2.5 justify-center items-center">
  //                     {[...team.actor.socials]
  //                       ?.sort((a, b) => a.order - b.order)
  //                       .map((social) => (
  //                         <a
  //                           key={social.id}
  //                           href={social.url}
  //                           target="_blank"
  //                           rel="noopener noreferrer"
  //                           className="w-8 h-8"
  //                         >
  //                           <SocialIcon social={social.type} small={true} className="text-0" />
  //                         </a>
  //                       ))}
  //                     {team.actor.email && (
  //                       <>
  //                         {team.actor.socials.length > 0 && (
  //                           <div className="w-[2px] h-6 bg-[var(--border-[var(--border-1)])] rounded-md" />
  //                         )}
  //                         <Link href={`mailto:${team.actor.email}`} className="w-8 h-8">
  //                           <At className="text-0 w-full h-full" />
  //                         </Link>
  //                       </>
  //                     )}
  //                     {team.actor.website && (
  //                       <>
  //                         {team.actor.email ||
  //                           (team.actor.socials.length > 0 && (
  //                             <div className="w-[2px] h-6 bg-[var(--border-[var(--border-1)])] rounded-md" />
  //                           ))}
  //                         <a href={team.actor.website} target="_blank" rel="noopener noreferrer" className="w-8 h-8">
  //                           <Globe className="text-0 w-full h-full" />
  //                         </a>
  //                       </>
  //                     )}
  //                   </div>
  //               </div>

  //               <div className="flex items-center gap-10">
  //                 <FollowButton actorId={team.actor.id} />
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //         <hr className="border-[var(--border-2)] my-6" />
  //         {event.description}
  //         <hr className="border-[var(--border-2)] my-6" />
  //       </div>
  //       <div className="xl-max:order-first flex flex-col gap-6">
  //         <div className="flex flex-col gap-1 border-[var(--border-1)] xl:border-2 xl:rounded-xl xl:px-8 xl:py-7 xl-max:pt-4">
  //           <div className="font-semibold text-0 text-xl flex items-center flex-wrap gap-x-3">
  //             <p className="capitalize inline tracking-tighter">{format('weekDayLong', start)} </p>
  //             <ITag className="text-sm" content={format('relativeTimeLong', start.getTime())} />
  //           </div>
  //           <div className="tracking-tighter tabular-nums text-2 uppercase font-medium">
  //             {format('dayHourRange', [start, new Date(event.end)])}
  //           </div>
  //           <div className="mt-2 font-medium flex items-center gap-2">
  //             <Link href={`/event/${event.slug}/attendees`}>{attendingCount} inscrits</Link> •
  //             <span className="inline text-primary">
  //               {event.maxParticipants
  //                 ? `${event.maxParticipants - attendingCount} places restantes`
  //                 : 'Places illimitées'}
  //             </span>
  //           </div>
  //           <EventButton event={event} />
  //           <hr className="border-[var(--border-2)] mt-6 mb-2 xl:hidden" />
  //         </div>
  //         <div className="flex flex-col gap-1 border-[var(--border-1)] xl:border-2 xl:rounded-xl xl:px-8 xl:py-7">
  //           <div className="font-semibold text-0 text-xl flex items-center flex-wrap gap-x-3">Point de rendez-vous</div>
  //           <ILocation location={event.location} inline={false} />
  //           {address && (
  //             <>
  //               {address.latitude && address.longitude ? (
  //                 <MapWithMarker
  //                   className="h-[20rem] rounded-xl my-4"
  //                   center={[address.latitude, address.longitude]}
  //                   initMarkerOpened={true}
  //                   markerContent={<ILocation location={event.location} inline={false} />}
  //                 />
  //               ) : null}
  //               <ActionButton
  //                 action={{
  //                   iconOrSwitch: <NavigationArrow />,
  //                   type={ActionType.Action}

  //                   label: "Voir l'itinéraire",
  //                   action={`https://www.google.com/maps/dir/?api=1&destination=${address.latitude},${address.longitude}`}
  //                 }}
  //               />
  //             </>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   </BaseView>
  // );
}
