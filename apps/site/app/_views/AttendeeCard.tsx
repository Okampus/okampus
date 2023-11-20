import TextBadge from '../_components/atoms/Badge/TextBadge';
import AvatarImage from '../_components/atoms/Image/AvatarImage';
import type { UserMinimal } from '../../types/prisma/User/user-minimal';

export type AttendeeCardProps = {
  title: string;
  isOrganizer?: boolean;
  user: UserMinimal;
};

export default function AttendeeCard({ title, isOrganizer = false, user }: AttendeeCardProps) {
  return (
    <div className="rounded-xl flex flex-col items-center pt-6 pb-8 border-2 border-[var(--border-1)] px-4">
      <div className="absolute top-0 -translate-y-1/2 right-2">
        {isOrganizer && <TextBadge>Organisateur</TextBadge>}
      </div>
      <AvatarImage size={48} actor={user.actor} />
      <div className="font-medium text-1 line-clamp-1 mt-2">{user.firstName}</div>
      <p className="text-2 text-sm mt-2">{title}</p>
    </div>
  );
}
