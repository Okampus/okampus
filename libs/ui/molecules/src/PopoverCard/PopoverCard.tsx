import { AvatarImage, BannerImage } from '@okampus/ui/atoms';
import { clsx } from 'clsx';
import { ReactComponent as GoIcon } from '@okampus/assets/svg/icons/material/filled/go.svg';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import type { AvatarImageProps, BannerImageProps } from '@okampus/ui/atoms';

export type PopoverCardProps = {
  avatar: Partial<AvatarImageProps> & { rounded: number };
  banner?: BannerImageProps;
  className?: string;
  link: string;
  name?: string;
  children: React.ReactNode;
};

export function PopoverCard({ avatar, banner, className, link, name, children }: PopoverCardProps) {
  const navigate = useNavigate();
  return (
    <div className={clsx(className, 'flex flex-col w-popover-card rounded-2xl overflow-hidden')}>
      <BannerImage {...banner} name={name} className={banner?.src ? 'h-fit' : 'h-16'} />
      <div className="text-0 p-4 relative bg-1">
        <div
          className={clsx(avatar?.className, 'absolute -translate-y-[50%] border-4 border-[var(--bg-0)]')}
          style={{ borderRadius: `${avatar.rounded + 5}%` }}
        >
          <AvatarImage {...avatar} name={name} size={34} />
          <motion.div
            onClick={() => navigate(link)}
            className="absolute -inset-px outline outline-black outline-1 z-20 cursor-pointer bg-black text-white flex gap-1 items-center justify-center"
            style={{ borderRadius: `${avatar.rounded}%` }}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.8 }}
            transition={{ duration: 0.1 }}
          >
            <div className="font-semibold font-title">Profil</div>
            <GoIcon className="w-5 h-5" />
          </motion.div>
        </div>
        <div className="card-md mt-14 bg-0">
          <div className="text-xl font-medium font-title">{name}</div>
          <hr className="my-2 border-color-3" />
          {children}
        </div>
      </div>
    </div>
  );
}
