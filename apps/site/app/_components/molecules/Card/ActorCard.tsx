import AvatarLabeled from '../Labeled/AvatarLabeled';
import type { ActorWithAvatar } from '../../../../types/prisma/Actor/actor-with-avatar';

export type ActorCardProps = { actor: ActorWithAvatar; subtitle: string };
export default function ActorCard({ actor, subtitle }: ActorCardProps) {
  return <AvatarLabeled className="bg-[var(--bg-main)] p-3 rounded-xl" actor={actor} content={subtitle} />;
}
