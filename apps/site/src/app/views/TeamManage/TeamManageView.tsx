import { DocumentManageView } from './DocumentManageView';
import { TreasuryManageView } from './TreasuryManageView';
import { EventManageView } from './EventManageView';
import { TeamJoinManageView } from './TeamJoinManageView';
import { ProfileBase } from '../ProfileBase';

import { DocumentInput } from '#site/app/components/Input/DocumentInput';

import { ReactComponent as EditOutlineIcon } from '@okampus/assets/svg/icons/outlined/edit.svg';

import { ActionButton, FormItem, GridLoader } from '@okampus/ui/atoms';
import { NavigationContext, useMe, useTeamManage } from '@okampus/ui/hooks';

import { AVATAR_TEAM_ROUNDED, TEAM_MANAGE_ROUTES, TEAM_MANAGE_TAB_ROUTE, TEAM_ROUTE } from '@okampus/shared/consts';
import { ControlType } from '@okampus/shared/enums';
import {
  ActorImageType,
  deactivateTeamImageMutation,
  formFragment,
  getFragmentData,
  updateTeamMutation,
} from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';
import { getColorHexFromData } from '@okampus/shared/utils';

import { MultiSection } from '@okampus/ui/molecules';
import { DynamicForm } from '@okampus/ui/organisms';
import { getAvatar, getBanner } from '@okampus/ui/utils';

import { useMutation } from '@apollo/client';
import { useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import type { DynamicFieldData } from '@okampus/ui/organisms';

export function TeamManageView() {
  const navigate = useNavigate();
  const { me } = useMe();
  const { teamManage } = useTeamManage();
  const { addNotification, showModal, hideModal } = useContext(NavigationContext);

  const [updateTeam] = useMutation(updateTeamMutation);
  const [deactivateTeamImage] = useMutation(deactivateTeamImageMutation);

  if (!teamManage || !teamManage.actor || !me) return <GridLoader />;
  if (!teamManage.members.some((member) => member.user.id === me.id)) {
    addNotification({
      message: `Vous n'avez pas les permissions de gérer l'équipe ${teamManage.actor.name}`,
      type: ToastType.Error,
    });
    return <Navigate to={TEAM_ROUTE(teamManage.actor.slug)} />;
  }

  const publicRoute = TEAM_ROUTE(teamManage.actor.slug);
  const buttonList = (
    <div className="flex gap-4 items-center">
      <ActionButton variant={ActionType.Simple} onClick={() => navigate(publicRoute)}>
        Voir le profil public
      </ActionButton>
      <ActionButton
        icon={<EditOutlineIcon className="h-8 w-8" />}
        onClick={() =>
          showModal({
            title: "Modification des détails de l'équipe",
            content: (
              <DynamicForm
                fields={fields}
                onSubmit={(data) => {
                  if (teamManage) {
                    updateTeam({
                      variables: { updateTeam: { id: teamManage.id, ...data } },
                      onCompleted: () => {
                        hideModal();
                        addNotification({
                          message: 'Les détails de l’équipe ont été mis à jour',
                          type: ToastType.Success,
                        });
                      },
                    });
                  }
                }}
              />
            ),
          })
        }
      />
    </div>
  );

  const form = getFragmentData(formFragment, teamManage.joinForm);

  const fields: DynamicFieldData[] = [
    {
      fieldName: 'name',
      inputType: ControlType.Text,
      label: "Nom de l'équipe",
      defaultValue: teamManage.actor.name,
      placeholder: 'Nom',
    },
    {
      fieldName: 'tagline',
      inputType: ControlType.Text,
      label: 'Slogan',
      defaultValue: teamManage.tagline,
      placeholder: 'Slogan  ',
    },
    {
      fieldName: 'bio',
      inputType: ControlType.Text,
      label: 'À propos',
      defaultValue: teamManage?.actor?.bio,
      placeholder: 'Ajouter une description à votre équipe',
    },
  ];

  const avatar = { src: getAvatar(teamManage.actor.actorImages), rounded: AVATAR_TEAM_ROUNDED };
  const banner = { src: getBanner(teamManage.actor.actorImages) };
  const color = getColorHexFromData(teamManage.actor.name);
  const details = (
    <span className="flex items-center gap-1">
      <span className="font-semibold text-lg text-0">10 abonnés</span>•
      <span className="font-semibold text-lg text-0">15 abonnements</span>
    </span>
  );

  const manageSections = [
    {
      title: "Formulaire d'adhésion",
      children: form ? (
        <FormItem formId={form.id} name={form.name} createdAt={form.createdAt} updatedAt={form.updatedAt} />
      ) : (
        <div>Aucun formulaire d'adhésion</div>
      ),
    },
    // TODO: add TagInput
    // {
    //   title: 'Tags',
    //   children: <div>Tags</div>,
    // },
    {
      title: 'Brochure de présentation',
      children: <DocumentInput />,
    },
  ];

  const menus = [
    {
      key: TEAM_MANAGE_ROUTES.PROFILE,
      label: 'Profil',
      element: <MultiSection sections={manageSections} className="p-view" />,
    },
    {
      key: TEAM_MANAGE_ROUTES.TEAM_JOIN,
      label: 'Adhésions',
      element: <TeamJoinManageView />,
    },
    {
      key: TEAM_MANAGE_ROUTES.DOCUMENTS,
      label: 'Documents',
      element: <DocumentManageView />,
    },
    {
      key: TEAM_MANAGE_ROUTES.TREASURY,
      label: 'Trésorerie',
      element: <TreasuryManageView />,
    },
    {
      key: TEAM_MANAGE_ROUTES.EVENTS,
      label: 'Événements',
      element: <EventManageView />,
    },
    {
      key: TEAM_MANAGE_ROUTES.ROLES,
      label: 'Rôles',
      element: <div></div>,
    },
  ];

  return (
    <ProfileBase
      actorImageEdit={(image, actorImageType) => {
        if (teamManage) {
          const id = teamManage.id;
          if (image)
            updateTeam({
              variables: {
                ...(actorImageType === ActorImageType.Avatar ? { avatar: image } : { banner: image }),
                updateTeam: { id },
              },
            });
          else deactivateTeamImage({ variables: { id, actorImageType } });
        }
      }}
      avatar={avatar}
      banner={banner}
      color={color}
      tabs={menus}
      name={teamManage.actor.name}
      details={details}
      buttonList={buttonList}
      switchTabRoute={(tab) => TEAM_MANAGE_TAB_ROUTE(teamManage.actor?.slug, tab)}
    />
  );
}
