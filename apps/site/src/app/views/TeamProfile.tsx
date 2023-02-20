import { InstagramCard } from '../misc/InstagramCard';
import { YouTubeCard } from '../misc/YouTubeCard';

import { getFragmentData, getTeamDetailsQuery, teamMembersFragment } from '@okampus/shared/graphql';
import { ImageGroup, MemberLabel } from '@okampus/ui/molecules';
import { FactCard, Tag } from '@okampus/ui/atoms';
import { PaginationSwiper } from '@okampus/ui/organisms';
import { COLORS } from '@okampus/shared/consts';

import { getAvatar, getProfileImages } from '@okampus/ui/utils';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

export function TeamProfile() {
  const { clubSlug } = useParams<{ clubSlug: string }>();
  if (!clubSlug) {
    return null;
  }

  return <TeamProfileWrapping clubSlug={clubSlug} />;
}

export function TeamProfileWrapping({ clubSlug }: { clubSlug: string }) {
  const { data } = useQuery(getTeamDetailsQuery, { variables: { slug: clubSlug } });
  const team = getFragmentData(teamMembersFragment, data?.teamBySlug);

  const teamMembers =
    team?.members?.map((member) => {
      return {
        name: member?.user?.firstName,
        role: member?.roles.map((role) => role.name).join(' / '),
        avatar: getAvatar(member?.user?.actor?.actorImages),
      };
    }) ?? [];

  return (
    <div className="view flex flex-col gap-4 centered-container">
      <div className="flex justify-between my-4">
        <div className="text-0 text-4xl font-semibold">{team?.actor?.name}</div>
        <div className="flex gap-4">
          <div className="button text-opposite bg-opposite">Suivre</div>
          <div className="button text-white bg-green-600">Rejoindre</div>
        </div>
      </div>
      <div className="grid grid-cols-8 grid-rows-2 gap-4">
        <ImageGroup images={getProfileImages(team?.actor?.actorImages)} className="col-span-4 row-span-2 max-h-80" />
        <YouTubeCard name={team?.actor?.name} slug={team?.actor?.slug} className="col-span-2 row-span-2" />
        <InstagramCard name={team?.actor?.name} slug={team?.actor?.slug} className="col-span-2" />
        <FactCard title="Membres" information={team?.members?.length} className="bg-purple-600" />
        <FactCard title="Créé en" information={new Date(team?.createdAt).getFullYear()} className="bg-purple-600" />
      </div>
      <div className="grid grid-cols-8 grid-rows-2 gap-4">
        <PaginationSwiper
          className="col-span-4 row-span-2 bg-purple-600 h-fit"
          header={
            <div className="text-white/80 flex gap-1 items-center">
              L'équipe <div className="text-white">({team?.members.length})</div>
            </div>
          }
          items={teamMembers}
          grid={[2, 5]}
          renderItem={MemberLabel}
        />
        <FactCard
          title="Description"
          information={team?.actor?.bio}
          informationClassName="line-clamp-4"
          footer={
            <div className="mt-3">
              <div className="text-white/80 font-medium">Tags</div>
              <div className="flex gap-1 flex-wrap mt-2">
                {team?.actor?.tags.map((tag) => (
                  <Tag label={tag.name} backgroundColor={COLORS[tag.color]} key={tag.id} slug={tag.slug} />
                ))}
              </div>
            </div>
          }
          className="bg-purple-600 col-span-4 row-span-2"
        />
        {/* <div className="col-span-4 row-span-2">
          {teamMembers?.map((member) => {
            return (
              <div className="flex gap-2">
                <img src={member.avatar} alt="" className="w-10 h-10 rounded-full" />
                <p>{member.name}</p>
              </div>
            );
          })}
        </div> */}
        {/* <ImageGroup images={images} className="col-span-4 row-span-2 max-h-64" />
        <FactCard title="Membres" information={team?.members?.length} className="bg-purple-600" />
        <FactCard title="Créé en" information={new Date(team?.createdAt).getFullYear()} className="bg-purple-600" /> */}
      </div>
    </div>
    // <div className="grid grid-flow-col grid-cols-8 grid-rows-6 gap-4 centered-container">
    //   <div className="col-span-4 row-span-2 rounded-xl bg-blue-600">test</div>
    // </div>
    // <div className="text-1">
    //   <h1>{team?.actor?.name}</h1>
    //   <p>{team?.tagline}</p>
    // </div>
  );
}