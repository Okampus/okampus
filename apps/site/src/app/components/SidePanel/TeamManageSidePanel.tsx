import { USER_ROUTE } from '@okampus/shared/consts';
import { ControlType } from '@okampus/shared/enums';
import { updateTeamMutation } from '@okampus/shared/graphql';
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
  const [updateTeam] = useMutation(updateTeamMutation);

  const fields = [
    {
      name: 'name',
      type: ControlType.Text,
      label: "Nom de l'équipe",
      default: teamManage.actor?.name,
      placeholder: 'Nom',
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
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      variables: { id: teamManage.id, update: data },
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
