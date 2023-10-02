'use client';

import FollowButton from '../../../_components/molecules/Button/FollowButton';
import SocialIcon from '../../../_components/atoms/Icon/SocialIcon';
import AvatarImage from '../../../_components/atoms/Image/AvatarImage';
import ViewLayout from '../../../_components/atoms/Layout/ViewLayout';

import { useTenant } from '../../../_context/navigation';

export default function TenantPage() {
  const { tenant } = useTenant();

  return (
    <ViewLayout>
      <div className="flex lg-max:flex-col gap-8 lg:items-center lg:gap-24">
        <div className="shrink-0 flex flex-col">
          <div className="text-2xl font-bold text-0 mb-6 flex items-center gap-8">
            <AvatarImage size={64} actor={tenant.actor} type="team" />
            <div className="flex flex-col gap-2">
              {tenant.actor.name}
              <FollowButton actorId={tenant.actor.id} />
            </div>
          </div>
          {tenant.actor.socials.length > 0 && (
            <div className="flex flex-wrap gap-3 items-center">
              {tenant.actor.socials.map(
                (social) =>
                  social.url && (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium"
                    >
                      <SocialIcon className="!h-8 !w-8" small={true} key={social.id} social={social.type} />
                    </a>
                  ),
              )}
            </div>
          )}
        </div>
        {/* <div className="w-full flex items-center gap-12">
          <img
            className="w-full aspect-[1.25/1] rounded-lg object-cover"
            src={'https://source.unsplash.com/random/900x900?sig=1'}
          />
          <img
            className="w-full aspect-[1.25/1] rounded-lg object-cover"
            src={'https://source.unsplash.com/random/900x900?sig=2'}
          />
          <img
            className="w-full aspect-[1.25/1] rounded-lg object-cover"
            src={'https://source.unsplash.com/random/900x900?sig=3'}
          />
        </div> */}
      </div>
      {/* <GroupItem heading="Description" groupClassName="text-justify font-medium whitespace-pre-line" className="mt-6">
        {team?.tenant.actor.bio}
      </GroupItem> */}
      {/* <hr className="border-[var(--border-2)] my-12" />
      {data?.event?.length && (
        <GroupItem
          heading="Les derniers événements"
          groupClassName="mt-2 w-full grid grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-8"
        >
          {data.event?.map((event, i) => (
            <EventCard key={i} event={event} />
          ))}
        </GroupItem>
      )} */}
    </ViewLayout>
  );
}
