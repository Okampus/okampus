'use client';

import AvatarImage from '../../atoms/Image/AvatarImage';
import ILinkList from '../../atoms/Inline/ILinkList';
import BoxItem from '../../atoms/Item/ChoiceItem';

import { SealCheck, Ticket } from '@phosphor-icons/react';
import Link from 'next/link';

import type { TeamListDetails } from '../../../../types/prisma/Team/team-list-details';

type TeamCardProps = { team: TeamListDetails };
export default function TeamCard({ team }: TeamCardProps) {
  const subtitle = team.parent ? (
    <div className="flex gap-1">
      Club de
      <Link href={`/team/${team.parent.slug}`} className="hover:underline">
        {team.parent.actor.name}
      </Link>
    </div>
  ) : (
    <ILinkList links={team.actor.actorTags.map(({ tag }) => ({ href: `/teams/${tag.slug}`, label: tag.name }))} />
  );

  return (
    <div className="card bg-[var(--bg-main)] justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex items-center gap-3 w-full">
            <Link href={`/team/${team.slug}`} className="hover:underline">
              <AvatarImage actor={team.actor} size={56} />
            </Link>
            <div className="flex flex-col w-full">
              <Link href={`/team/${team.slug}`} className="hover:underline text-1 text-lg font-medium line-clamp-1">
                {team.actor.name}
              </Link>
              <div className="text-2 text-sm font-thin">{subtitle}</div>
            </div>
          </div>
          <div>{/* TODO: ellipsis button */}</div>
        </div>
        <div className="text-2">{team.actor.status}</div>
      </div>
      <div className="flex flex-col gap-4">
        {/* Button 1: Roles, Missions or Suggestions */}
        <BoxItem action={`/team/${team.slug}/jobs`}>
          <div className="flex items-center gap-3">
            <SealCheck size={32} />
            <div className="font-medium">{team._count.missions} rôles à pourvoir</div>
          </div>
        </BoxItem>
        {/* Button 2: Next event, All events OR events */}
        <BoxItem action={`/team/${team.slug}/events`}>
          <div className="flex items-center gap-3">
            <Ticket size={32} />
            <div className="font-medium">{team._count.eventOrganizes} événements à venir</div>
          </div>
        </BoxItem>
      </div>
    </div>
    // <div className="overflow-hidden">
    //   <motion.div initial="rest" whileHover="hover" className="relative cursor-pointer">
    //     <Link href={`/team/${team.slug}`} className="card-link" />
    //     <motion.i
    //       variants={{ rest: { y: '0rem', opacity: 0 }, hover: { y: '-0.5rem', opacity: 1 } }}
    //       transition={{ type: 'spring', bounce: 0 }}
    //       className="absolute z-20 top-[1rem] right-[0.5rem] p-3 text-white"
    //     >
    //       <ArrowUpRight className="h-8 w-8" />
    //     </motion.i>
    //     <div className="relative mb-4">
    //       <BannerImage
    //         className="rounded-md"
    //         aspectRatio={BANNER_ASPECT_RATIO}
    //         src={team.actor.banner}
    //         name={team.actor.name}
    //       />
    //     </div>
    //     <div className="flex flex-col gap-2 px-2 mb-3">
    //       <div className={clsx('flex gap-3', team.actor.name.length > 20 ? 'items-start' : 'items-center')}>
    //         <AvatarImage actor={team.actor} size={32} />
    //         <div className="flex flex-wrap gap-x-3">
    //           <span className="leading-5 text-lg font-medium text-0">{team.actor.name}</span>
    //           <span className="leading-5 text-primary font-medium">{team._count.teamMembers} membres</span>
    //         </div>
    //       </div>
    //       {/* <div className="flex flex-wrap gap-2">
    //         {team.actor.actorTags.map(({ tag }, idx) => (
    //           <span key={idx} className="text-primary font-medium">
    //             #{tag.name}
    //           </span>
    //         ))}
    //       </div> */}
    //       <div className="px-0.5 text-2 h-18 line-clamp-2 text-base text-1 font-medium">{team.actor.status}</div>
    //     </div>
    //   </motion.div>
    //   <div className="mb-4 px-2 mt-1 flex justify-between gap-3">
    //     {/* <div className="flex items-center gap-2">
    //       {team.actor.socials.map((social) => (
    //         <a
    //           key={social.id.toString()}
    //           href={social.url}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className="text-1"
    //         >
    //           <SocialIcon social={social.type} small={true} />
    //         </a>
    //       ))}
    //     </div> */}
    //     <FollowButton actorId={team.actor.id} small={true} />
    //   </div>
    // </div>
  );
}
