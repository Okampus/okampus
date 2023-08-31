import SocialIcon from '../../atoms/Icon/SocialIcon';
import AvatarImage from '../../atoms/Image/AvatarImage';

import { IconMail, IconWorldWww } from '@tabler/icons-react';
import Link from 'next/link';

import type { ActorBaseInfo } from '../../../types/features/actor.info';

export type ProfileProps = {
  type?: 'user' | 'team' | 'none';
  actor?: ActorBaseInfo;
  socials: { type: string; url: string; pseudo: string; order: number }[];
};
export default function Profile({ type, actor, socials }: ProfileProps) {
  return (
    <div className="pt-[var(--py-content)] flex flex-col">
      <div className="flex flex-col items-center gap-4 mb-4">
        <AvatarImage actor={actor} className="mx-auto border-4 border-[var(--border-light)]" type={type} size={40} />
        <div className="text-xl font-bold text-0 text-center">{actor?.name}</div>
      </div>
      {(socials.length > 0 || actor?.email) && (
        <div className="w-full flex gap-2.5 justify-center items-center pb-4 px-4 border-color-1">
          {[...socials]
            ?.sort((a, b) => a.order - b.order)
            .map((social) => (
              <a key={social.type} target="_blank" rel="noopener noreferrer" className="w-8 h-8">
                <SocialIcon social={social.type} small={true} className="text-0" />
              </a>
            ))}
          {actor?.email && (
            <>
              {socials.length > 0 && <div className="w-[2px] h-6 bg-[var(--border-color-1)] rounded-md" />}
              <Link href={`mailto:${actor.email}`} className="w-8 h-8">
                <IconMail className="text-0 w-full h-full" />
              </Link>
            </>
          )}
          {actor?.website && (
            <>
              {actor?.email ||
                (socials.length > 0 && <div className="w-[2px] h-6 bg-[var(--border-color-1)] rounded-md" />)}
              <a href={actor.website} target="_blank" rel="noopener noreferrer" className="w-8 h-8">
                <IconWorldWww className="text-0 w-full h-full" />
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
