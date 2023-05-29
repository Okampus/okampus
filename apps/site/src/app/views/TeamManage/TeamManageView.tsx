// import { DocumentManageView } from './DocumentManageView';
import { TreasuryManageView } from './TreasuryManageView';
import { TeamEventManageView } from './TeamEventManageView';
import { TeamJoinManageView } from './TeamJoinManageView';
import { TeamProjectManageView } from './TeamProjectManageView';
import { TabsTopbarView } from '@okampus/ui/templates';

import { AVATAR_TEAM_ROUNDED, TEAM_MANAGE_ROUTE, TEAM_MANAGE_ROUTES, TEAM_ROUTE } from '@okampus/shared/consts';
import { ToastType } from '@okampus/shared/types';

import { AvatarImage } from '@okampus/ui/atoms';
import { NavigationContext, useCurrentUser, useTeamManage } from '@okampus/ui/hooks';
import { FormItem } from '@okampus/ui/molecules';
import { getAvatar } from '@okampus/ui/utils';

import { FormEditView } from '#site/app/components/Form/FormEdit/FormEditView';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import type { FormBaseInfo } from '@okampus/shared/graphql';

export function TeamManageView() {
  const { teamManage } = useTeamManage();
  const { setNotification, showOverlay } = useContext(NavigationContext);
  const { currentUser } = useCurrentUser();

  if (!teamManage || !teamManage.actor || !currentUser) return null;
  if (!teamManage.teamMembers.some((member) => member.userInfo?.id === currentUser.id)) {
    setNotification({
      message: `Vous n'avez pas les permissions de gérer l'équipe ${teamManage.actor.name}`,
      type: ToastType.Error,
    });
    return <Navigate to={TEAM_ROUTE(teamManage.actor.slug)} />;
  }

  const avatar = {
    src: getAvatar(teamManage.actor?.actorImages),
    rounded: AVATAR_TEAM_ROUNDED,
    size: 16,
    name: teamManage.actor.name,
  };
  // const banner = { src: getBanner(teamManage.actor?.actorImages) };
  // const color = getColorHexFromData(teamManage.actor.name);

  const editForm = (form: FormBaseInfo) => {
    showOverlay(<FormEditView id={form.id as string} />);
  };

  const form = teamManage.form;
  // const manageSections = [
  //   {
  //     title: "Formulaire d'adhésion",
  //     children: form ? <FormItem onClick={editForm} form={form} /> : <div>Aucun formulaire d'adhésion</div>,
  //   },
  //   // TODO: add TagInput
  //   // {
  //   //   title: 'Tags',
  //   //   children: <div>Tags</div>,
  //   // },
  //   // {
  //   //   title: 'Brochure de présentation',
  //   //   children: <DocumentInput />,
  //   // },
  // ];

  const menus = [
    {
      key: TEAM_MANAGE_ROUTES.PROFILE,
      label: 'Profil',
      element: () => (
        <div className="px-content py-content flex flex-col gap-4">
          <div className="title">Formulaire d'adhésion</div>
          {form ? <FormItem onClick={editForm} form={form} /> : <div>Aucun formulaire d'adhésion</div>}
        </div>
      ),
    },
    {
      key: TEAM_MANAGE_ROUTES.TEAM_JOIN,
      label: 'Adhésions',
      element: () => <TeamJoinManageView />,
    },
    // {
    //   key: TEAM_MANAGE_ROUTES.DOCUMENTS,
    //   label: 'Documents',
    //   element: () => <DocumentManageView />,
    // },
    {
      key: TEAM_MANAGE_ROUTES.TREASURY,
      label: 'Trésorerie',
      element: () => <TreasuryManageView />,
    },
    {
      key: TEAM_MANAGE_ROUTES.PROJECTS,
      label: 'Projets',
      element: () => <TeamProjectManageView />,
    },
    {
      key: TEAM_MANAGE_ROUTES.EVENTS,
      label: 'Événements',
      element: () => <TeamEventManageView />,
    },
    {
      key: TEAM_MANAGE_ROUTES.ROLES,
      label: 'Rôles',
      element: () => <div></div>,
    },
  ];

  return (
    <TabsTopbarView
      basePath={TEAM_MANAGE_ROUTE(teamManage?.actor?.slug)}
      menus={menus}
      topbarPrefix={
        <div className="flex gap-4 items-center">
          <AvatarImage {...avatar} />
          <div className="title">Gestion</div>
        </div>
      }
    />

    // <div>

    //   <div className="relative w-full h-full">{currentTab.element}</div>
    // </div>
  );

  // return (
  //   // <ManageProfileBase
  //   //   actorImageEdit={(image, actorImageType) => {
  //   //     if (teamManage) {
  //   //       const id = teamManage.id as string;
  //   //       if (image)
  //   //         updateTeam({
  //   //           variables: {
  //   //             ...(actorImageType === ActorImageType.Avatar ? { avatar: image } : { banner: image }), // FIXME: file upload
  //   //             updateTeam: { id },
  //   //           },
  //   //         });
  //   //       else deactivateImage({ variables: { id, now: new Date().toISOString() } });
  //   //     }
  //   //   }}
  //   //   avatar={avatar}
  //   //   banner={banner}
  //   //   color={color}
  //   //   tabs={menus}
  //   //   name={teamManage.actor.name}
  //   //   details={details}
  //   //   publicRoute={publicRoute}
  //   //   // buttonList={buttonList}
  //   //   switchTabRoute={(tab) => TEAM_MANAGE_TAB_ROUTE(teamManage.actor?.slug, tab)}
  //   // />
  // );
}
