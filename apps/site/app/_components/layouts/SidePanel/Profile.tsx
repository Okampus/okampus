'use client';

import SocialIcon from '../../atoms/Icon/SocialIcon';
import AvatarImage from '../../atoms/Image/AvatarImage';

import { EnvelopeSimple, Globe } from '@phosphor-icons/react/dist/ssr';

import Link from 'next/link';

import type { SocialMinimal } from '../../../../types/prisma/Social/social-minimal';
import type { ActorWithSocials } from '../../../../types/prisma/Actor/actor-with-socials';

export type ProfileProps = {
  actor: ActorWithSocials;
  socials: SocialMinimal[];
};
export default function Profile({ actor, socials }: ProfileProps) {
  return (
    <div className="pt-[var(--py-content)] flex flex-col border-b border-[var(--border-1)]">
      <div className="flex flex-col items-center gap-4 mb-4">
        <AvatarImage actor={actor} className="mx-auto border-[var(--border-1)]" size={80} />
        <div className="text-xl font-bold text-0 text-center">{actor?.name}</div>
      </div>
      {(socials.length > 0 || actor.email) && (
        <div className="w-full flex gap-2.5 justify-center items-center pb-4 px-4 border-[var(--border-1)]">
          {[...socials]
            ?.sort((a, b) => a.order - b.order)
            .map((social) => (
              <a key={social.type} target="_blank" rel="noopener noreferrer" className="w-8 h-8">
                <SocialIcon social={social.type} className="text-0" />
              </a>
            ))}
          {actor.email && (
            <>
              {socials.length > 0 && <div className="w-[2px] h-6 bg-[var(--border-[var(--border-1)])] rounded-md" />}
              <Link href={`mailto:${actor.email}`} className="w-8 h-8">
                <EnvelopeSimple className="text-0 w-full h-full" />
              </Link>
            </>
          )}
          {actor?.website && (
            <>
              {actor.email ||
                (socials.length > 0 && <div className="w-[2px] h-6 bg-[var(--border-[var(--border-1)])] rounded-md" />)}
              <a href={actor.website} target="_blank" rel="noopener noreferrer" className="w-8 h-8">
                <Globe className="text-0 w-full h-full" />
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
