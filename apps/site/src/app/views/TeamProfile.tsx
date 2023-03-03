import { ProfileBase } from './ProfileBase';
import { ActionButton, TextSection } from '@okampus/ui/atoms';

import { getAvatar, getBanner } from '@okampus/ui/utils';
import { getColorHexFromData } from '@okampus/shared/utils';
import { LabeledMemberHorizontal, ProfileSkeleton, TagGroup } from '@okampus/ui/molecules';
import { useMe, useOrg } from '@okampus/ui/hooks';
import { TeamPermissions } from '@okampus/shared/enums';

import { ReactComponent as EditOutlinedIcon } from '@okampus/assets/svg/icons/outlined/edit.svg';

import { ActionType } from '@okampus/shared/types';
import { useNavigate } from 'react-router-dom';

export function TeamProfile() {
  const navigate = useNavigate();
  const { me } = useMe();
  const { org } = useOrg();

  const color = getColorHexFromData(org?.actor?.name);

  const teamMembers =
    org?.members?.map((member) => {
      return {
        name: member?.user?.firstName,
        role: member?.roles.map((role) => role.name).join(' / '),
        avatar: getAvatar(member?.user?.actor?.actorImages),
      };
    }) ?? [];

  const isManager = org?.members
    ?.find((member) => member.user?.id === me?.id)
    ?.roles?.some(
      (role) =>
        role.permissions.includes(TeamPermissions.ManageTeam) || role.permissions.includes(TeamPermissions.Admin)
    );

  const menus = [
    {
      title: 'Profil',
      content: (
        <div className="flex flex-col gap-4">
          <TextSection title="À propos">{org?.actor?.bio}</TextSection>
          <TagGroup
            limit={5}
            tags={
              org?.actor?.tags.map((tag) => ({
                label: tag.name,
                slug: tag.slug,
              })) ?? []
            }
          />
        </div>
      ),
    },
    {
      title: 'Membres',
      content: (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-12">
          {teamMembers.map((member, idx) => (
            <LabeledMemberHorizontal {...member} key={idx} />
          ))}
        </div>
      ),
    },
    {
      title: 'Événements',
      content: <div>Événements</div>,
    },
  ];

  const avatar = { src: getAvatar(org?.actor?.actorImages) };
  const banner = { src: getBanner(org?.actor?.actorImages) };

  // return <ProfileSkeleton />;
  return org && org.actor ? (
    <ProfileBase
      color={color}
      name={org.actor.name}
      avatar={avatar}
      type={org.type}
      banner={banner}
      details={<div className="tagline">{org?.tagline}</div>}
    >
      {/* Action list */}

      <div className="button-list">
        <ActionButton onClick={() => ({})}>Follow</ActionButton>
        {isManager && (
          <ActionButton
            variant={ActionType.Do}
            onClick={() => navigate(`/manage/${org?.actor?.slug}`)}
            icon={<EditOutlinedIcon height={20} />}
          >
            Gérer le profil
          </ActionButton>
        )}
      </div>
    </ProfileBase>
  ) : (
    <ProfileSkeleton />
  );

  // <div className="flex flex-col">
  //   <div className="p-view flex gap-8 items-end relative">
  //     <GradientDark className="absolute inset-0">
  //       <Banner src={getBanner(org?.actor?.actorImages)} name={org?.actor?.name} />
  //     </GradientDark>
  //     <Avatar
  //       name={org?.actor?.name}
  //       src={getAvatar(org?.actor?.actorImages)}
  //       rounded={8}
  //       size={94}
  //       className="shadow-xl z-10"
  //     />
  //     <div className="text-white z-10 py-1.5">
  //       <div className="text-sm font-semibold tracking-wider opacity-95">Club</div>
  //       <div className="text-8xl font-title leading-tight font-bold tracking-tighter line-clamp-1 pr-1">
  //         {org?.actor?.name}
  //       </div>
  //       <div className="text-2xl font-semibold tracking-wide line-clamp-1">{org?.tagline}</div>
  //     </div>
  //   </div>
  //   <div className="relative">
  //     <div className="absolute p-view-inner z-10">
  //       <ActionButton onClick={() => ({})} large={true}>
  //         Follow
  //       </ActionButton>
  //       {isManager && (
  //         <ActionButton
  //           variant={ActionType.Do}
  //           onClick={() => navigate(`/manage/${org?.actor?.slug}`)}
  //           icon={<EditOutlinedIcon height={20} />}
  //         >
  //           Gérer le profil
  //         </ActionButton>
  //       )}
  //     </div>
  //     <GradientTransparent className="absolute top-0 left-0 w-full h-72">
  //       <div className="absolute inset-0" style={{ backgroundColor: color }} />
  //     </GradientTransparent>
  //   </div>
  // </div>
  // <div className="p-view flex flex-col gap-4 centered-container">
  //   <div className="flex justify-between my-4">
  //     <div className="text-0 text-4xl font-semibold">{org?.actor?.name}</div>
  //     <div className="flex gap-4">
  //       <div className="button text-opposite bg-opposite">Suivre</div>
  //       <div className="button text-white bg-green-600">Rejoindre</div>
  //     </div>
  //   </div>
  //   <div className="grid grid-cols-8 grid-rows-2 gap-4">
  //     <ImageGroup images={getProfileImages(org?.actor?.actorImages)} className="col-span-4 row-span-2 max-h-80" />
  //     <YouTubeCard name={org?.actor?.name} slug={org?.actor?.slug} className="col-span-2 row-span-2" />
  //     <InstagramCard name={org?.actor?.name} slug={org?.actor?.slug} className="col-span-2" />
  //     <FactCard title="Membres" information={org?.members?.length} className="bg-purple-600" />
  //     <FactCard title="Créé en" information={new Date(org?.createdAt).getFullYear()} className="bg-purple-600" />
  //   </div>
  //   <div className="grid grid-cols-8 grid-rows-2 gap-4">
  //     <PaginationSwiper
  //       className="col-span-4 row-span-2 bg-purple-600 h-fit"
  //       header={
  //         <div className="text-white/80 flex gap-1 items-center">
  //           L'équipe <div className="text-white">({org?.members.length})</div>
  //         </div>
  //       }
  //       items={teamMembers}
  //       grid={[2, 5]}
  //       renderItem={MemberLabel}
  //     />
  //     <FactCard
  //       title="Description"
  //       information={org?.actor?.bio}
  //       informationClassName="line-clamp-4"
  //       footer={
  //         <div className="mt-3">
  //           <div className="text-white/80 font-medium">Tags</div>
  //           <div className="flex gap-1 flex-wrap mt-2">
  //             {org?.actor?.tags.map((tag) => (
  //               <Tag label={tag.name} backgroundColor={COLORS[tag.color]} key={tag.id} slug={tag.slug} />
  //             ))}
  //           </div>
  //         </div>
  //       }
  //       className="bg-purple-600 col-span-4 row-span-2"
  //     />
  //     {/* <div className="col-span-4 row-span-2">
  //       {teamMembers?.map((member) => {
  //         return (
  //           <div className="flex gap-2">
  //             <img src={member.avatar} alt="" className="w-10 h-10 rounded-full" />
  //             <p>{member.name}</p>
  //           </div>
  //         );
  //       })}
  //     </div> */}
  //     {/* <ImageGroup images={images} className="col-span-4 row-span-2 max-h-64" />
  //     <FactCard title="Membres" information={org?.members?.length} className="bg-purple-600" />
  //     <FactCard title="Créé en" information={new Date(org?.createdAt).getFullYear()} className="bg-purple-600" /> */}
  //   </div>
  // </div>
  // <div className="grid grid-flow-col grid-cols-8 grid-rows-6 gap-4 centered-container">
  //   <div className="col-span-4 row-span-2 rounded-xl bg-blue-600">test</div>
  // </div>
  // <div className="text-1">
  //   <h1>{org?.actor?.name}</h1>
  //   <p>{org?.tagline}</p>
  // </div>
}
