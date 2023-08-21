'use client';

import UserGroup from '../Group/UserGroup';
import BannerImage from '../../atoms/Image/BannerImage';
import { notificationAtom } from '../../../context/global';
import { useTenant } from '../../../context/navigation';
import { useTranslation } from '../../../hooks/context/useTranslation';

import { ToastType } from '@okampus/shared/types';

import { IconArrowUpRight, IconLink } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import Link from 'next/link';

import type { EventMinimalInfo } from '../../../types/features/event.info';

export type EventCardProps = { event: EventMinimalInfo };
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
          <div className="flex justify-between text-sm text-1 font-semibold uppercase line-clamp-1 tabular-nums">
            <span>{displayedStart}</span>
            <span>
              ⭐ {event.pointsAwardedForAttendance} {tenant?.pointName}
            </span>
          </div>
          <div className="font-semibold mt-0.5 text-lg text-0 line-clamp-2">{event.name}</div>
          <div className="flex items-center gap-1.5 text-1 font-medium text-base">
            {event.price === 0 ? 'Gratuit' : format('euro', event.price)}
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
        <div className="mt-3 px-4 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserGroup
              itemsCount={participantsCount}
              size={12}
              title="Inscrits"
              users={event.eventJoins.map(({ joinedBy }) => joinedBy)}
            />
          </div>
          <div className="flex gap-4 items-center">
            <IconLink
              className="text-2 cursor-pointer h-7 w-7"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/event/${event?.slug}`);
                setNotification({ type: ToastType.Info, message: "Lien de l'événement copié !" });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
