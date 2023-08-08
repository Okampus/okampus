'use client';

import UserGroup from '../Group/UserGroup';
import BannerImage from '../../atoms/Image/BannerImage';
import { notificationAtom } from '../../../context/global';
import { useTenant } from '../../../context/navigation';
import { useTranslation } from '../../../hooks/context/useTranslation';

import { ToastType } from '@okampus/shared/types';

import { IconArrowUpRight, IconShare2 } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import Link from 'next/link';

import type { EventWithJoinInfo } from '@okampus/shared/graphql';

export type EventCardProps = { event: EventWithJoinInfo };
export default function EventCard({ event }: EventCardProps) {
  const [, setNotification] = useAtom(notificationAtom);
  const { tenant } = useTenant();

  const { format } = useTranslation();
  const displayedStart = format('weekDayHour', new Date(event.start));

  // const displayedAddress =
  //   event.location?.type === LocationType.Online
  //     ? event.location.locationDetails
  //     : event.location?.address?.name ||
  //       `${event.location?.address?.streetNumber} ${event.location?.address?.street}, ${event.location?.address?.city}`;

  const participantsCount = event.eventJoinsAggregate.aggregate?.count || 0;
  // const organizersString = event.eventOrganizes.map((manage) => manage.team.actor?.name).join(' × ');

  return (
    <div>
      <motion.div initial="rest" whileHover="hover" className="cursor-pointer overflow-hidden relative">
        <Link href={`/event/${event.slug}`} className="card-link" />
        <motion.i
          variants={{ rest: { y: '0rem', opacity: 0 }, hover: { y: '-0.5rem', opacity: 1 } }}
          transition={{ type: 'spring', bounce: 0 }}
          className="absolute z-20 top-[1rem] right-[0.5rem] p-3 text-white"
        >
          <IconArrowUpRight className="h-8 w-8" />
        </motion.i>
        <div className="relative mb-4">
          <BannerImage className="rounded-2xl" src={event.banner?.url} name={event.name} />
        </div>
        <div className="flex flex-col px-4 gap-0.5">
          <div className="text-primary font-semibold uppercase line-clamp-1 tabular-nums">{displayedStart}</div>
          <div className="text-lg font-semibold text-0 line-clamp-2">{event.name}</div>

          <div className="flex items-center gap-1.5 text-1 font-semibold text-sm">
            <div>{event.price === 0 ? 'Gratuit' : `${event.price} €`}</div>
            <div className="pb-0.5">/</div>
            <div>
              {event.pointsAwardedForAttendance} {tenant?.pointName}
            </div>
          </div>
          {event?.eventTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event?.eventTags.map(({ tag }, idx) => (
                <span key={idx} className="text-primary font-medium">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
          {/* <div className="text-1 font-medium flex items-center justify-between">{displayedAddress}</div> */}
        </div>
      </motion.div>

      {participantsCount > 0 && (
        <div className="mt-3 px-4 text-1 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserGroup size={12} users={event.eventJoins.map(({ joinedBy }) => joinedBy)} />
            {participantsCount}
          </div>
          <div className="flex gap-4 items-center">
            <IconShare2
              className="text-1 cursor-pointer h-8 w-8"
              onClick={() => setNotification({ type: ToastType.Info, message: "Lien de l'équipe copié !" })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
