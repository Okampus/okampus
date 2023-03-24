import { ProfileBase } from '../ProfileBase';

import { ReactComponent as EditOutlineIcon } from '@okampus/assets/svg/icons/material/outlined/edit.svg';

import { AVATAR_USER_ROUNDED, ME_ROUTES, ME_TAB_ROUTE } from '@okampus/shared/consts';
import { ControlType, ActorImageType } from '@okampus/shared/enums';
import { deactivateUserImageMutation, updateUserMutation } from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';
import { getColorHexFromData } from '@okampus/shared/utils';

import { GridLoader, ActionButton } from '@okampus/ui/atoms';
import { useMe, NavigationContext } from '@okampus/ui/hooks';
import { DynamicForm } from '@okampus/ui/organisms';
import { getAvatar, getBanner } from '@okampus/ui/utils';

import { useMutation } from '@apollo/client';

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import type { DynamicFieldData } from '@okampus/ui/organisms';

export function MyView() {
  const navigate = useNavigate();
  const { addNotification, showModal, hideModal } = useContext(NavigationContext);

  const [updateUser] = useMutation(updateUserMutation);
  const [deactivateUserImage] = useMutation(deactivateUserImageMutation);

  const { me } = useMe();
  if (!me || !me.actor) return <GridLoader />;

  const fields: DynamicFieldData[] = [
    {
      fieldName: 'status',
      inputType: ControlType.Text,
      label: 'Statut',
      defaultValue: me.status,
      placeholder: 'En ligne',
    },
  ];

  const publicRoute = `/user/${me.actor.slug}`;
  const buttonList = (
    <div className="flex gap-4 items-center">
      <ActionButton onClick={() => navigate(publicRoute)}>Profil public</ActionButton>
      <ActionButton
        icon={<EditOutlineIcon className="h-8 w-8" />}
        variant={ActionType.Do}
        onClick={() =>
          showModal({
            title: 'Modification de vos détails',
            content: (
              <DynamicForm
                fields={fields}
                onSubmit={(data) => {
                  if (me) {
                    updateUser({
                      variables: { updateUser: { id: me.id, ...data } },
                      onCompleted: () => {
                        hideModal();
                        addNotification({
                          message: 'Vos détails ont été mis à jour avec succès !',
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

  const avatar = { src: getAvatar(me.actor.actorImages), rounded: AVATAR_USER_ROUNDED };
  const banner = { src: getBanner(me.actor.actorImages) };
  const color = getColorHexFromData(me.actor.name);

  const details = (
    <span className="flex items-center gap-1">
      <span className="font-semibold text-lg text-0">10 abonnés</span>•
      <span className="font-semibold text-lg text-0">15 abonnements</span>
    </span>
  );

  const menus = [
    {
      key: ME_ROUTES.PROFILE,
      label: 'Profil',
      element: (
        <div className="h-full w-full flex items-center justify-center p-view text-0 font-semibold text-4xl pt-20">
          Aucune activité pour le moment.
        </div>
      ),
    },
  ];

  return (
    <ProfileBase
      actorImageEdit={(image, actorImageType) => {
        if (me) {
          const id = me.id;
          if (image)
            updateUser({
              variables: {
                ...(actorImageType === ActorImageType.Avatar ? { avatar: image } : { banner: image }),
                updateUser: { id },
              },
            });
          else deactivateUserImage({ variables: { id, actorImageType } });
        }
      }}
      color={color}
      tabs={menus}
      name={me.actor.name}
      avatar={avatar}
      banner={banner}
      details={details}
      buttonList={buttonList}
      switchTabRoute={ME_TAB_ROUTE}
    />
  );
}
