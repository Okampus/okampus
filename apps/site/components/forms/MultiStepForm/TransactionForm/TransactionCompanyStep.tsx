'use client';

import LegalUnitInput from '../../../molecules/Input/LegalUnit/LegalUnitInput';
import { Controller } from 'react-hook-form';
import type { TransactionFormStepProps } from './TransactionForm';

// type Context = FormStepContext<typeof transactionFormDefaultValues>;
// type CompanyStep = { values: Context['values']; setValues: Context['setValues'] };

export default function TransactionCompanyStep({ methods: { formMethods } }: TransactionFormStepProps) {
  return (
    <div className="text-0 flex flex-col gap-4 max-w-[42rem]">
      <Controller
        control={formMethods.control}
        name="legalUnit"
        render={({ field }) => (
          <LegalUnitInput
            {...field}
            // onQueryChange={(value) => setValues((values) => ({ ...values, legalUnitQuery: value }))}
            // legalUnitQuery={values.legalUnitQuery}
            // value={values.legalUnit}
            // onChange={(value) => setValues((values) => ({ ...values, legalUnit: value }))}
          />
        )}
      />
    </div>
  );
}
