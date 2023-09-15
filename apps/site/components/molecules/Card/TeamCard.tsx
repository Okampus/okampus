'use client';

import SocialIcon from '../../atoms/Icon/SocialIcon';
import BannerImage from '../../atoms/Image/BannerImage';
import AvatarImage from '../../atoms/Image/AvatarImage';

import FollowButton from '../Button/FollowButton';
import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';

import { IconArrowUpRight } from '@tabler/icons-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import Link from 'next/link';

import type { TeamCardInfo } from '../../../types/features/team.info';

type TeamCardProps = { team: TeamCardInfo };
export default function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="overflow-hidden">
      <motion.div initial="rest" whileHover="hover" className="relative cursor-pointer">
        <Link href={`/team/${team.slug}`} className="card-link" />
        <motion.i
          variants={{ rest: { y: '0rem', opacity: 0 }, hover: { y: '-0.5rem', opacity: 1 } }}
          transition={{ type: 'spring', bounce: 0 }}
          className="absolute z-20 top-[1rem] right-[0.5rem] p-3 text-white"
        >
          <IconArrowUpRight className="h-8 w-8" />
        </motion.i>
        <div className="relative mb-4">
          <BannerImage
            className="rounded-md"
            aspectRatio={BANNER_ASPECT_RATIO}
            src={team.actor.banner}
            name={team.actor.name}
          />
        </div>
        <div className="flex flex-col gap-2 px-2 mb-3">
          <div className={clsx('flex gap-3', team.actor.name.length > 20 ? 'items-start' : 'items-center')}>
            <AvatarImage actor={team.actor} size={32} type="team" />
            <div className="flex flex-wrap gap-x-3">
              <span className="leading-5 text-lg font-medium text-0">{team.actor.name}</span>
              <span className="leading-5 text-primary font-medium">
                {team.teamMembersAggregate.aggregate?.count} membres
              </span>
            </div>
          </div>
          {/* <div className="flex flex-wrap gap-2">
            {team.actor?.actorTags.map(({ tag }, idx) => (
              <span key={idx} className="text-primary font-medium">
                #{tag.name}
              </span>
            ))}
          </div> */}
          <div className="px-0.5 text-2 h-18 line-clamp-2 text-base text-1 font-medium">{team.actor?.status}</div>
        </div>
      </motion.div>
      <div className="mb-4 px-2 mt-1 flex justify-between gap-3">
        <div className="flex items-center gap-2">
          {team.actor?.socials.map((social) => (
            <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="text-1">
              <SocialIcon social={social.type} small={true} />
            </a>
          ))}
        </div>
        <FollowButton actorId={team.actor.id} small={true} />
      </div>
    </div>
  );
}
