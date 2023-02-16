import { AvatarGroup } from '../Group/AvatarGroup';

import { TagGroup } from '../Group/TagGroup';
import { Avatar } from '@okampus/ui/atoms';
import { actorImageBareFragment, ActorImageType, getFragmentData } from '@okampus/shared/graphql';
import { ReactComponent as ArrowRightIcon } from '@okampus/assets/svg/icons/arrow-right-alt.svg';

import { Link } from 'react-router-dom';

import { COLORS } from '@okampus/shared/consts';
import { motion } from 'framer-motion';

import type { UserItem } from '../Group/AvatarGroup';
import type { TeamMembersInfoFragment } from '@okampus/shared/graphql';

type TeamCardProps = {
  team: TeamMembersInfoFragment;
  link: string;
};

export function TeamCard({ team, link }: TeamCardProps) {
  const avatar = team.actor?.actorImages
    ?.map((actorImage) => getFragmentData(actorImageBareFragment, actorImage))
    .find((image) => image.type === ActorImageType.Avatar)?.image?.url;

  const users: UserItem[] = team.members
    .filter((member) => member.user && member.user.actor && member.user.actor.id)
    .map((member) => {
      const user = member.user as typeof member.user & { id: string; actor: { name: string } };
      return {
        id: user.id,
        name: user.actor.name,
        src: user.actor.actorImages
          .map((actorImage) => getFragmentData(actorImageBareFragment, actorImage))
          .find((image) => image.type === ActorImageType.Avatar)?.image?.url,
      };
    });

  const tags = team.actor?.tags;
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      className="card-sm relative bg-2 cursor-pointer hover:bg-gray-600 dark:hover:bg-gray-600"
    >
      <Link to={link} className="card-link" />
      <div className="relative">
        <img
          src="https://cdn.dribbble.com/users/1343667/screenshots/14899708/media/137661847b31e4430435573a33a36c97.png?compress=1&resize=1000x750&vertical=top"
          alt=""
          className="rounded-xl w-full aspect-[16/10] object-cover"
        />
        <Avatar name={team.actor?.name} src={avatar} className="absolute bottom-[0.5rem] left-[0.5rem]" size={18} />
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
          className="w-12 h-12 rounded-full absolute bottom-0 right-[0.5rem] p-2 text-white bg-purple-700"
        >
          <ArrowRightIcon />
        </motion.i>
      </div>
      <div className="relative flex flex-col gap-4 rounded-lg z-10 text-0">
        <div className="flex flex-col gap-1.5 pt-3">
          <div className="font-semibold tracking-tight text-lg line-clamp-1 font-heading">{team.actor?.name}</div>
          <AvatarGroup users={users} size={13} limit={6} />
        </div>
        <div className="text-2 text-sm">{team.tagline}</div>
      </div>
      {tags?.length && tags?.length > 0 ? (
        <div className="flex gap-1.5 flex-wrap mt-2">
          <TagGroup
            tags={tags.map((tag) => ({ label: tag.name, backgroundColor: COLORS[tag.color], slug: tag.slug }))}
          />
        </div>
      ) : null}
    </motion.div>
    // <div className="relative rounded-xl bg-2 overflow-hidden">
    //   <div className="absolute h-[3.5rem] inset-x-0 z-0 bg-green-400 card">
    //     <img
    //       src="https://cdn.dribbble.com/users/1343667/screenshots/14899708/media/137661847b31e4430435573a33a36c97.png?compress=1&resize=1000x750&vertical=top"
    //       alt=""
    //     />
    //   </div>
    //   <div className="h-full relative flex flex-col gap-2 mt-[3rem] rounded-lg z-10 bg-white px-[0.75rem] pb-[0.5rem] pt-[2rem] bg-2 text-0">
    //     <Avatar name={team.actor?.name} src={avatar} className="absolute top-0 translate-y-[-50%]" size={20} />
    //     <div className="flex flex-col gap-1">
    //       <div className="font-medium tracking-tight text-lg">{team.actor?.name}</div>
    //       <AvatarGroup users={users} size={11} limit={6} />
    //     </div>
    //     <div className="text-2">{team.tagline}</div>
    //   </div>
    // </div>
  );
}
