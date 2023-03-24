import { TeamJoinForm } from './TeamJoinForm';
import { TeamJoinView } from './TeamJoinView';
import { ProfileBase } from '../ProfileBase';

import { ReactComponent as FavoriteFilledIcon } from '@okampus/assets/svg/icons/material/filled/favorite.svg';
import { ReactComponent as FavoriteOutlinedIcon } from '@okampus/assets/svg/icons/material/outlined/favorite.svg';

import { AVATAR_TEAM_ROUNDED, TEAM_MANAGE_ROUTE, TEAM_ROUTES, TEAM_TAB_ROUTE } from '@okampus/shared/consts';
import { ScopeRole, TeamPermissions } from '@okampus/shared/enums';
import { getColorHexFromData } from '@okampus/shared/utils';
import { ActionType } from '@okampus/shared/types';

import { ActionButton, GridLoader, TextSection } from '@okampus/ui/atoms';
import { NavigationContext, useMe, useTeam } from '@okampus/ui/hooks';
import { TagGroup } from '@okampus/ui/molecules';
import { getAvatar, getBanner } from '@okampus/ui/utils';

import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

const canManage = (permissions: TeamPermissions[]) =>
  permissions.includes(TeamPermissions.ManageTeam) || permissions.includes(TeamPermissions.Admin);

export function TeamView() {
  const navigate = useNavigate();
  const { showModal } = useContext(NavigationContext);

  const { me } = useMe();
  const { team } = useTeam();

  if (!me) return null;
  if (!team || !team.actor) return <GridLoader />;

  const manageRoute = TEAM_MANAGE_ROUTE(team.actor.slug);
  const teamJoinRoute = TEAM_TAB_ROUTE(team.actor.slug, TEAM_ROUTES.JOIN);

  const myTeamJoin = me.teamJoins.find((join) => join.team?.id === team.id);
  const myRoles = team.members.find((member) => member.user?.id === me.id)?.roles ?? [];

  const isMember = myRoles.length;
  const isManager = myRoles.some((role) => canManage(role.permissions));

  const menus = [
    {
      key: TEAM_ROUTES.PROFILE,
      label: 'Profil',
      element: (
        <div className="flex flex-col gap-4 p-view">
          <TextSection title="À propos">{team.actor.bio}</TextSection>
          <TagGroup limit={5} tags={team.actor.tags.map((tag) => ({ label: tag.name, slug: tag.slug }))} />
        </div>
      ),
    },
    {
      key: TEAM_ROUTES.JOIN,
      label: 'Devenir membre',
      element: <TeamJoinView teamJoin={myTeamJoin} />,
    },
    {
      key: TEAM_ROUTES.EVENTS,
      label: 'Événements',
      element: <div></div>,
    },
    {
      key: TEAM_ROUTES.GALLERIES,
      label: 'Galerie',
      element: <div></div>,
    },
  ];

  const avatar = { src: getAvatar(team.actor.actorImages), rounded: AVATAR_TEAM_ROUNDED };
  const banner = { src: getBanner(team.actor.actorImages) };
  const color = getColorHexFromData(team?.actor?.name);

  const buttonList = (
    <>
      {isManager || me.scopeRole === ScopeRole.Admin ? (
        <ActionButton variant={ActionType.Simple} onClick={() => navigate(manageRoute)}>
          Vue administrateur
        </ActionButton>
      ) : isMember ? (
        <ActionButton variant={ActionType.Simple} onClick={() => navigate(manageRoute)}>
          Vue membre
        </ActionButton>
      ) : myTeamJoin ? (
        <ActionButton variant={ActionType.Pending} onClick={() => navigate(teamJoinRoute)}>
          Adhésion en attente...
        </ActionButton>
      ) : (
        <ActionButton
          variant={ActionType.Confirm}
          onClick={() => showModal({ title: `Adhérer à ${team.actor?.name} ✨`, content: <TeamJoinForm /> })}
        >
          Adhérer
        </ActionButton>
      )}
      <ActionButton icon={<FavoriteOutlinedIcon />} iconActive={<FavoriteFilledIcon className="text-red-500" />} />
    </>
  );

  return (
    <ProfileBase
      switchTabRoute={(tab) => TEAM_TAB_ROUTE(team.actor?.slug, tab)}
      tabs={menus}
      avatar={avatar}
      banner={banner}
      color={color}
      name={team.actor.name}
      details={team.tagline && <div className="tagline">{team.tagline}</div>}
      buttonList={buttonList}
    />
  );
}
