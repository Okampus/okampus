import { ApprovalState, ControlType } from '@okampus/shared/enums';
import { insertTeamJoin } from '@okampus/shared/graphql';

import { RoleBadge } from '@okampus/ui/atoms';
import { FormModal } from '@okampus/ui/organisms';

import { mergeCache } from '#site/app/utils/apollo/merge-cache';

import { ActionType, ToastType } from '@okampus/shared/types';
import { NavigationContext, useCurrentUser } from '@okampus/ui/hooks';

import { useMutation } from '@apollo/client';
import { useContext } from 'react';

import type { FormSchema } from '@okampus/shared/types';
import type { TeamWithMembersInfo } from '@okampus/shared/graphql';

export type TeamJoinFormProps = { team?: TeamWithMembersInfo };
export function TeamJoinForm({ team }: TeamJoinFormProps) {
  const { hideOverlay, setNotification } = useContext(NavigationContext);
  const [createTeamJoin] = useMutation(insertTeamJoin);

  const { currentUser } = useCurrentUser();
  if (!team) return null;

  const roleOptions = team.roles.map((role) => ({ label: <RoleBadge role={role} />, value: role.id as string }));
  const fields = [
    { name: 'role', label: 'Rôle', type: ControlType.Select, options: roleOptions, isRequired: true },
    ...((team.form?.schema ?? []) as FormSchema),
  ] as const;

  return (
    <FormModal
      schema={fields}
      title={`Rejoindre ${team.actor?.name}`}
      submitOptions={{
        label: 'Soumettre mon adhésion',
        type: ActionType.Action,
        onSubmit: ({ role, ...data }) => {
          const insertTeamJoin = Object.entries(data);
          if (role)
            createTeamJoin({
              variables: {
                insert: {
                  teamId: team.id as string,
                  createdById: currentUser?.individualById?.id as string,
                  tenantId: team.tenantId,
                  askedRoleId: role,
                  joinerId: currentUser?.id,
                  state: ApprovalState.Pending,
                  formSubmission: {
                    data: {
                      createdById: currentUser?.individualById?.id as string,
                      tenantId: team.tenantId,
                      formEditId: team.form?.formEdits?.[0]?.id,
                      submission: Object.entries(insertTeamJoin).map(([key, value]) => ({ slug: key, value })),
                    },
                  },
                },
              },
              onCompleted: ({ insertTeamJoinOne: data }) => {
                const id = currentUser?.id as string;
                mergeCache({ __typename: 'UserInfo', id }, { fieldName: 'teamJoins', fragmentOn: 'TeamJoin', data });
                setNotification({ type: ToastType.Success, message: `Demande d'adhésion envoyée!` });
                hideOverlay();
              },
              onError: (error) =>
                setNotification({
                  type: ToastType.Error,
                  message: error.message,
                }),
            });
        },
      }}
    />
  );
}
