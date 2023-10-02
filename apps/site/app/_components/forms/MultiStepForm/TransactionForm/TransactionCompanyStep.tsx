'use client';

import LegalUnitInput from '../../../molecules/Input/LegalUnit/LegalUnitInput';
import FormStep from '../../../organisms/Form/FormStep';

import { Controller } from 'react-hook-form';
import type { TransactionFormStepProps } from './TransactionForm';

export default function TransactionCompanyStep(context: TransactionFormStepProps) {
  return (
    <FormStep context={context} header="Entreprise" nextStep="payedBy" validateFields={['legalUnit']}>
      <div className="text-0 flex flex-col gap-4 max-w-[42rem]">
        <Controller
          control={context.formMethods.control}
          name="legalUnit"
          render={({ field }) => <LegalUnitInput name={field.name} onChange={field.onChange} value={field.value} />}
        />
      </div>
    </FormStep>
  );
}
