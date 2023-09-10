'use client';

import DateInput from '../../../molecules/Input/Date/DateInput';
import SelectInput from '../../../molecules/Input/Select/SelectInput';
import TextInput from '../../../molecules/Input/TextInput';
import { useTranslation } from '../../../../hooks/context/useTranslation';

import { TransactionCategory, PaymentMethod } from '@okampus/shared/enums';

import { Controller } from 'react-hook-form';
import type { TransactionFormStepProps } from './TransactionForm';

export default function TransactionDetailsStep({ methods: { formMethods } }: TransactionFormStepProps) {
  const { control, register, watch, formState } = formMethods;

  const isOnline = watch('isOnline');

  const { t } = useTranslation();
  const methods = Object.entries(PaymentMethod).map(([, value]) => ({
    label: t(`enums.PaymentMethod.${value}`),
    value,
  }));

  const categories = Object.entries(TransactionCategory).map(([, value]) => ({
    label: t(`enums.TransactionCategory.${value}`),
    value,
  }));

  return (
    <div className="text-0 flex flex-col gap-4 max-w-[42rem]">
      <TextInput error={formState.errors.amount?.message} label="Montant de la dépense (€)" {...register('amount')} />
      <DateInput error={formState.errors.payedAt?.message} label="Date de la transaction" {...register('payedAt')} />
      <Controller
        control={control}
        name="method"
        render={({ field }) => (
          <SelectInput
            error={formState.errors.method?.message}
            options={methods}
            label="Méthode de paiement"
            name={field.name}
            onBlur={field.onBlur}
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <SelectInput
            error={formState.errors.category?.message}
            options={categories}
            label="Catégorie de dépense"
            name={field.name}
            onBlur={field.onBlur}
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />
      {isOnline && (
        <TextInput
          error={formState.errors.website?.message}
          label="Site internet lié à la dépense"
          {...register('website')}
        />
      )}
    </div>
  );
}
