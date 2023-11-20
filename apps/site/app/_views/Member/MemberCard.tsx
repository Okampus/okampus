import AvatarImage from '../../_components/atoms/Image/AvatarImage';
import HiringAvatar from '../../_components/atoms/Image/HiringAvatar';

import { ActorType } from '@prisma/client';

import Link from 'next/link';

import type { LinkActionProps } from '@okampus/shared/types';
import type { UserMinimal } from '../../../types/prisma/User/user-minimal';

export type MemberCardProps = {
  title: string;
  data?: UserMinimal | string | { email: string; label?: string } | LinkActionProps;
  avatarName?: boolean;
};

const avatarClassName = 'absolute transform -translate-y-1/2 -top-2';
const linkClassName = 'font-medium text-1 line-clamp-1 card-link';

export default function MemberCard({ title, data, avatarName = true }: MemberCardProps) {
  let link = <div className={linkClassName}>On recrute !</div>;
  let avatar = <HiringAvatar size={48} />;
  if (typeof data === 'object') {
    if ('email' in data) {
      avatar = <AvatarImage size={48} className={avatarClassName} name={data.email} type={ActorType.User} />;
      link = <div className={linkClassName}>{data.label ?? data.email}</div>;
    } else if ('href' in data) {
      if (avatarName)
        avatar = <AvatarImage size={48} className={avatarClassName} name={data.label} type={ActorType.User} />;
      link = (
        <Link {...data} className={linkClassName}>
          {data.label}
        </Link>
      );
    } else {
      if (avatarName) avatar = <AvatarImage size={48} className={avatarClassName} actor={data.actor} />;
      link = (
        <Link href={`/user/${data.slug}`} className={linkClassName}>
          {data.actor.name}
        </Link>
      );
    }
  } else {
    if (avatarName) avatar = <AvatarImage size={48} className={avatarClassName} name={data} type={ActorType.User} />;
    link = <div className={linkClassName}>{data}</div>;
  }

  return (
    <div className="relative rounded-xl mt-6 flex flex-col w-56 justify-center items-center h-24 border border-[var(--border-1)] bg-[var(--bg-main)]">
      {avatar}
      {link}
      <p className="text-2 text-sm">{title}</p>
    </div>
  );
}
