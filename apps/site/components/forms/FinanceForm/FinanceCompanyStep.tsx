import LegalUnitInput from '../../molecules/Input/LegalUnit/LegalUnitInput';

import type { FormStepContext } from '../../organisms/Form/MultiStepForm';
import type { financeFormDefaultValues } from './FinanceForm';

type Context = FormStepContext<typeof financeFormDefaultValues>;
type CompanyStep = { values: Context['values']; setValues: Context['setValues'] };

export default function FinanceCompanyStep({ values, setValues }: CompanyStep) {
  return (
    <div className="text-0 flex flex-col gap-4 max-w-[42rem]">
      <LegalUnitInput
        name="legalUnit"
        onQueryChange={(value) => setValues((values) => ({ ...values, legalUnitQuery: value }))}
        legalUnitQuery={values.legalUnitQuery}
        value={values.legalUnit}
        onChange={(value) => setValues((values) => ({ ...values, legalUnit: value }))}
      />
    </div>
  );
}
