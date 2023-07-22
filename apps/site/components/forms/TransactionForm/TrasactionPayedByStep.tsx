import RadioInput from '../../molecules/Input/RadioInput';
import SelectInput from '../../molecules/Input/SelectInput';
import UserLabeled from '../../molecules/Labeled/UserLabeled';

import { useTranslation } from '../../../hooks/context/useTranslation';

import { PayedByType } from '@okampus/shared/enums';

import { useState } from 'react';

import type { transactionFormDefaultValues } from './TransactionForm';
import type { FormStepContext } from '../../molecules/Form/MultiStepForm';
import type { TeamManageInfo } from '@okampus/shared/graphql';

type Context = FormStepContext<typeof transactionFormDefaultValues>;
type PayedByStep = { teamManage: TeamManageInfo; values: Context['values']; setValues: Context['setValues'] };

export default function TransactionPayedByStep({ teamManage, values, setValues }: PayedByStep) {
  const { t } = useTranslation();

  const items = Object.keys(PayedByType).map((key) => ({ label: t(`enums.PayedByType.${key}`), value: key }));
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
          options={{ label: "Membre de l'équipe", name: 'payedBy' }}
          items={
            teamManage?.teamMembers.map((teamMember) => ({
              label: (
                <UserLabeled
                  individual={teamMember.user.individual}
                  id={teamMember.user.id}
                  showCardOnClick={false}
                  small={true}
                />
              ),
              value: teamMember.user.individual?.id,
            })) || []
          }
          value={values.initiatedById}
          onChange={(id) => setValues({ ...values, initiatedById: id as string })}
        />
      )}
    </div>
  );
}
