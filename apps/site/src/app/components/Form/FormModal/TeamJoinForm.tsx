import { ApprovalState, ControlType } from '@okampus/shared/enums';
import { insertTeamJoin } from '@okampus/shared/graphql';

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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [createTeamJoin] = useMutation(insertTeamJoin);

  const { currentUser } = useCurrentUser();
  if (!team) return null;

  const roleOptions = team.roles.map((role) => ({ label: role.name, value: role.id as string }));
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
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                object: {
                  teamId: team.id,
                  createdById: currentUser?.individualById?.id,
                  tenantId: team.tenantId,
                  askedRoleId: role,
                  joinerId: currentUser?.id,
                  state: ApprovalState.Pending,
                  formSubmission: {
                    data: {
                      formId: team.form?.id,
                      tenantId: team.tenantId,
                      createdById: currentUser?.individualById?.id,
                      submission: Object.entries(insertTeamJoin).map(([key, value]) => ({ slug: key, value })),
                    },
                  },
                },
              },
              onCompleted: ({ insertTeamJoinOne: data }) => {
                if (!currentUser) return;
                mergeCache(
                  { __typename: 'UserInfo', id: currentUser.id },
                  { fieldName: 'teamJoins', fragmentOn: 'TeamJoin', data }
                );
                setNotification({ type: ToastType.Success, message: `Demande d'adhésion envoyée!` });
                hideOverlay();
              },
              onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
            });
        },
      }}
    />
  );
}
