import AvatarImage from '../../atoms/Image/AvatarImage';
import BannerImage from '../../atoms/Image/BannerImage';
import { getAvatarRounded } from '../../../../utils/avatar/avatar-rounded';

import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';
import Link from 'next/link';

import type { ActorType } from '@prisma/client';

export type PopoverCardProps = {
  type?: ActorType;
  avatar?: string | null;
  banner?: string | null;
  className?: string;
  avatarClassName?: string;
  link: string;
  name?: string;
  children: React.ReactNode;
};

export default function PopoverCard({
  avatar,
  type,
  banner,
  className,
  avatarClassName,
  link,
  name,
  children,
}: PopoverCardProps) {
  const rounded = getAvatarRounded(type);

  return (
    <div className={clsx(className, 'flex flex-col w-full md:w-[22rem] rounded-t-2xl md:rounded-2xl overflow-hidden')}>
      <BannerImage src={banner} name={name} className={banner ? 'h-fit' : 'h-16'} />
      <div className="text-0 p-6 relative">
        <div
          className={clsx(avatarClassName, 'absolute -translate-y-[50%] border border-[var(--bg-0)] overflow-hidden')}
          style={{ borderRadius: `${rounded ? rounded * 1.1 : 0}%` }}
        >
          <AvatarImage src={avatar} name={name} size={76} />
          <Link
            href={link}
            className="absolute -inset-px opacity-0 hover:opacity-100 outline outline-black outline-1 z-20 cursor-pointer bg-black text-white flex gap-1 items-center justify-center"
          >
            <div className="font-semibold font-title">Profil</div>
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="card-md mt-14">
          <div className="text-xl font-bold font-title mb-3">{name}</div>
          {children}
        </div>
      </div>
    </div>
  );
}
