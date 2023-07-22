import DateInput from '../../molecules/Input/DateInput';
import NumberInput from '../../molecules/Input/NumberInput';
import SelectInput from '../../molecules/Input/SelectInput';
import Skeleton from '../../atoms/Skeleton/Skeleton';
import TextInput from '../../molecules/Input/TextInput';

import { useTranslation } from '../../../hooks/context/useTranslation';
import { validateWebsite } from '../../../utils/form-validation/website';

import { FinanceCategory, PaymentMethod } from '@okampus/shared/enums';
import { TeamManageInfo, useTypedLazyQuery } from '@okampus/shared/graphql';

import { useEffect, useMemo } from 'react';

import type { FormStepContext } from '../../molecules/Form/MultiStepForm';
import type { transactionFormDefaultValues } from './TransactionForm';

type Context = FormStepContext<typeof transactionFormDefaultValues>;
type ReceiptStep = { teamManage: TeamManageInfo; values: Context['values']; setValues: Context['setValues'] };

export default function TransactionReceiptStep({ values, setValues }: ReceiptStep) {
  const { t } = useTranslation();

  const [processReceipt, { data, loading }] = useTypedLazyQuery(
    {
      processReceipt: [
        { key: values.fileUploadId || '' },
        {
          lineItems: { name: true, price: true, quantity: true },
          address: true,
          amount: true,
          date: true,
          vendorName: true,
          phone: true,
        },
      ],
    },
    { apolloOptions: { context: { useApi: true } } }
  );

  useEffect(() => {
    if (values.fileUploadId) processReceipt();
  }, [processReceipt, values.fileUploadId]);

  useEffect(() => {
    if (data) {
      let description = `Produits :\n\n`;
      data?.processReceipt?.lineItems.map(
        ({ name, price, quantity }) =>
          (description += `(${(price * quantity).toFixed(2)} €)${
            quantity > 1 ? (price ? ` ${price.toFixed(2)} € x ${quantity}` : ` ${quantity}`) : ''
          } ${name.replaceAll('\n', ' / ')}\n`)
      );
      if (data?.processReceipt?.phone) description += `\nTéléphone : ${data.processReceipt.phone}`;

      setValues({
        ...values,
        description,
        legalUnitQuery: data?.processReceipt?.vendorName || '',
        amount: data?.processReceipt?.amount?.toFixed(2) || '0',
        addressQuery: data?.processReceipt?.address || '',
        payedAt: (data?.processReceipt?.date && new Date(data.processReceipt.date)) || new Date(),
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
    [values.attachments]
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
              options={{ label: "Site de l'achat", name: 'name' }}
            />
          )}
        </div>
      )}
    </div>
  );
}
