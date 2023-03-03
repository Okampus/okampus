import { Avatar, Banner, GradientDark, GradientTransparent } from '@okampus/ui/atoms';
import { AvatarEditor } from '@okampus/ui/molecules';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

import type { AvatarProps, BannerProps } from '@okampus/ui/atoms';

export type ProfileBaseProps = {
  color: string;
  avatar?: AvatarProps;
  avatarEdit?: (file: File | null) => void;
  banner?: BannerProps;
  type: string;
  name: string;
  details?: React.ReactNode;
  children: React.ReactNode;
};

export function ProfileBase({ color, avatar, avatarEdit, banner, type, name, details, children }: ProfileBaseProps) {
  const { className, ...avatarProps } = avatar || {};
  return (
    <motion.div className="flex flex-col" animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
      <div className="p-view flex gap-8 items-end relative">
        <GradientDark className="absolute inset-0 overflow-hidden">
          <Banner {...banner} name={name} />
        </GradientDark>
        {avatarEdit ? (
          <AvatarEditor avatar={{ ...avatarProps, size: 82, rounded: 8, name }} onChange={avatarEdit} />
        ) : (
          <Avatar {...avatarProps} name={name} size={82} rounded={8} className={clsx(className, 'z-10')} />
        )}
        <div className="text-white z-10 py-3">
          <div className="font-semibold tracking-wider opacity-95">{type}</div>
          <div className="text-8xl font-title leading-tight font-bold tracking-tighter line-clamp-1 pr-1">{name}</div>
          {details}
        </div>
      </div>
      <div className="relative">
        <GradientTransparent className="absolute top-0 left-0 w-full h-72">
          <div className="absolute inset-0" style={{ backgroundColor: color }} />
        </GradientTransparent>
        <div className="absolute z-10 p-view-inner w-full">{children}</div>
      </div>
    </motion.div>
  );
}
