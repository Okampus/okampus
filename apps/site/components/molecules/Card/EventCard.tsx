'use client';

import UserGroup from '../Group/UserGroup';

import AvatarImage from '../../atoms/Image/AvatarImage';
import BannerImage from '../../atoms/Image/BannerImage';
import ITag from '../../atoms/Inline/ITag';

import { useTenant } from '../../../context/navigation';
import { useTranslation } from '../../../hooks/context/useTranslation';

import { IconArrowUpRight, IconUser } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import type { EventWithTeamInfo } from '../../../types/features/event.info';

export type EventCardProps = { event: EventWithTeamInfo };
export default function EventCard({ event }: EventCardProps) {
  const { tenant } = useTenant();

  const { format } = useTranslation();
  const displayedStart = format('weekDayHour', new Date(event.start));

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
          <IconArrowUpRight className="h-8 w-8" />
        </motion.i>
        <div className="relative mb-3">
          <BannerImage className="rounded-xl" src={event.banner?.url} name={event.name} />
          <UserGroup
            className="absolute left-[1rem] bottom-[1rem]"
            title="Inscrits"
            limit={4}
            users={event.eventJoins.slice(0, 4).map(({ joinedBy }) => joinedBy)}
          />
          <ITag
            content={participantsCount}
            endContent={<IconUser className="w-4 h-4" />}
            className="absolute right-[1rem] bottom-[1rem]"
          />
        </div>
        <div className="flex flex-col px-2 gap-0.5">
          <div className="flex justify-between text-[1.075rem] text-1 tracking-tighter font-medium uppercase line-clamp-1 tabular-nums">
            {displayedStart}
          </div>
          <div className="flex gap-4 mt-0.5">
            <AvatarImage actor={team.actor} size={36} type="team" className="mt-1" />
            <div>
              <div className="font-medium mt-0.5 text-lg text-0 line-clamp-2">{event.name}</div>
              <div className="flex text-base text-2">{organizersString}</div>
              <div className="flex text-base items-center gap-1.5 text-2">
                {event.price === 0 ? 'Gratuit' : format('euro', event.price)} • {event.pointsAwardedForAttendance}{' '}
                {tenant?.pointName}
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
            </div>
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
            <IconLink
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
