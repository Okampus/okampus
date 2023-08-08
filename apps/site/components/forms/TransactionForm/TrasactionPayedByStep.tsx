import RadioInput from '../../molecules/Input/Selector/RadioInput';
import SelectInput from '../../molecules/Input/SelectInput';
import UserLabeled from '../../molecules/Labeled/UserLabeled';

import { useTranslation } from '../../../hooks/context/useTranslation';

import FieldSet from '../../molecules/Input/FieldSet';
import { PayedByType } from '@okampus/shared/enums';

import type { transactionFormDefaultValues } from './TransactionForm';
import type { FormStepContext } from '../../organisms/Form/MultiStepForm';
import type { TeamManageInfo } from '@okampus/shared/graphql';

type Context = FormStepContext<typeof transactionFormDefaultValues>;
type PayedByStep = { teamManage: TeamManageInfo; values: Context['values']; setValues: Context['setValues'] };

export default function TransactionPayedByStep({ teamManage, values, setValues }: PayedByStep) {
  const { t } = useTranslation();

  const items = Object.keys(PayedByType).map((key) => ({ label: t(`enums.PayedByType.${key}`), value: key }));

  const options = teamManage.teamMembers.map((teamMember) => ({
    label: (
      <UserLabeled
        individual={teamMember.user.individual}
        id={teamMember.user.id}
        showCardOnClick={false}
        small={true}
      />
    ),
    value: teamMember.user.individual.id,
  }));

  return (
    <div className="flex flex-col gap-4">
      <FieldSet label="Qui a payé cette transaction ?">
        {items.map(({ label, value }) => (
          <RadioInput
            defaultValue={value}
            key={value}
            label={label}
            name="payedByType"
            onChange={(event) => setValues({ ...values, payedByType: event.target.value as PayedByType })}
          />
        ))}
      </FieldSet>

      {values.payedByType === PayedByType.Manual && (
        <SelectInput
          label="Membre de l'équipe"
          name="payedBy"
          options={options}
          value={values.initiatedById}
          onChange={(id) => setValues({ ...values, initiatedById: id as string })}
        />
      )}
    </div>
  );
}
