import { ApprovalState, updateTeamJoinMutation } from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';

import { ActionButton, RoleLabel } from '@okampus/ui/atoms';
import { NavigationContext, useTeamManage } from '@okampus/ui/hooks';
import { LabeledInput, SelectMenu } from '@okampus/ui/molecules';

import { useMutation } from '@apollo/client';
import { useContext, useState } from 'react';
import type { TeamJoinUser } from './TeamJoinManageView';

export function ValidateTeamJoinForm({ teamJoin, onSuccess }: { teamJoin: TeamJoinUser; onSuccess?: () => void }) {
  const { hideModal, addNotification } = useContext(NavigationContext);

  const [selectedRole, setSelectedRole] = useState<string>(teamJoin.join.askedRole.id);

  const [updateTeamJoin] = useMutation(updateTeamJoinMutation);
  const { teamManage } = useTeamManage();

  if (!teamManage || !teamManage.actor) return null;

  const items = teamManage.roles.map((role) => ({
    label: <RoleLabel color={role.color} label={role.name} />,
    value: role.id,
  }));

  const role = teamManage.roles.find((role) => role.id === selectedRole);

  return (
    <div className="flex flex-col gap-5">
      <LabeledInput
        label="Rôle attribué"
        name="role"
        required={true}
        input={
          <SelectMenu
            items={items}
            placeholder={'Rôle attribué'}
            name="role"
            value={selectedRole}
            onChange={(role) => setSelectedRole(role)}
          />
        }
      />
      <ActionButton
        className="flex gap-2 items-center"
        disabled={!selectedRole}
        variant={ActionType.Confirm}
        onClick={() => {
          if (selectedRole)
            updateTeamJoin({
              variables: {
                updateTeamJoin: {
                  id: teamJoin.join.id,
                  state: ApprovalState.Approved,
                  receivedRoleId: selectedRole,
                },
              },
              onCompleted: () => {
                hideModal();
                addNotification({
                  type: ToastType.Success,
                  message: `${teamJoin.joiner.actor?.name} a rejoint l'équipe ${teamManage.actor?.name} !`,
                });
                onSuccess?.();
              },
              onError: (error) =>
                addNotification({
                  type: ToastType.Error,
                  message: error.message,
                }),
            });
        }}
      >
        {role ? (
          <>
            Donner le rôle <RoleLabel color={role?.color} label={role?.name} /> à {teamJoin.joiner.actor?.name}{' '}
          </>
        ) : (
          <>Un rôle à attribuer doit être choisi</>
        )}
      </ActionButton>
    </div>
  );
}
