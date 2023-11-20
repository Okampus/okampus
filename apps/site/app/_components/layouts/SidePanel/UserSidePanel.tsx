'use client';

import Sidepanel from '../Sidepanel';
import BannerImage from '../../atoms/Image/BannerImage';
import AvatarImage from '../../atoms/Image/AvatarImage';

import { useTranslation } from '../../../_hooks/context/useTranslation';
import { UserDetails } from '../../../../types/prisma/User/user-details';

import { ReactComponent as OkampusLogo } from '@okampus/assets/svg/brands/okampus-square.svg';

export type UserSidePanelProps = { user: UserDetails };
export default function UserSidePanel({ user }: UserSidePanelProps) {
  const { format } = useTranslation();

  return (
    <Sidepanel>
      <BannerImage src={user.actor.banner} name={user.actor.name} />
      <div className="text-0 p-4 relative">
        <AvatarImage
          src={user.actor.avatar}
          name={user.actor.name}
          size={80}
          className="absolute -translate-y-[80%] border-4 border-[var(--bg-[var(--bg-main)])]"
        />
        <div className="rounded-xl bg-main mt-8 p-3">
          <div className="text-xl font-semibold font-title">{user.actor.name}</div>
          <div className="mb-3 text-1 text-sm">
            {user.firstName} {user.lastName}
          </div>
          {user.actor?.bio && <div className="text-2">{user.actor.bio}</div>}
          <hr className="my-3 border-[var(--border-3)]" />
          {/*           < heading="Actif depuis"> */}
          <div className="flex items-center gap-1.5">
            <OkampusLogo className="h-5 w-5" />
            <div className="font-medium text-sm capitalize">{format('weekDay', new Date(user.createdAt))}</div>
          </div>
          {/*           </> */}
        </div>
      </div>
    </Sidepanel>
  );
}
