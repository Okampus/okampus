import BaseView from '../../../../../_components/templates/BaseView';
import SocialIcon from '../../../../../_components/atoms/Icon/SocialIcon';
import AvatarImage from '../../../../../_components/atoms/Image/AvatarImage';
import prisma from '../../../../../../database/prisma/db';
import UserSideBar from '../../../../../_views/User/UserSideBar';

import { userDetails } from '../../../../../../types/prisma/User/user-details';
import { notFound } from 'next/navigation';

import type { DomainSlugParams } from '../../../../../params.type';

export default async function UserPage({ params }: DomainSlugParams) {
  const user = await prisma.user.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: userDetails.select,
  });

  if (!user) notFound();
  // TODO: "colleagues"
  const header = (
    <div className="flex items-center gap-4">
      <AvatarImage size={32} actor={user.actor} />
      {user.actor.name}
    </div>
  );

  const headerSmall = (
    <div className="flex items-center gap-4">
      <AvatarImage size={64} actor={user.actor} />
      {user.actor.name}
    </div>
  );

  return (
    <>
      <UserSideBar user={user} />
      <BaseView innerClassName="relative" header={header} headerSmall={headerSmall}>
        <div className="shrink-0 flex flex-col">
          {user.actor.socials.length > 0 && (
            <div className="flex flex-wrap gap-3 items-center">
              {user.actor.socials.map(
                (social) =>
                  social.url && (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium"
                    >
                      <SocialIcon className="!h-8 !w-8" key={social.id} social={social.type} />
                    </a>
                  ),
              )}
            </div>
          )}
        </div>
      </BaseView>
    </>
  );
}
