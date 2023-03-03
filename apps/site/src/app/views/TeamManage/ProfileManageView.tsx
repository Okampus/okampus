import { ProfileBase } from '../ProfileBase';
import { ReactComponent as ShareOutlinedIcon } from '@okampus/assets/svg/icons/outlined/share.svg';

import { ActionButton, Banner, FormItem, GradientDark, GradientTransparent } from '@okampus/ui/atoms';
import { NavigationContext, useManageOrg, useMe } from '@okampus/ui/hooks';
import { AvatarEditor, ProfileSkeleton } from '@okampus/ui/molecules';
import { getAvatar, getBanner } from '@okampus/ui/utils';
import { DynamicForm } from '@okampus/ui/organisms';

import { ControlType } from '@okampus/shared/enums';
import { ActionType, ToastType } from '@okampus/shared/types';
import { getColorHexFromData } from '@okampus/shared/utils';

import {
  ActorImageType,
  deactivateTeamImageMutation,
  formFragment,
  getFragmentData,
  updateTeamMutation,
} from '@okampus/shared/graphql';

import { DocumentInput } from '#site/app/components/Input/DocumentInput';

import { useMutation } from '@apollo/client';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { DynamicFieldData } from '@okampus/ui/organisms';

export function ProfileManageView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { manageOrg } = useManageOrg();
  const { me } = useMe();
  const { addNotification, showModal, hideModal } = useContext(NavigationContext);

  const [updateTeam] = useMutation(updateTeamMutation);
  const [deactivateTeamImage] = useMutation(deactivateTeamImageMutation);

  const color = getColorHexFromData(manageOrg?.actor?.name);

  // const documents = manageOrg?.documents?.map((document) => document.type);

  // const teamMembers =
  //   manageOrg?.members?.map((member) => {
  //     return {
  //       name: member?.user?.firstName,
  //       role: member?.roles.map((role) => role.name).join(' / '),
  //       avatar: getAvatar(member?.user?.actor?.actorImages),
  //     };
  //   }) ?? [];

  // const isManager = manageOrg?.members
  //   ?.find((member) => member.user?.id === me?.id)
  //   ?.roles?.some((role) => role.permissions.includes(TeamPermissions.ManageTeam));

  const form = getFragmentData(formFragment, manageOrg?.joinForm);

  const fields: DynamicFieldData[] = [
    {
      fieldName: 'name',
      inputType: ControlType.Text,
      label: "Nom de l'équipe",
      defaultValue: manageOrg?.actor?.name,
      placeholder: 'Nom',
    },
    {
      fieldName: 'tagline',
      inputType: ControlType.Text,
      label: 'Slogan',
      defaultValue: manageOrg?.tagline,
      placeholder: 'Slogan  ',
    },
    {
      fieldName: 'bio',
      inputType: ControlType.Text,
      label: 'À propos',
      defaultValue: manageOrg?.actor?.bio,
      placeholder: 'Ajouter une description à votre équipe',
    },
  ];

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

  return manageOrg && manageOrg.actor ? (
    <ProfileBase
      color={color}
      name={manageOrg.actor.name}
      details={<div className="tagline">{manageOrg.tagline}</div>}
      type={manageOrg.type}
      avatarEdit={(avatar) => {
        if (manageOrg) {
          const id = manageOrg.id;
          if (avatar) updateTeam({ variables: { avatar, updateTeam: { id } } });
          else deactivateTeamImage({ variables: { id, actorImageType: ActorImageType.Avatar } });
        }
      }}
    >
      {/* Action list */}
      <div className="flex gap-4 items-center">
        <ActionButton onClick={() => navigate(`/org/${manageOrg?.actor?.slug}`)}>Voir le profil public</ActionButton>
        <ActionButton
          variant={ActionType.Do}
          icon={<ShareOutlinedIcon height={20} />}
          onClick={() => {
            navigator.clipboard.writeText(window.location.hostname + location.pathname);
            addNotification({
              message: 'Lien copié !',
              type: ToastType.Info,
            });
          }}
        >
          Partager le profil
        </ActionButton>
        <span className="font-semibold text-lg text-0">0 Followers</span>
      </div>
    </ProfileBase>
  ) : (
    <ProfileSkeleton />
  );

  return (
    <div className="flex flex-col">
      <div className="p-view flex gap-8 items-end relative">
        <GradientDark className="absolute inset-0">
          <Banner src={getBanner(manageOrg?.actor?.actorImages)} name={manageOrg?.actor?.name} />
        </GradientDark>
        <AvatarEditor
          avatar={{
            src: getAvatar(manageOrg?.actor?.actorImages),
            name: manageOrg?.actor?.name,
            size: 94,
            rounded: 8,
          }}
          onChange={(avatar) => {
            if (manageOrg) {
              const id = manageOrg.id;
              if (avatar) updateTeam({ variables: { avatar, updateTeam: { id } } });
              else deactivateTeamImage({ variables: { id, actorImageType: ActorImageType.Avatar } });
            }
          }}
        />
        <div className="text-white z-10 py-1.5">
          <div
            className="cursor-pointer"
            onClick={() =>
              showModal({
                title: "Modification des détails de l'équipe",
                content: (
                  <DynamicForm
                    fields={fields}
                    onSubmit={(data) => {
                      if (manageOrg) {
                        updateTeam({
                          variables: { updateTeam: { id: manageOrg.id, ...data } },
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
          >
            <div className="uppercase text-sm font-semibold tracking-wider opacity-95">Club</div>
            <div className="text-8xl font-title leading-tight font-bold tracking-tighter line-clamp-1 pr-1">
              {manageOrg?.actor?.name}
            </div>
            <div className="text-2xl font-semibold tracking-wide line-clamp-1">{manageOrg?.tagline}</div>
          </div>
        </div>
      </div>
      <div className="relative">
        <GradientTransparent className="absolute top-0 left-0 w-full h-72">
          <div className="absolute inset-0" style={{ backgroundColor: color }} />
        </GradientTransparent>
        {/* Action list */}
        <div className="absolute p-view-inner z-10 w-full flex gap-4 items-center">
          <ActionButton onClick={() => navigate(`/org/${manageOrg?.actor?.slug}`)}>Voir le profil public</ActionButton>
          <ActionButton
            variant={ActionType.Do}
            icon={<ShareOutlinedIcon height={20} />}
            onClick={() => {
              navigator.clipboard.writeText(window.location.hostname + location.pathname);
              addNotification({
                message: 'Lien copié !',
                type: ToastType.Info,
              });
            }}
          >
            Partager le profil
          </ActionButton>
          <span className="font-semibold text-lg">0 Followers</span>
        </div>
        {/* <div className="absolute p-view-inner z-10 w-full">
          <MultiSection sections={manageSections} />
        </div> */}
      </div>
    </div>
  );
}
