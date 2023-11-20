'use client';

import CTAButton from '../../_components/molecules/Button/CTAButton';
import FormRenderer from '../../_components/organisms/FormRenderer';

import { useMe } from '../../_hooks/context/useMe';
import { useBottomSheet } from '../../_hooks/context/useBottomSheet';
import { ActionType } from '@okampus/shared/enums';

import type { ActionCTA } from '../../_components/molecules/Button/CTAButton';
import type { TeamDetails } from '../../../types/prisma/Team/team-details';

export type TeamButtonProps = { team: TeamDetails };
export default function TeamButton({ team }: TeamButtonProps) {
  const { data: me } = useMe();
  const { closeBottomSheet, openBottomSheet } = useBottomSheet();

  let action: ActionCTA;
  let type = ActionType.Action;
  let label = 'Adhésions fermées';
  let disabled = false;

  if (
    me.teamMemberships.some((member) => member.team.id === team.id) ||
    me.adminRoles.some((role) => role.canManageTenantEntities)
  ) {
    action = `/manage/team/${team.slug}`;
    label = `Gérer ${team.actor.name}`;
  } else if (me.teamJoins.some((join) => join.team.id === team.id)) {
    type = ActionType.Info;
    label = 'Adhésion en attente...';
    disabled = true;
  } else if (team.joinForm) {
    const form = team.joinForm;
    type = ActionType.Primary;
    label = 'Adhérer';
    action = () =>
      openBottomSheet({
        header: `Formulaire d'adhésion / ${team.actor.name}`,
        node: (
          <FormRenderer
            form={form}
            submit={(data) => {
              console.log(data);
              // do stuff
              closeBottomSheet();
            }}
          />
        ),
      });
  } else {
    type = ActionType.Info;
    disabled = true;
  }

  return (
    <CTAButton type={type} action={action}>
      {label}
    </CTAButton>
  );
}
