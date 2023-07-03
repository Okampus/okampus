// import { TeamSidePanel } from '../SidePanel/TeamSidePanel';
// import { UserSidePanel } from '../SidePanel/UserSidePanel';
// import { ProjectSidePanel } from '../SidePanel/ProjectSidePanel';
// import { EventSidePanel } from '../SidePanel/EventSidePanel';
// import { MySidePanel } from '../SidePanel/MySidePanel';

// import { EventManageSidePanel } from '../SidePanel/EventManageSidePanel';
// import {
//   useTeam,
//   useUser,
//   useTeamManage,
//   useProject,
//   useEvent,
//   useEventManage,
//   useCurrentUser,
// } from '@okampus/ui/hooks';
import {
  // AVATAR_TEAM_ROUNDED, AVATAR_USER_ROUNDED,
  BANNER_ASPECT_RATIO,
} from '@okampus/shared/consts';
import { DarkGradient, BannerImage, AvatarImage } from '@okampus/ui/atoms';

// import { useLocation } from 'react-router-dom';

// const renderUsers = (memberships: TeamMemberWithUser[]) =>
//   memberships
//     .map((teamMember, idx) => (
//       <li key={idx} className="w-full">
//         <LabeledSideUser teamMember={teamMember} />
//       </li>
//     ))
//     .filter(isNotNull);

// const renderCategories = (categories: [string, JSX.Element[]][]) => (
//   <>
//     {categories
//       .filter(([, items]) => items.length > 0)
//       .map(([category, users]) => (
//         <ul className="mb-4" key={category}>
//           <div className={clsx('label', smallHideClassName)}>
//             {category} — {users.length}
//           </div>
//           {users}
//         </ul>
//       ))}
//   </>
// );

