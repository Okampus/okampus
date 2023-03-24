import { ControlType } from '@okampus/shared/enums';
import { createTeamJoinMutation, formFragment, getFragmentData } from '@okampus/shared/graphql';
import { ToastType } from '@okampus/shared/types';

import { NavigationContext, useTeam } from '@okampus/ui/hooks';
import { LabeledInput, SelectMenu } from '@okampus/ui/molecules';
import { DynamicForm } from '@okampus/ui/organisms';

import { RoleLabel } from '@okampus/ui/atoms';
import { useMutation } from '@apollo/client';

import { useContext, useState } from 'react';

import type { DynamicFieldData } from '@okampus/ui/organisms';

export function TeamJoinForm() {
  const { hideModal, addNotification } = useContext(NavigationContext);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const [createTeamJoin] = useMutation(createTeamJoinMutation);
  const { team } = useTeam();

  if (!team) return null;

  const joinForm = getFragmentData(formFragment, team.joinForm);
  const fields = joinForm.schema as DynamicFieldData[];
  const items = team.roles.map((role) => ({
    label: <RoleLabel color={role.color} label={role.name} />,
    value: role.id,
  }));

  return (
    <div className="flex flex-col gap-5">
      <LabeledInput
        label="Rôle"
        name="role"
        required={true}
        input={
          <SelectMenu
            value={selectedRole}
            items={items}
            placeholder={'Rôle souhaité'}
            name="role"
            onChange={(role) => setSelectedRole(role)}
          />
        }
      />
      <DynamicForm
        fields={fields}
        onSubmit={(data) => {
          if (selectedRole)
            createTeamJoin({
              variables: {
                teamJoin: {
                  teamId: team.id,
                  askedRoleId: selectedRole,
                  linkedFormEditId: joinForm.edits[joinForm.edits.length - 1].id,
                  submission: Object.entries(data).map(([key, value]) => ({
                    label: fields.find((field) => field.fieldName === key)?.label ?? key,
                    inputType: fields.find((field) => field.fieldName === key)?.inputType ?? ControlType.Text,
                    fieldName: key,
                    value,
                  })),
                },
              },
              onCompleted: () => {
                hideModal();
                addNotification({
                  type: ToastType.Success,
                  message: "Demande d'adhésion envoyée!",
                });
              },
              onError: (error) =>
                addNotification({
                  type: ToastType.Error,
                  message: error.message,
                }),
            });
        }}
      />
    </div>
  );
}
