'use client';

import LegalUnitInput from '../../../molecules/Input/LegalUnit/LegalUnitInput';
import { Controller } from 'react-hook-form';
import type { TransactionFormStepProps } from './TransactionForm';

export default function TransactionCompanyStep({ methods: { formMethods } }: TransactionFormStepProps) {
  return (
    <div className="text-0 flex flex-col gap-4 max-w-[42rem]">
      <Controller
        control={formMethods.control}
        name="legalUnit"
        render={({ field }) => <LegalUnitInput name={field.name} onChange={field.onChange} value={field.value} />}
      />
    </div>
  );
}
