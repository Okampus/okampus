import HiringAvatar from '../_components/atoms/Image/HiringAvatar';
import AvatarStack from '../_components/molecules/Stack/AvatarStack';

import Link from 'next/link';
import type { TeamMemberMinimal } from '../../types/prisma/TeamMember/team-member-minimal';

// TODO: add special tag if pole is recruiting
export type PoleCardProps = {
  name: string;
  href: string;
  managers: TeamMemberMinimal[];
  members: TeamMemberMinimal[];
  memberCount: number;
  isRecruiting?: boolean;
};

export default function PoleCard({ name, href, isRecruiting, managers, members, memberCount }: PoleCardProps) {
  // let managerRender: React.ReactNode;
  // let managerSubtitle: React.ReactNode;
  // if (managers.length > 0) {
  //   managerRender = <AvatarStack actors={managers.map((member) => member.user.actor)} size={48} limit={3} />;
  //   managerSubtitle = (
  //     <ILinkList
  //       className="line-clamp-1"
  //       prefix="Géré par"
  //       links={managers.map((member) => ({ href: `/user/${member.user.slug}`, label: member.user.actor.name }))}
  //     />
  //   );
  // } else {
  //   managerRender = <HiringAvatar />;
  //   managerSubtitle = <div className=inline text-[var(--text-2)]">Responsable recherché !</div>;
  // }

  return (
    <div className="p-4 rounded-xl bg-[var(--bg-1)] relative">
      {memberCount === 0 ? (
        <HiringAvatar size={42} />
      ) : (
        <AvatarStack actors={members.map((member) => member.user.actor)} itemsCount={memberCount} size={42} />
      )}
      <Link href={href} className="text-0 text-lg font-semibold mt-2 line-clamp-1 card-link">
        {name}
      </Link>
      <div className="inline text-[var(--text-2)] text-sm">
        {memberCount} membres{' '}
        {isRecruiting ||
          (managers.length === 0 && <div className="text-0 inline-flex ml-3 font-medium">On recrute !</div>)}
      </div>
    </div>
  );
}
