import { USER_ROUTE } from '@okampus/shared/consts';
import { ControlType } from '@okampus/shared/enums';
import { updateTeamManage } from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';

import { NavigationContext } from '@okampus/ui/hooks';
import { ActionButton } from '@okampus/ui/molecules';
import { FormModal } from '@okampus/ui/organisms';

import { useMutation } from '@apollo/client';
import { useContext } from 'react';

import type { TeamManageInfo } from '@okampus/shared/graphql';

export type TeamManageSidePanelProps = { teamManage: TeamManageInfo };
export function TeamManageSidePanel({ teamManage }: TeamManageSidePanelProps) {
  const { setNotification, showOverlay, hideOverlay } = useContext(NavigationContext);
  const [updateTeam] = useMutation(updateTeamManage);

  const fields = [
    {
      name: 'name',
      type: ControlType.Text,
      label: "Nom de l'équipe",
      default: teamManage.actor?.name,
      placeholder: 'Nom',
    },
    {
      name: 'tagline',
      type: ControlType.Text,
      label: 'Slogan',
      default: teamManage.tagline,
      placeholder: 'Slogan  ',
    },
    {
      name: 'bio',
      type: ControlType.Text,
      label: 'À propos',
      default: teamManage.actor?.bio,
      placeholder: 'Ajouter une description à votre équipe',
    },
  ] as const;

  if (!teamManage || !teamManage.actor) return null;

  return (
    <div className="grid gap-4 my-2 grid-cols-2 w-full">
      <ActionButton
        className="w-full"
        action={{
          label: 'Vue publique',
          type: ActionType.Action,
          linkOrActionOrMenu: `${USER_ROUTE(teamManage.actor.slug)}`,
        }}
      />
      <ActionButton
        className="w-full"
        action={{
          label: "Paramètres de l'équipe",
          type: ActionType.Action,
          linkOrActionOrMenu: () =>
            showOverlay(
              <FormModal
                title="Modification de vos détails"
                schema={fields}
                submitOptions={{
                  label: 'Modifier',
                  type: ActionType.Action,
                  onSubmit: (data) => {
                    updateTeam({
                      variables: { updateTeam: { id: teamManage.id, ...data } },
                      onCompleted: () => {
                        hideOverlay();
                        setNotification({
                          message: 'Les détails de l’équipe ont été mis à jour',
                          type: ToastType.Success,
                        });
                      },
                    });
                  },
                }}
              />
            ),
        }}
      />
    </div>
  );
}
