import { TeamJoinView } from './TeamJoinView';
import { TeamProjectView } from './TeamProjectView';
import { TabsTopbarView } from '@okampus/ui/templates';

import { TEAM_ROUTE, TEAM_ROUTES } from '@okampus/shared/consts';
import { NavigationContext, useCurrentUser, useTeam } from '@okampus/ui/hooks';
import { TagGroup } from '@okampus/ui/molecules';

import { TeamSidePanel } from '#site/app/components/SidePanel/TeamSidePanel';
import { useContext, useEffect } from 'react';

export function TeamView() {
  const { showSidePanel, hideSidePanel } = useContext(NavigationContext);
  const { currentUser } = useCurrentUser();
  const { team } = useTeam();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => team && showSidePanel(<TeamSidePanel team={team} />), [team]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => hideSidePanel(), []);

  if (!currentUser || !team || !team.actor) return null;

  const menus = [
    {
      key: TEAM_ROUTES.PROFILE,
      label: 'Profil',
      element: () => (
        <div className="flex flex-col gap-4 px-content py-content">
          <div className="flex flex-col gap-4">
            <div className="title text-1">À propos</div>
            <div className="text-2 font-medium leading-7">{team.actor?.bio}</div>
          </div>
          <TagGroup
            limit={5}
            tags={team.actor?.actorTags.map(({ tag }) => ({ label: tag.name, slug: tag.slug })) ?? []}
          />
        </div>
      ),
    },
    {
      key: TEAM_ROUTES.PROJECTS,
      label: 'Projets',
      element: () => <TeamProjectView />,
    },
    {
      key: TEAM_ROUTES.JOIN,
      label: 'Devenir membre',
      element: () => <TeamJoinView />,
    },
    // {
    //   key: TEAM_ROUTES.EVENTS,
    //   label: 'Événements',
    //   element: () => <div></div>,
    // },
    // {
    //   key: TEAM_ROUTES.GALLERIES,
    //   label: 'Galerie',
    //   element: () => <div></div>,
    // },
  ];

  // const avatar = { src: getAvatar(team.actor.actorImages), rounded: AVATAR_TEAM_ROUNDED };
  // const banner = { src: getBanner(team.actor.actorImages), aspectRatio: BANNER_ASPECT_RATIO };
  // const color = getColorHexFromData(team?.actor?.name);

  return <TabsTopbarView basePath={TEAM_ROUTE(team.actor?.slug)} menus={menus} />;
}
