import SocialIcon from '../../atoms/Icon/SocialIcon';
import AvatarImage from '../../atoms/Image/AvatarImage';

import { IconMail, IconWorldWww } from '@tabler/icons-react';
import Link from 'next/link';

import type { SocialInfo } from '../../molecules/Card/EditSocialCard';
import type { SocialType } from '@okampus/shared/enums';
import type { ActorBaseInfo } from '@okampus/shared/graphql';

export type ProfileProps = {
  type?: 'user' | 'team' | 'tenant';
  actor?: ActorBaseInfo;
  socials: SocialInfo[];
};
export default function Profile({ type, actor, socials }: ProfileProps) {
  return (
    <div className="pt-[var(--py-content)] flex flex-col">
      <div className="flex flex-col items-center gap-4 mb-4">
        <AvatarImage actor={actor} className="mx-auto border-4 border-[var(--border-light)]" type={type} size={40} />
        <div className="text-xl font-bold text-0 text-center">{actor?.name}</div>
      </div>
      {socials.length > 0 && (
        <div className="w-full flex gap-2.5 justify-center items-center bg-[var(--primary)] py-2 px-4">
          {socials
            ?.sort((a, b) => a.order - b.order)
            .map((social, idx) => (
              <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8">
                <SocialIcon social={social.type as SocialType} small={true} className="text-white" />
              </a>
            ))}
          {actor?.email && (
            <>
              {socials.length > 0 && <div className="w-[2px] h-6 bg-gray-100 rounded-md" />}
              <Link href={`mailto:${actor.email}`} className="w-8 h-8">
                <IconMail className="text-white w-full h-full" />
              </Link>
            </>
          )}
          {actor?.website && (
            <>
              {actor?.email || (socials.length > 0 && <div className="w-[2px] h-6 bg-gray-100 rounded-md" />)}
              <a href={actor.website} target="_blank" rel="noopener noreferrer" className="w-8 h-8">
                <IconWorldWww className="text-white w-full h-full" />
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
