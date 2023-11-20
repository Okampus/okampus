import AvatarImage from '../Image/AvatarImage';
import type { ActorWithAvatar } from '../../../../types/prisma/Actor/actor-with-avatar';

export type MissionItemProps = { actor: ActorWithAvatar; name: string };
export default function MissionItem({ actor, name }: MissionItemProps) {
  return (
    <div className="flex items-center gap-3">
      <AvatarImage actor={actor} size={40} />
      <div className="font-semibold text-0">{name}</div>
    </div>
  );
}
