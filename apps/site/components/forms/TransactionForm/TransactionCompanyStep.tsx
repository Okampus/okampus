import LegalUnitInput from '../../molecules/Input/LegalUnitInput';

import type { FormStepContext } from '../../molecules/Form/MultiStepForm';
import type { transactionFormDefaultValues } from './TransactionForm';

type Context = FormStepContext<typeof transactionFormDefaultValues>;
type CompanyStep = { values: Context['values']; setValues: Context['setValues'] };

export default function TransactionCompanyStep({ values, setValues }: CompanyStep) {
  return (
    <div className="text-0 flex flex-col gap-4 max-w-[42rem]">
      <LegalUnitInput
        autoFocus={true}
        onQueryChange={(value) => setValues((values) => ({ ...values, legalUnitQuery: value }))}
        legalUnitQuery={values.legalUnitQuery}
        value={values.legalUnit}
        onChange={(value) => setValues((values) => ({ ...values, legalUnit: value }))}
      />
    </div>
  );
}
