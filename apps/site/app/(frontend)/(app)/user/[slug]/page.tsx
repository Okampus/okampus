'use client';

import ViewLayout from '../../../../../components/atoms/Layout/ViewLayout';
import SocialIcon from '../../../../../components/atoms/Icon/SocialIcon';
import AvatarImage from '../../../../../components/atoms/Image/AvatarImage';

import { useUser } from '../../../../../context/navigation';

import type { SocialType } from '@okampus/shared/enums';

export default function UserPage({ params }: { params: { slug: string } }) {
  const { user } = useUser(params.slug);
  if (!user) return null;

  return (
    <ViewLayout
      innerClassName="relative"
      headerPrefix={<AvatarImage size={16} actor={user.individual.actor} type="user" />}
      headerPrefixSmall={<AvatarImage size={12} actor={user.individual.actor} type="user" />}
      header={user.individual.actor.name}
    >
      <div className="shrink-0 flex flex-col">
        {user.individual?.actor.socials.length > 0 && (
          <div className="flex flex-wrap gap-3 items-center">
            {user.individual?.actor.socials.map(
              (social) =>
                social.url && (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium"
                  >
                    <SocialIcon className="!h-8 !w-8" small={true} key={social.id} social={social.type as SocialType} />
                  </a>
                ),
            )}
          </div>
        )}
      </div>
    </ViewLayout>
  );
}
