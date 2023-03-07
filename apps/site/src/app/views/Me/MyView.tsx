import { ErrorPage } from '../ErrorPage';
import { ProfileBase } from '../ProfileBase';
import { MyRoute } from '#site/app/menus';

import { ReactComponent as EditOutlineIcon } from '@okampus/assets/svg/icons/outlined/edit.svg';
import { AVATAR_USER_ROUNDED } from '@okampus/shared/consts';
import { ControlType, ActorImageType } from '@okampus/shared/enums';
import { deactivateUserImageMutation, updateUserMutation } from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';
import { getColorHexFromData } from '@okampus/shared/utils';
import { GridLoader, ActionButton } from '@okampus/ui/atoms';
import { useMe, NavigationContext } from '@okampus/ui/hooks';
import { getAvatar, getBanner } from '@okampus/ui/utils';
import { DynamicForm } from '@okampus/ui/organisms';
import { useMutation } from '@apollo/client';
import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import type { DynamicFieldData } from '@okampus/ui/organisms';

export function MyView() {
  const { tab } = useParams<{ tab: MyRoute }>();
  if (!tab || !Object.values(MyRoute).includes(tab)) return <ErrorPage />;
  return <MyViewWrapping tab={tab} />;
}

export function MyViewWrapping({ tab }: { tab: MyRoute }) {
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

  return (
    <ProfileBase
      buttonList={buttonList}
      color={color}
      name={me.actor.name}
      type={me.scopeRole}
      avatar={avatar}
      banner={banner}
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
      details={details}
    >
      <div className="h-full w-full flex items-center justify-center px-view text-0 font-semibold text-4xl pt-20">
        Aucune activité pour le moment.
      </div>
    </ProfileBase>
  );
}
