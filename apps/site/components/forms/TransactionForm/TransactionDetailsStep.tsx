import DateInput from '../../molecules/Input/Date/DateInput';
// import NumberInput from '../../molecules/Input/NumberInput';
import SelectInput from '../../molecules/Input/SelectInput';
import TextInput from '../../molecules/Input/TextInput';

import { useTranslation } from '../../../hooks/context/useTranslation';
// import { validateWebsite } from '../../../utils/form-validation/website';

import { FinanceCategory, PaymentMethod } from '@okampus/shared/enums';

import type { transactionFormDefaultValues } from './TransactionForm';
import type { FormStepContext } from '../../organisms/Form/MultiStepForm';

type Context = FormStepContext<typeof transactionFormDefaultValues>;
type DetailsStep = { values: Context['values']; setValues: Context['setValues'] };

export default function TransactionDetailsStep({ values, setValues }: DetailsStep) {
  const { t } = useTranslation();
  const methods = Object.entries(PaymentMethod).map(([, value]) => ({
    label: t(`enums.PaymentMethod.${value}`),
    value,
  }));

  const categories = Object.entries(FinanceCategory).map(([, value]) => ({
    label: t(`enums.FinanceCategory.${value}`),
    value,
  }));

  return (
    <div className="text-0 flex flex-col gap-4 max-w-[42rem]">
      <TextInput
        value={values.amount}
        onChange={(event) => setValues({ ...values, amount: event.target.value })}
        label="Montant de la dépense (€)"
        name="amount"
      />
      <DateInput
        label="Date de la transaction"
        name="payedAt"
        className="w-full"
        onChange={(event) => setValues({ ...values, payedAt: event.target.value })}
      />
      <SelectInput
        options={methods}
        label="Méthode de paiement"
        name="method"
        value={values.method}
        onChange={(value) => setValues({ ...values, method: value as PaymentMethod })}
      />
      <SelectInput
        options={categories}
        label="Catégorie de dépense"
        name="category"
        value={values.category}
        onChange={(value) => setValues({ ...values, category: value as FinanceCategory })}
      />
      {values.isOnline && (
        <TextInput
          // checkValueError={validateWebsite}
          value={values.website}
          onChange={(event) => setValues({ ...values, website: event.target.value })}
          label="Site"
          name="name"
        />
      )}
    </div>
  );
}
