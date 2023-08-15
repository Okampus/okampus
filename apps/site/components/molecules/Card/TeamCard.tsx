'use client';

import SocialIcon from '../../atoms/Icon/SocialIcon';
import BannerImage from '../../atoms/Image/BannerImage';
import AvatarImage from '../../atoms/Image/AvatarImage';

import { notificationAtom } from '../../../context/global';
import { getBanner } from '../../../utils/actor-image/get-banner';

import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import { ToastType } from '@okampus/shared/types';

import { IconArrowUpRight, IconShare2 } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import Link from 'next/link';

import type { SocialType } from '@okampus/shared/enums';
import type { TeamCardInfo } from '../../../types/features/team.info';

type TeamCardProps = { team: TeamCardInfo };
export default function TeamCard({ team }: TeamCardProps) {
  const [, setNotification] = useAtom(notificationAtom);

  return (
    <div className="overflow-hidden">
      <motion.div initial="rest" whileHover="hover" className="relative cursor-pointer">
        <Link href={`/team/${team.actor?.slug}`} className="card-link" />
        <motion.i
          variants={{ rest: { y: '0rem', opacity: 0 }, hover: { y: '-0.5rem', opacity: 1 } }}
          transition={{ type: 'spring', bounce: 0 }}
          className="absolute z-20 top-[1rem] right-[0.5rem] p-3 text-white"
        >
          <IconArrowUpRight className="h-8 w-8" />
        </motion.i>
        <div className="relative mb-4">
          <BannerImage
            className="rounded-2xl"
            aspectRatio={BANNER_ASPECT_RATIO}
            src={getBanner(team.actor?.actorImages)?.image.url}
            name={team.actor?.name}
          />
        </div>
        <div className="flex flex-col gap-2 px-4 mb-3">
          <div className="flex items-center gap-3">
            <AvatarImage actor={team.actor} size={16} type="team" />
            <div className="flex flex-wrap items-center gap-x-3">
              <span className="leading-5 text-lg font-semibold text-0">{team.actor?.name}</span>
              <span className="leading-5 text-primary font-semibold">
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
          <div className="px-0.5 text-2 h-18 line-clamp-2 text-sm text-1 font-medium">{team.actor?.status}</div>
        </div>
      </motion.div>
      <div className="mb-4 px-4 mt-1 flex justify-between">
        <div className="flex items-center gap-2">
          {team.actor?.socials.map((social, idx) => (
            <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className="text-1">
              <SocialIcon social={social.type as SocialType} small={true} />
            </a>
          ))}
        </div>
        <IconShare2
          className="text-2 cursor-pointer h-7 w-7"
          onClick={() => {
            navigator.clipboard.writeText(`${window.location.origin}/team/${team.actor?.slug}`);
            setNotification({ type: ToastType.Info, message: "Lien de l'équipe copié !" });
          }}
        />
      </div>
    </div>
  );
}
