import { TeamJoinForm } from '../Form/FormModal/TeamJoinForm';
// import { ReactComponent as PlusIcon } from '@okampus/assets/svg/icons/material/filled/add.svg';
import { ReactComponent as UserAddFilledIcon } from '@okampus/assets/svg/icons/material/filled/user-add.svg';
import { ReactComponent as TimeFilledIcon } from '@okampus/assets/svg/icons/material/filled/time.svg';

import { TEAM_ROUTE, TEAM_MANAGE_ROUTE, BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import { RoleCategory, SubspaceType } from '@okampus/shared/enums';
import { insertFollowMutation } from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';
import { isNotNull } from '@okampus/shared/utils';

import { BannerImage, AvatarImage, Modal } from '@okampus/ui/atoms';
import { useCurrentUser, NavigationContext } from '@okampus/ui/hooks';
import { ActionButton, LabeledSideUser } from '@okampus/ui/molecules';
import { getAvatar, getBanner } from '@okampus/ui/utils';

import { mergeCache } from '#site/app/utils/apollo/merge-cache';
import { useMutation } from '@apollo/client';
import { useContext } from 'react';

import type { TeamMemberWithUserInfo, TeamWithMembersInfo } from '@okampus/shared/graphql';

const renderUsers = (memberships: TeamMemberWithUserInfo[]) =>
  memberships
    .map((teamMember, idx) => (
      <li key={idx} className="w-full">
        <LabeledSideUser teamMember={teamMember} />
      </li>
    ))
    .filter(isNotNull);

const renderCategories = (categories: [string, JSX.Element[]][]) => (
  <>
    {categories
      .filter(([, items]) => items.length > 0)
      .map(([category, users]) => (
        <ul className="mb-4" key={category}>
          <div className="label">
            {category} — {users.length}
          </div>
          {users}
        </ul>
      ))}
  </>
);

export type TeamSidePanelProps = { team: TeamWithMembersInfo };
export function TeamSidePanel({ team }: TeamSidePanelProps) {
  const { selected, showOverlay, setNotification } = useContext(NavigationContext);
  const { currentUser } = useCurrentUser();

  const [insertFollow] = useMutation(insertFollowMutation);

  const isCurrentUserMember = currentUser?.teamMembers.some((teamMember) => teamMember.team?.id === team.id);
  const isCurrentUserJoining = currentUser?.teamJoins.some((teamJoin) => teamJoin.team?.id === team.id);
  const isCurrentUserFollowing = currentUser?.individualById?.follows.some(
    (follow) => follow.actor?.id === team.actor?.id
  );

  const directors: typeof team.teamMembers[number][] = [];
  const managers: typeof team.teamMembers[number][] = [];
  const members: typeof team.teamMembers[number][] = [];

  for (const member of team.teamMembers) {
    if (member.teamMemberRoles.some(({ role }) => role.category === RoleCategory.Directors)) directors.push(member);
    else if (member.teamMemberRoles.some(({ role }) => role.category === RoleCategory.Managers)) managers.push(member);
    else members.push(member);
  }

  // const canManage = (permissions: TeamPermissions) => permissions & TeamPermissions.ManageTeam;
  // TEAM_TAB_ROUTE({ slug: team.actor.slug, tab: TEAM_ROUTES.JOIN })

  // const myTeamJoin = currentUser.teamJoins.find((join) => join.team?.id === team.id);
  // const myRoles = team.teamMembers.find((member) => member.userInfo?.id === currentUser.id)?.teamMemberRoles ?? [];

  // const isMember = myRoles.length;
  // const isManager = myRoles.some(({ role }) => canManage(role.permissions));

  // const buttonList = (
  //   <div className="flex items-center gap-8">
  //     {isManager || currentUser.individualById?.scopeRole === ScopeRole.Admin ? (
  //       <ActionButton
  //         action={{
  //           iconOrSwitch: <AdminSettingsFilledIcon />,
  //           label: 'Gérer',
  //           linkOrActionOrMenu: manageRoute,
  //           type: ActionType.Action,
  //         }}
  //       />
  //     ) : isMember ? (
  //       <ActionButton
  //         action={{
  //           iconOrSwitch: <UserGroupFilledIcon />,
  //           label: 'Vue membre',
  //           linkOrActionOrMenu: manageRoute,
  //           type: ActionType.Action,
  //         }}
  //       />
  //     ) : myTeamJoin ? (
  //       <ActionButton
  //         action={{
  //           iconOrSwitch: <EllipsisFilledIcon />,
  //           label: 'En attente',
  //           type: ActionType.Info,
  //           linkOrActionOrMenu: teamJoinRoute,
  //         }}
  //       />
  //     ) : (
  //       <ActionButton
  //         action={{
  //           iconOrSwitch: <UserAddFilledIcon />,
  //           label: 'Adhérer',
  //           type: ActionType.Success,
  //           linkOrActionOrMenu: () => showModal(<TeamJoinForm team={team} />),
  //           // showButtonModal({ title: `Adhérer à ${team.actor?.name} ✨`, content: <TeamJoinForm /> }),
  //         }}
  //       />
  //     )}
  //   </div>
  // );

  const banner = getBanner(team.actor?.actorImages);
  return (
    <div className="flex flex-col items-center">
      <div className="w-full relative" style={{ aspectRatio: BANNER_ASPECT_RATIO }}>
        <BannerImage aspectRatio={BANNER_ASPECT_RATIO} src={banner} name={team.actor?.name} />
        <div className="absolute -bottom-8 w-full">
          <AvatarImage
            className="mx-auto border-4 border-[var(--bg-0)]"
            name={team.actor?.name}
            src={getAvatar(team.actor?.actorImages)}
            size={40}
            type="team"
          />
        </div>
      </div>
      <div className="px-6 title mt-14 text-center">{team.actor?.name}</div>

      <div className="text-0 p-4 font-medium text-lg text-justify leading-6">{team.tagline}</div>
      <div className="grid gap-4 my-2 grid-cols-2 w-full px-4">
        <ActionButton
          className="w-full"
          action={{
            type:
              selected.subSpace === SubspaceType.Manage
                ? undefined
                : isCurrentUserMember
                ? ActionType.Info
                : isCurrentUserJoining
                ? ActionType.Warning
                : ActionType.Primary,
            label:
              selected.subSpace === SubspaceType.Manage
                ? 'Profil'
                : isCurrentUserMember
                ? 'Gérer'
                : isCurrentUserJoining
                ? 'En attente'
                : 'Adhérer',
            iconOrSwitch: isCurrentUserJoining ? <TimeFilledIcon /> : <UserAddFilledIcon />,
            linkOrActionOrMenu:
              selected.subSpace === SubspaceType.Manage
                ? TEAM_ROUTE(team?.actor?.slug)
                : isCurrentUserMember
                ? TEAM_MANAGE_ROUTE(team?.actor?.slug)
                : isCurrentUserJoining
                ? () => showOverlay(<Modal header={'Adhésion en attente'}>{/* //TODO: détails de la demande */}</Modal>)
                : () => showOverlay(<TeamJoinForm team={team} />),
          }}
          small={true}
        />
        <ActionButton
          className="w-full"
          action={{
            type: ActionType.Action,
            active: isCurrentUserFollowing,
            label: isCurrentUserFollowing ? 'Suivi' : 'Suivre',
            // iconOrSwitch: <PlusIcon className="w-6 h-6" />,
            linkOrActionOrMenu: () => {
              // isCurrentUserFollowing ?
              // :
              insertFollow({
                variables: { insert: { followedActorId: team.actor?.id as string } },
                onCompleted: ({ insertFollowOne: data }) => {
                  mergeCache(
                    { __typename: 'Individual', id: currentUser?.individualById?.id as string },
                    { fieldName: 'follows', fragmentOn: 'Follow', data }
                  );
                  setNotification({
                    type: ToastType.Success,
                    message: `Vous suivez maintenant ${team.actor?.name} !`,
                  });
                },
              });
            },
          }}
          small={true}
        />
      </div>
      {/* <div className="flex flex-col px-2 text-lg">

         </div> */}
      <div className="px-2 w-full">
        <hr className="separator w-full" />
      </div>

      <div className="self-start w-full h-full overflow-y-scroll scrollbar px-4">
        {/* <div className="label gap-2 px-2">{currentOrg.members.length} Membres</div> */}
        {renderCategories([
          [team.directorsCategoryName || 'Directeurs', renderUsers(directors)],
          [team.managersCategoryName || 'Gestionnaires', renderUsers(managers)],
          [team.membersCategoryName || 'Membres', renderUsers(members)],
        ])}
      </div>
    </div>
  );
}
