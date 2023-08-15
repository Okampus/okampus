import DateInput from '../../molecules/Input/Date/DateInput';
// import NumberInput from '../../molecules/Input/NumberInput';
import SelectInput from '../../molecules/Input/Select/SelectInput';
import Skeleton from '../../atoms/Skeleton/Skeleton';
import TextInput from '../../molecules/Input/TextInput';

import { useTranslation } from '../../../hooks/context/useTranslation';
// import { validateWebsite } from '../../../utils/form-validation/website';

import { useProcessReceiptLazyQuery } from '@okampus/shared/graphql';
import { FinanceCategory, PaymentMethod } from '@okampus/shared/enums';

import { useEffect, useMemo } from 'react';

import type { transactionFormDefaultValues } from './TransactionForm';
import type { FormStepContext } from '../../organisms/Form/MultiStepForm';
import type { TeamManageInfo } from '../../../context/navigation';

type Context = FormStepContext<typeof transactionFormDefaultValues>;
type ReceiptStep = { teamManage: TeamManageInfo; values: Context['values']; setValues: Context['setValues'] };

export default function TransactionReceiptStep({ values, setValues }: ReceiptStep) {
  const { t } = useTranslation();

  const [processReceipt, { data, loading }] = useProcessReceiptLazyQuery({ context: { useApi: true } });

  useEffect(() => {
    if (values.fileUploadId) processReceipt({ variables: { key: values.fileUploadId } });
  }, [processReceipt, values.fileUploadId]);

  useEffect(() => {
    if (data) {
      let description = `Produits :\n\n`;
      data?.processReceipt?.lineItems.map(
        ({ name, price, quantity }) =>
          (description += `(${(price * quantity).toFixed(2)} €)${
            quantity > 1 ? (price ? ` ${price.toFixed(2)} € x ${quantity}` : ` ${quantity}`) : ''
          } ${name.replaceAll('\n', ' / ')}\n`),
      );
      if (data?.processReceipt?.phone) description += `\nTéléphone : ${data.processReceipt.phone}`;

      setValues({
        ...values,
        description,
        legalUnitQuery: data?.processReceipt?.vendorName || '',
        amount: data?.processReceipt?.amount?.toFixed(2) || '0',
        addressQuery: data?.processReceipt?.address || '',
        payedAt: data?.processReceipt?.date ?? '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const methods = Object.entries(PaymentMethod).map(([, value]) => ({
    label: t(`enums.PaymentMethod.${value}`),
    value,
  }));

  const categories = Object.entries(FinanceCategory).map(([, value]) => ({
    label: t(`enums.FinanceCategory.${value}`),
    value,
  }));

  const src = useMemo(
    () => (values.attachments.length > 0 ? URL.createObjectURL(values.attachments[0]) : ''),
    [values.attachments],
  );

  return (
    <div className="w-full flex gap-6 md-max:flex-col">
      <div className="shrink-0 w-[32rem] aspect-square overflow-scroll rounded-2xl self-center">
        <embed className="w-[32rem] min-h-[100%]" src={src} />
      </div>
      {loading ? (
        <div className="w-[32rem] shrink-0 flex flex-col gap-4">
          <Skeleton height={18} width={'full'} />
          <Skeleton height={18} width={'full'} />
          <Skeleton height={112} width={'full'} />
        </div>
      ) : (
        <div className="text-0 flex flex-col gap-4 max-w-[42rem]">
          <TextInput
            // value={values.amount}
            onChange={(event) => setValues({ ...values, amount: event.target.value })}
            label="Montant de la dépense (€)"
            name="amount"
          />
          <DateInput
            className="w-full"
            // date={values.payedAt}
            onChange={(event) => setValues({ ...values, payedAt: event.target.value })}
            label="Date de la transaction"
            name="payedAt"
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
              label="Site de l'achat"
              name="name"
            />
          )}
        </div>
      )}
    </div>
  );
}
