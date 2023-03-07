import { ProfileBase } from '../ProfileBase';
import { ErrorPage } from '../ErrorPage';
import { TeamRoute } from '../../menus';

import { ActionButton, GridLoader, TextSection } from '@okampus/ui/atoms';
import { useMe, useOrg } from '@okampus/ui/hooks';
import { TagGroup } from '@okampus/ui/molecules';
import { getAvatar, getBanner } from '@okampus/ui/utils';
import { AVATAR_TEAM_ROUNDED } from '@okampus/shared/consts';
import { TeamPermissions } from '@okampus/shared/enums';
import { getColorHexFromData } from '@okampus/shared/utils';
import { ActionType } from '@okampus/shared/types';

import { useNavigate, useParams } from 'react-router-dom';

const canManage = (permissions: TeamPermissions[]) =>
  permissions.includes(TeamPermissions.ManageTeam) || permissions.includes(TeamPermissions.Admin);

export function TeamView() {
  const { tab } = useParams<{ tab: TeamRoute }>();
  if (!tab || !Object.values(TeamRoute).includes(tab)) return <ErrorPage />;
  return <TeamViewWrapping tab={tab} />;
}

export function TeamViewWrapping({ tab }: { tab: TeamRoute }) {
  const navigate = useNavigate();
  const { me } = useMe();
  const { org } = useOrg();

  if (!me) return null;
  if (!org || !org.actor) return <GridLoader />;

  const manageRoute = `/manage/${org.actor.slug}`;
  const roles = org.members.find((member) => member.user?.id === me.id)?.roles ?? [];
  const isManager = roles && roles.some((role) => canManage(role.permissions));

  const menus = {
    [TeamRoute.Profile]: (
      <div className="flex flex-col gap-4 px-view">
        <TextSection title="À propos">{org.actor.bio}</TextSection>
        <TagGroup limit={5} tags={org.actor.tags.map((tag) => ({ label: tag.name, slug: tag.slug }))} />
      </div>
    ),
    [TeamRoute.Events]: 'Événements',
    [TeamRoute.Galleries]: 'Galleries',
  };

  const avatar = { src: getAvatar(org.actor.actorImages), rounded: AVATAR_TEAM_ROUNDED };
  const banner = { src: getBanner(org.actor.actorImages) };
  const color = getColorHexFromData(org?.actor?.name);

  const buttonList = (
    <>
      <ActionButton onClick={() => ({})}>S'abonner</ActionButton>
      {isManager && (
        <ActionButton variant={ActionType.Do} onClick={() => navigate(manageRoute)}>
          Gérer le profil
        </ActionButton>
      )}
    </>
  );

  return (
    <ProfileBase
      color={color}
      small={tab !== TeamRoute.Profile}
      name={org.actor.name}
      avatar={avatar}
      type={org.type}
      banner={banner}
      buttonList={buttonList}
      details={org.tagline && <div className="tagline">{org.tagline}</div>}
    >
      {menus[tab]}
    </ProfileBase>
  );
}
