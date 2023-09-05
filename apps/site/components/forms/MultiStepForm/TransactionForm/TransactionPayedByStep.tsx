'use client';

import RadioInput from '../../../molecules/Input/Selector/RadioInput';
import SelectInput from '../../../molecules/Input/Select/SelectInput';
import UserLabeled from '../../../molecules/Labeled/UserLabeled';

import { useTranslation } from '../../../../hooks/context/useTranslation';

import FieldSet from '../../../molecules/Input/FieldSet';
import { InitiatedByType } from '@okampus/shared/enums';

import { Controller } from 'react-hook-form';

import type { TransactionFormStepProps } from './TransactionForm';

export default function TransactionPayedByStep({
  methods: { formMethods },
  context: { teamManage },
}: TransactionFormStepProps) {
  const { control, register, watch, formState } = formMethods;
  const payedByType = watch('payedByType');

  const { t } = useTranslation();

  const items = Object.keys(InitiatedByType).map((key) => ({ label: t(`enums.PayedByType.${key}`), value: key }));
  const options = teamManage.teamMembers.map(({ user }) => ({
    label: <UserLabeled user={user} showCardOnClick={false} small={true} />,
    value: user.id,
  }));

  return (
    <div className="flex flex-col gap-4">
      <FieldSet label="Qui a payé cette transaction ?" error={formState.errors.payedByType?.message}>
        {items.map(({ label, value }) => (
          <RadioInput {...register('payedByType')} key={value} label={label} />
        ))}
      </FieldSet>

      {payedByType === InitiatedByType.Manual && (
        <Controller
          control={control}
          name="initiatedById"
          render={({ field }) => (
            <SelectInput
              error={formState.errors.initiatedById?.message}
              label="Membre de l'équipe"
              options={options}
              {...field}
            />
          )}
        />
      )}
    </div>
  );
}
