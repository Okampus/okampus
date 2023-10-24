'use client';

// import UserGroup from '../Group/UserGroup';

import AvatarImage from '../../atoms/Image/AvatarImage';
// import BannerImage from '../../atoms/Image/BannerImage';
// import ITag from '../../atoms/Inline/ITag';

import { useTenant } from '../../../_context/navigation';
import { useTranslation } from '../../../_hooks/context/useTranslation';

import { ArrowUpRight } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import type { EventWithTeamInfo } from '../../../../types/features/event.info';

export type EventCardProps = { event: EventWithTeamInfo };
export default function EventCard({ event }: EventCardProps) {
  const { tenant } = useTenant();

  const { format } = useTranslation();

  // const displayedAddress =
  //   event.location?.type === LocationType.Online
  //     ? event.location.details
  //     : event.location?.address?.name ||
  //       `${event.location?.address?.streetNumber} ${event.location?.address?.street}, ${event.location?.address?.city}`;

  const participantsCount = event.eventJoinsAggregate.aggregate?.count ?? 0;

  const organizersString = event.eventOrganizes.map((manage) => manage.team.actor?.name).join(' × ');
  const team = event.eventOrganizes[0]?.team;

  return (
    <div>
      <motion.div initial="rest" whileHover="hover" className="cursor-pointer overflow-hidden relative">
        <Link href={`/event/${event.slug}`} className="card-link" />
        <motion.i
          variants={{ rest: { y: '0rem', opacity: 0 }, hover: { y: '-0.5rem', opacity: 1 } }}
          transition={{ type: 'spring', bounce: 0 }}
          className="absolute z-20 top-[0.75rem] right-[0.5rem] p-3 text-white"
        >
          <ArrowUpRight className="h-8 w-8" />
        </motion.i>
        <div className="flex flex-col px-2 gap-1">
          <div className="flex gap-6 mt-0.5">
            <AvatarImage actor={team.actor} size={96} className="mt-1" />
            <div className="mt-0.5">
              <div className="flex gap-4 text-base text-1 tracking-tight font-medium capitalize line-clamp-1 tabular-nums">
                {format('weekDayLongHour', new Date(event.start))}
                <div className="flex items-center gap-1.5 text-[var(--secondary)] font-medium leading-6">
                  {event.price === 0 ? 'Gratuit' : format('euro', event.price)} • {event.pointsAwardedForAttendance}{' '}
                  {tenant?.pointName}
                </div>
              </div>
              <div className="font-bold my-2 text-3xl tracking-tighter text-0 line-clamp-2 leading-8">{event.name}</div>
              <div className="flex text-base text-2 leading-6">{organizersString}</div>
            </div>
          </div>
          <div className="flex gap-4 mb-3 h-16">
            {/* <BannerImage className="rounded-md" src={event.banner?.url} name={event.name} /> */}
            {/* <UserGroup
              className="absolute left-[0.5rem] bottom-[0.5rem]"
              title="Inscrits"
              limit={4}
              users={event.eventJoins.slice(0, 4).map(({ joinedBy }) => joinedBy)}
            />
            <ITag
              content={`${participantsCount} inscrits`}
              className="absolute font-medium text-sm text-0 right-[0.5rem] bottom-[0.5rem]"
            /> */}
          </div>
          {/* <div className="text-1 font-medium flex items-center justify-between">{displayedAddress}</div> */}
        </div>
      </motion.div>

      {/* {participantsCount > 0 && (
        <div className="mt-3 px-4 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserGroup
              itemsCount={participantsCount}
              size={10}
              title="Inscrits"
              users={event.eventJoins.map(({ joinedBy }) => joinedBy)}
            />
          </div>
          <div className="flex gap-4 items-center">
            <Link
              className="text-2 cursor-pointer h-7 w-7"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/event/${event?.slug}`);
                setNotification({ type: ToastType.Info, message: "Lien de l'événement copié !" });
              }}
            />
          </div>
        </div>
      )} */}
    </div>
  );
}
