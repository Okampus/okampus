import { USER_ROUTE } from '@okampus/shared/consts';
import { ControlType } from '@okampus/shared/enums';
import { updateMe } from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';

import { NavigationContext, useCurrentUser } from '@okampus/ui/hooks';
import { ActionButton } from '@okampus/ui/molecules';
import { FormModal } from '@okampus/ui/organisms';

import { useMutation } from '@apollo/client';
import { useContext } from 'react';

import type { FormSchema } from '@okampus/shared/types';

export function MySidePanel() {
  const { setNotification, showOverlay, hideOverlay } = useContext(NavigationContext);
  const [updateUser] = useMutation(updateMe);

  const { currentUser } = useCurrentUser();

  const fields = [
    {
      name: 'status',
      type: ControlType.Text,
      label: 'Statut',
      default: currentUser?.individualById?.status,
      placeholder: 'En ligne',
    },
  ] as FormSchema;

  if (!currentUser || !currentUser?.individualById?.actor) return null;

  return (
    <div className="grid gap-4 my-2 grid-cols-2 w-full">
      <ActionButton
        className="w-full"
        action={{
          label: 'Voir mon profil public',
          type: ActionType.Action,
          linkOrActionOrMenu: `${USER_ROUTE(currentUser.individualById.actor.slug)}`,
        }}
      />
      <ActionButton
        className="w-full"
        action={{
          label: 'Gérer mon profil',
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
                    updateUser({
                      variables: { updateUser: { id: currentUser.id, ...data } },
                      onCompleted: () => {
                        hideOverlay();
                        setNotification({
                          message: 'Vos détails ont été mis à jour avec succès !',
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
