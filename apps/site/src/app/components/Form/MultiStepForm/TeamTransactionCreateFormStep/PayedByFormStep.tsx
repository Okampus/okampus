import { RadioInput, SelectInput, UserItem } from '@okampus/ui/molecules';
import { PayedByType } from '@okampus/shared/enums';
import { useTeamManage } from '@okampus/ui/hooks';
import { getAvatar } from '@okampus/ui/utils';
import { useState } from 'react';

import type { teamTransactionCreateDefaultValues } from './default';
import type { FormStepContext } from '@okampus/ui/organisms';

type Context = FormStepContext<typeof teamTransactionCreateDefaultValues>;
type PayedByFormProps = { values: Context['values']; setValues: Context['setValues'] };

export const payedByLabel = {
  [PayedByType.Unknown]: 'Responsable inconnu',
  [PayedByType.Automatic]: 'Dépense automatique (abonnement, prélèvement...)',
  [PayedByType.Manual]: "Membre de l'équipe",
};

export function PayedByFormStep({ values, setValues }: PayedByFormProps) {
  const { teamManage } = useTeamManage();

  const items = Object.entries(payedByLabel).map(([key, value]) => ({ label: value, value: key }));
  const [payedByTypeIndex, setPayedByTypeIndex] = useState(
    items.findIndex(({ value }) => value === values.payedByType)
  );

  return (
    <div className="flex flex-col gap-4">
      <RadioInput
        items={items}
        selected={payedByTypeIndex}
        options={{ label: 'Qui a payé cette transaction ?', name: 'payedByType' }}
        onChange={(index) => {
          setPayedByTypeIndex(index);
          setValues({ ...values, payedByType: items[index].value as PayedByType });
        }}
      />
      {values.payedByType === PayedByType.Manual && (
        <SelectInput
          options={{ label: 'Membre de l’équipe', name: 'payedBy' }}
          items={
            teamManage?.teamMembers.map((teamMember) => ({
              label: (
                <UserItem
                  name={teamMember.userInfo.individualById?.actor?.name || ''}
                  avatar={{
                    src: getAvatar(teamMember.userInfo.individualById?.actor?.actorImages),
                    size: 7,
                  }}
                />
              ),
              value: teamMember.userInfo.individualById?.actor?.id,
            })) || []
          }
          value={values.payedById}
          onChange={(id) => setValues({ ...values, payedById: id as string })}
        />
      )}
    </div>
  );
}
