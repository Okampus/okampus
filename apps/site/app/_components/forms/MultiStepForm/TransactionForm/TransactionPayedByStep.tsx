'use client';

import FormStep from '../../../../_components/organisms/Form/FormStep';
import FieldSet from '../../../molecules/Input/FieldSet';
import RadioInput from '../../../molecules/Input/Selector/RadioInput';
import SelectInput from '../../../molecules/Input/Select/SelectInput';
import UserLabeled from '../../../molecules/Labeled/UserLabeled';

import { useTranslation } from '../../../../_hooks/context/useTranslation';

import { ProcessedByType } from '@okampus/shared/enums';

import { Controller } from 'react-hook-form';

import type { TransactionFormStepProps } from './TransactionForm';

export default function TransactionPayedByStep(context: TransactionFormStepProps) {
  const { control, register, watch, formState } = context.formMethods;
  const processedByType = watch('processedByType');

  const { t } = useTranslation();

  const items = Object.keys(processedByType).map((key) => ({
    label: t('enums', `processedByType.${key}`),
    value: key,
  }));
  const options = context.data.teamManage.teamMembers.map(({ user }) => ({
    label: <UserLabeled user={user} showCardOnClick={false} small={true} />,
    value: user.id,
  }));

  return (
    <FormStep
      context={context}
      contentClassName="flex flex-col gap-4"
      header="Gestionnaire de la transaction"
      nextStep="summary"
      validateFields={['processedByType']}
    >
      <FieldSet label="Qui a géré cette transaction ?" error={formState.errors.processedByType?.message}>
        {items.map(({ label, value }) => (
          <RadioInput {...register('processedByType')} key={value} label={label} />
        ))}
      </FieldSet>

      {processedByType === ProcessedByType.Manual && (
        <Controller
          control={control}
          name="processedById"
          render={({ field }) => (
            <SelectInput
              error={formState.errors.processedById?.message}
              label="Membre de l'équipe"
              options={options}
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
      )}
    </FormStep>
  );
}