export function SidePanel() {
  // const { currentUser } = useCurrentUser();
  // const location = useLocation();

  // const { team } = useTeam();
  // const { teamManage } = useTeamManage();
  // const { user } = useUser();
  // const { project } = useProject();
  // const { event } = useEvent();
  // const { eventManage } = useEventManage();

  let avatar: { src: string | undefined; rounded: number } | undefined;
  let banner: string | undefined;
  let name: string | undefined;
  let title: string | undefined;
  let sidePanel: React.ReactNode | undefined;

  // const containsPath = (subpath: string) =>
  //   location.pathname.startsWith(`${subpath}/`) || location.pathname === subpath;
  // if (containsPath('/events')) {
  //   // name = 'Événements récents';
  // } else if (containsPath('/me')) {
  //   avatar = { src: getAvatar(currentUser?.individual?.actor?.actorImages), rounded: AVATAR_USER_ROUNDED };
  //   banner = getBanner(currentUser?.individual?.actor?.actorImages);
  //   name = currentUser?.individual?.actor?.name;
  //   sidePanel = <MySidePanel />;
  // } else if (team) {
  //   avatar = { src: getAvatar(team.actor?.actorImages), rounded: AVATAR_TEAM_ROUNDED };
  //   banner = getBanner(team.actor?.actorImages);
  //   name = team.actor?.name;
  //   sidePanel = <TeamSidePanel team={team} />;
  // } else if (teamManage) {
  //   avatar = { src: getAvatar(teamManage.actor?.actorImages), rounded: AVATAR_TEAM_ROUNDED };
  //   banner = getBanner(teamManage.actor?.actorImages);
  //   name = teamManage.actor?.name;
  //   sidePanel = <TeamSidePanel team={teamManage} />;
  //   // sidePanel = <TeamManageSidePanel teamManage={teamManage} />;
  // } else if (user) {
  //   avatar = { src: getAvatar(user.individual?.actor?.actorImages), rounded: AVATAR_USER_ROUNDED };
  //   banner = getBanner(user.individual?.actor?.actorImages);
  //   name = user.individual?.actor?.name;
  //   sidePanel = <UserSidePanel user={user} />;
  // } else if (project) {
  //   title = 'Projet';
  //   banner = project.banner?.url;
  //   name = project.name;
  //   sidePanel = <ProjectSidePanel project={project} />;
  // } else if (event) {
  //   title = 'Événement';
  //   banner = event.banner?.url;
  //   name = event?.name;
  //   sidePanel = <EventSidePanel event={event} />;
  // } else if (eventManage) {
  //   banner = eventManage.fileUpload?.url;
  //   name = eventManage.contentMaster?.name;
  //   sidePanel = <EventManageSidePanel event={eventManage} />;
  // }

  return (
    <div className="h-full flex flex-col fixed top-[var(--topbar-height)] right-0 overflow-x-hidden">
      {(banner || name) && avatar ? (
        <>
          <div className="w-full relative" style={{ aspectRatio: BANNER_ASPECT_RATIO }}>
            <BannerImage aspectRatio={BANNER_ASPECT_RATIO} src={banner} name={name} />
            <div className="absolute -bottom-8  w-full">
              <AvatarImage
                className="mx-auto outline-4 outline outline-[var(--bg-main)]"
                {...avatar}
                name={name}
                size={40}
              />
            </div>
          </div>
          <div className="px-6 title mt-14 text-center">{name}</div>
        </>
      ) : (
        <div className="w-full relative" style={{ aspectRatio: BANNER_ASPECT_RATIO }}>
          <DarkGradient>
            <BannerImage aspectRatio={BANNER_ASPECT_RATIO} src={banner} name={name} />
            <div className="absolute top-4 px-6 font-medium uppercase text-0 tracking-wider z-[60]">{title}</div>
          </DarkGradient>
          <div className="absolute bottom-4 px-5 text-4xl font-bold text-white">{name}</div>
        </div>
      )}
      {sidePanel}
    </div>
  );
  // const isSmall = useIsSmall();
  // const { currentUser, selected, showButtonModal } = useContext(NavigationContext);

  // const { team } = useTeam();
  // const { teamManage } = useTeamManage();
  // const { user } = useIndividual();

  // const actor =
  //   selected.subSpace === SubspaceType.Org
  //     ? team?.actor
  //     : selected.subSpace === SubspaceType.Manage
  //     ? teamManage?.actor
  //     : selected.subSpace === SubspaceType.User
  //     ? user?.actor
  //     : selected.subSpace === SubspaceType.Me
  //     ? currentUser?.individual?.actor
  //     : null;

  // const topbarTitle = () => {
  //   if (!actor) return null;

  //   const avatarProps: AvatarImageProps = {
  //     size: 19,
  //     rounded:
  //       selected.subSpace === SubspaceType.Org || selected.subSpace === SubspaceType.Manage
  //         ? AVATAR_TEAM_ROUNDED
  //         : AVATAR_USER_ROUNDED,
  //     src: getAvatar(actor.actorImages),
  //     name: actor?.name,
  //   };

  //   if (selected.subSpace === SubspaceType.Org || selected.subSpace === SubspaceType.Manage)
  //     return (
  //       <div className="flex items-center justify-between w-full">
  //         <div className="flex items-center gap-item w-full">
  //           <AvatarImage {...avatarProps} />
  //           <div className={smallHideClassName}>
  //             <h2 className="text-0 text-xl tracking-tighter font-bold line-clamp-1">{actor.name}</h2>
  //             <div className="text-sm text-3 -mt-0.5">@{actor.slug}</div>
  //           </div>
  //         </div>
  //         <ChevronDownFilledIcon className={clsx('w-10 h-10 text-0', smallHideClassName)} />
  //       </div>
  //     );

  //   // if (selected.subSpace === SubspaceType.Manage)
  //   //   return (
  //   //     <div className="flex items-center gap-item w-full">
  //   //       <Avatar {...avatarProps} />
  //   //       {actor.name && (
  //   //         <Textfit className="flex items-center h-12 grow pr-6 leading-none tracking-tighter font-bold" mode="multi">
  //   //           Gérer : {actor.name}
  //   //         </Textfit>
  //   //       )}
  //   //     </div>
  //   //   );

  //   if (selected.subSpace === SubspaceType.User)
  //     return (
  //       <div>
  //         <div>Profil public</div>
  //         <div className="text-sm text-3">@{actor.slug}</div>
  //       </div>
  //     );

  //   if (selected.subSpace === SubspaceType.Me)
  //     return (
  //       <div>
  //         <div>Mon profil</div>
  //         <div className="text-sm text-3">@{actor.slug}</div>
  //       </div>
  //     );

  //   return null;
  // };

  // const sidePanelDetails = () => {
  //   const currentTeam = team ?? teamManage;
  //   if ((selected.subSpace === SubspaceType.Org || selected.subSpace === SubspaceType.Manage) && currentTeam) {
  //     const isMeMember = currentTeam.teamMembers.some(({ user }) => user.id === currentUser?.id);

  //     const directors: typeof currentTeam.teamMembers[number][] = [];
  //     const managers: typeof currentTeam.teamMembers[number][] = [];
  //     const members: typeof currentTeam.teamMembers[number][] = [];

  //     for (const member of currentTeam.teamMembers) {
  //       if (member.teamMemberRoles.some(({ role }) => role.category === RoleCategory.Directors)) directors.push(member);
  //       else if (member.teamMemberRoles.some(({ role }) => role.category === RoleCategory.Managers))
  //         managers.push(member);
  //       else members.push(member);
  //     }

  //     return (
  //       <div className="flex flex-col">
  //         <div className={clsx('font-0 font-semibold px-1 pb-1 text-lg', smallHideClassName)}>
  //           {currentTeam.tagline}
  //         </div>
  //         <div className="grid gap-2 my-2 xl:grid-cols-2 xl-max:px-1.5">
  //           <ActionButton
  //             className="w-full"
  //             action={{
  //               type:
  //                 selected.subSpace === SubspaceType.Manage
  //                   ? undefined
  //                   : isMeMember
  //                   ? ActionType.Info
  //                   : ActionType.Primary,
  //               label:
  //                 !isSmall && (selected.subSpace === SubspaceType.Manage ? 'Profil' : isMeMember ? 'Gérer' : 'Adhérer'),
  //               iconOrSwitch: isSmall && <UserAddIcon className="w-6 h-6 xl-max:h-full xl-max:w-full" />,
  //               linkOrActionOrMenu:
  //                 selected.subSpace === SubspaceType.Manage
  //                   ? TEAM_ROUTE(teamManage?.actor?.slug)
  //                   : isMeMember
  //                   ? TEAM_MANAGE_ROUTE(team?.actor?.slug)
  //                   : () => showButtonModal({ title: `Adhérer à ${currentTeam.actor?.name} ✨`, content: <TeamJoinForm /> }),
  //             }}
  //             small={true}
  //           />
  //           <ActionButton
  //             className="w-full"
  //             action={{
  //               type: ActionType.Action,
  //               label: !isSmall && 'Suivre',
  //               iconOrSwitch: <PlusIcon className="w-6 h-6 xl-max:h-full xl-max:w-full" />,
  //             }}
  //             small={true}
  //           />
  //         </div>
  //         {/* <div className="flex flex-col px-2 text-lg">

  //         </div> */}
  //         <hr className="separator" />

  //         <div>
  //           {/* <div className="label gap-2 px-2">{currentOrg.members.length} Membres</div> */}
  //           {renderCategories([
  //             [currentTeam.directorsCategoryName || 'Directeurs', renderUsers(directors)],
  //             [currentTeam.managersCategoryName || 'Gestionnaires', renderUsers(managers)],
  //             [currentTeam.membersCategoryName || 'Membres', renderUsers(members)],
  //           ])}
  //         </div>
  //       </div>
  //     );
  //   }

  //   // if (tenant?.actor) {
  //   //   if (!data) {
  //   //     return (
  //   //       <>
  //   //         <Skeleton height={16} width="full" />
  //   //         <Skeleton height={16} width="full" />
  //   //       </>
  //   //     );
  //   //   }

  //   //   return renderCategories([
  //   //     [
  //   //       'Staff administrateur',
  //   //       renderUsers(
  //   //         data.individual.map((individual) => ({
  //   //           __typename: 'membership',
  //   //           id: '',
  //   //           membership_roles: [],
  //   //           individualByUserId: individual,
  //   //           start_date: individual?.createdAt,
  //   //         }))
  //   //       ),
  //   //     ],
  //   //   ]);
  //   // }

  //   return null;
  // };

  // return (
  //   <nav className="shrink-0 flex flex-col h-full w-sidepanel bg-main text-0 overflow-hidden">
  //     {/* <div className="flex gap-item items-center h-[var(--topbar-height)] text-xl px-4 font-semibold shrink-0 xl:border-b border-color-3 bg-1-hover">
  //       {topbarTitle()}
  //     </div> */}
  //     <ul className="xl-max:p-2.5 p-3 scrollbar">{sidePanelDetails()}</ul>
  //   </nav>
  // );
}
