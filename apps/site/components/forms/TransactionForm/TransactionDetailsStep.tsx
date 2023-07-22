import DateInput from '../../molecules/Input/DateInput';
import NumberInput from '../../molecules/Input/NumberInput';
import SelectInput from '../../molecules/Input/SelectInput';
import TextInput from '../../molecules/Input/TextInput';

import { useTranslation } from '../../../hooks/context/useTranslation';
import { validateWebsite } from '../../../utils/form-validation/website';

import { FinanceCategory, PaymentMethod } from '@okampus/shared/enums';

import type { transactionFormDefaultValues } from './TransactionForm';
import type { FormStepContext } from '../../molecules/Form/MultiStepForm';

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
      <NumberInput
        value={values.amount}
        onChange={(value) => setValues({ ...values, amount: value })}
        options={{ label: 'Montant de la dépense (€)', name: 'amount' }}
      />
      <DateInput
        className="w-full"
        date={values.payedAt}
        onChange={(date) => setValues({ ...values, payedAt: date })}
        options={{ label: 'Date de la transaction', name: 'payedAt' }}
      />
      <SelectInput
        items={methods}
        options={{ label: 'Méthode de paiement', name: 'method' }}
        value={values.method}
        onChange={(value) => setValues({ ...values, method: value })}
      />
      <SelectInput
        items={categories}
        options={{ label: 'Catégorie de dépense', name: 'category' }}
        value={values.category}
        onChange={(value) => setValues({ ...values, category: value })}
      />
      {values.isOnline && (
        <TextInput
          checkValueError={validateWebsite}
          value={values.website}
          onChange={(value) => setValues({ ...values, website: value })}
          options={{ label: 'Site', name: 'name' }}
        />
      )}
    </div>
  );
}
