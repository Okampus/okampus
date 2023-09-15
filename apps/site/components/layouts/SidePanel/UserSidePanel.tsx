'use client';

import SidePanel from '../SidePanel';
import BannerImage from '../../atoms/Image/BannerImage';
import AvatarImage from '../../atoms/Image/AvatarImage';
import SimpleList from '../../molecules/List/SimpleList';

import { useTranslation } from '../../../hooks/context/useTranslation';

import { ReactComponent as OkampusLogo } from '@okampus/assets/svg/brands/okampus.svg';

import type { UserBaseInfo } from '../../../types/features/user.info';

export type UserSidePanelProps = { user: UserBaseInfo };
export default function UserSidePanel({ user }: UserSidePanelProps) {
  const { format } = useTranslation();

  return (
    <SidePanel>
      <BannerImage src={user.actor.banner} name={user.actor.name} />
      <div className="text-0 p-4 relative">
        <AvatarImage
          src={user.actor.avatar}
          name={user.actor.name}
          size={80}
          className="absolute -translate-y-[80%] border-4 border-[var(--bg-0)]"
          type="user"
        />
        <div className="rounded-xl bg-main mt-8 p-3">
          <div className="text-xl font-semibold font-title">{user.actor.name}</div>
          <div className="mb-3 text-1 text-sm">
            {user.firstName} {user.lastName}
          </div>
          {user.actor?.bio && <div className="text-2">{user.actor.bio}</div>}
          <hr className="my-3 border-color-3" />
          <SimpleList heading="Actif depuis">
            <div className="flex items-center gap-1.5">
              <OkampusLogo className="h-5 w-5" />
              <div className="font-medium text-sm capitalize">{format('weekDay', new Date(user.createdAt))}</div>
            </div>
          </SimpleList>
        </div>
      </div>
    </SidePanel>
  );
}
