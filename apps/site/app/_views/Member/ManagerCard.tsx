import AvatarImage from '../../_components/atoms/Image/AvatarImage';
import HiringAvatar from '../../_components/atoms/Image/HiringAvatar';
import Link from 'next/link';

import { ActorType } from '@prisma/client';
import { EnvelopeSimple, User } from '@phosphor-icons/react/dist/ssr';

import type { UserMinimal } from '../../../types/prisma/User/user-minimal';
import type { LinkActionProps } from '@okampus/shared/types';

export type ManagerCardProps = {
  title: string;
  data?: UserMinimal | string | { email: string; label?: string } | LinkActionProps;
  avatarName?: boolean;
};
const linkClassName = 'font-medium pt-2 text-0 line-clamp-1 card-link';

export default function ManagerCard({ title, data, avatarName = true }: ManagerCardProps) {
  let link = <div className={linkClassName}>On recrute !</div>;
  let avatar = <HiringAvatar size={64} />;
  let email;
  let profile;

  if (typeof data === 'object') {
    if ('email' in data) {
      avatar = <AvatarImage size={64} name={data.email} type={ActorType.User} />;
      link = <div className={linkClassName}>{data.label ?? data.email}</div>;
      email = data.email;
    } else if ('href' in data) {
      if (avatarName) avatar = <AvatarImage size={64} name={data.label} type={ActorType.User} />;
      link = (
        <Link {...data} className={linkClassName}>
          {data.label}
        </Link>
      );
    } else {
      if (avatarName) avatar = <AvatarImage size={64} actor={data.actor} />;
      link = (
        <Link href={`/user/${data.slug}`} className={linkClassName}>
          {data.actor.name}
        </Link>
      );
      email = data.actor.email;
      profile = `/user/${data.slug}`;
    }
  } else {
    if (avatarName) avatar = <AvatarImage size={48} name={data} type={ActorType.User} />;
    link = <div className={linkClassName}>{data}</div>;
  }

  return (
    <div className="border border-[var(--border-1)] rounded-lg">
      <div className="relative flex flex-col items-center p-5">
        {avatar}
        {link}
        <p className="text-2 pt-0.5">{title}</p>
      </div>
      {email && profile && (
        <div className="grid grid-cols-2 border-t border-[var(--border-1)] text-0 font-semibold">
          <Link
            href={`mailto:${email}`}
            className="flex justify-center items-center gap-3 py-3 px-2 border-r border-[var(--border-1)] hover:bg-[var(--bg-1)]"
          >
            <EnvelopeSimple className="w-6 h-6" />
            Email
          </Link>
          <Link href={profile} className="flex justify-center items-center gap-3 py-3 px-2 hover:bg-[var(--bg-1)]">
            <User className="w-6 h-6" />
            Profil
          </Link>
        </div>
      )}
    </div>
  );
}
