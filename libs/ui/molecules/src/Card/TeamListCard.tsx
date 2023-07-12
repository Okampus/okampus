'use client';

import { ReactComponent as GoFilledIcon } from '@okampus/assets/svg/icons/material/filled/go.svg';

import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import { AvatarImage, BannerImage } from '@okampus/ui/atoms';
import { getAvatar, getBanner } from '@okampus/ui/utils';

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import type { TeamBaseInfo } from '@okampus/shared/graphql';

type TeamCardProps = {
  team: TeamBaseInfo;
  link: string;
};

export function TeamListCard({ team, link }: TeamCardProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      className="rounded-xl bg-1 bg-2-hover relative cursor-pointer overflow-hidden"
    >
      <Link to={link} className="card-link" />
      <motion.i
        variants={{ rest: { y: '0rem', opacity: 0 }, hover: { y: '-0.5rem', opacity: 1 } }}
        transition={{ type: 'spring', bounce: 0 }}
        className="w-14 h-14 rounded-full absolute z-20 top-[1.5rem] right-[1rem] p-3 text-white bg-primary shadow-lg"
      >
        <GoFilledIcon />
      </motion.i>
      <div className="relative mb-8">
        <BannerImage
          aspectRatio={BANNER_ASPECT_RATIO}
          src={getBanner(team.actor?.actorImages)}
          name={team.actor?.name}
        />
        <div className="absolute -bottom-4 left-6 rounded-xl bg-0 p-1">
          <AvatarImage name={team.actor?.name} src={getAvatar(team.actor?.actorImages)} size={20} type="team" />
        </div>
      </div>
      <div className="flex flex-col gap-3 px-5 mb-5">
        <div className="leading-tight">
          <div className="subtitle">{team.actor?.name}</div>
          <div className="text-primary font-medium">{team.teamMembersAggregate.aggregate?.count} membres</div>
        </div>
        <div className="text-2 h-18 line-clamp-3">{team.actor?.bio}</div>
      </div>
    </motion.div>
  );
}
