import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { ReactComponent as GoOutlinedIcon } from '@okampus/assets/svg/icons/outlined/go.svg';

import { AVATAR_TEAM_ROUNDED } from '@okampus/shared/consts';
import { Avatar, Banner } from '@okampus/ui/atoms';
import { getAvatar, getBanner } from '@okampus/ui/utils';

import type { TeamInfoFragment } from '@okampus/shared/graphql';

type TeamCardProps = {
  team: TeamInfoFragment;
  link: string;
};

export function TeamListCard({ team, link }: TeamCardProps) {
  const tags = team.actor?.tags;
  return (
    <motion.div initial="rest" whileHover="hover" className="relative cursor-pointer rounded-2xl overflow-hidden">
      <Link to={link} className="card-link" />
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b via-[#00000033] from-transparent to-[#000000aa]"></div>
        <Banner src={getBanner(team.actor?.actorImages)} name={team.actor?.name} className="aspect-card" />
        <div className="absolute bottom-[0.75rem] left-[1rem] flex items-center gap-item">
          <Avatar
            name={team.actor?.name}
            src={getAvatar(team.actor?.actorImages)}
            size={20}
            rounded={AVATAR_TEAM_ROUNDED}
          />
          <div>
            <div className="text-xl line-clamp-1 font-title text-white font-bold">{team.actor?.name}</div>
            <div className="text-sm text-gray-300 font-medium font-heading">{team.memberCount} membres</div>
          </div>
        </div>
        <motion.i
          variants={{
            rest: {
              y: '0rem',
              opacity: 0,
            },
            hover: {
              y: '-0.5rem',
              opacity: 1,
            },
          }}
          transition={{ type: 'spring', bounce: 0 }}
          className="w-12 h-12 rounded-full absolute bottom-[0.5rem] right-[1rem] p-2 text-white bg-purple-700"
        >
          <GoOutlinedIcon />
        </motion.i>
      </div>
      {/* <div className="relative flex flex-col gap-4 rounded-lg z-10 text-0">
        <div className="flex flex-col gap-1.5 pt-3">
          <div className="font-semibold tracking-tight text-lg line-clamp-1 font-heading">{team.actor?.name}</div>
          <AvatarGroupUser users={users} size={13} limit={6} />
        </div>
        <div className="text-2 text-sm">{team.tagline}</div>
      </div>
      {tags?.length && tags?.length > 0 ? (
        <div className="flex gap-1.5 flex-wrap mt-2">
          <TagGroup
            tags={tags.map((tag) => ({ label: tag.name, backgroundColor: COLORS[tag.color], slug: tag.slug }))}
          />
        </div>
      ) : null} */}
    </motion.div>
  );
}
