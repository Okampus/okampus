import { PayedByFormStep } from './PayedByFormStep';
import { SummaryFormStep } from './SummaryFormStep';
import { Buckets, PaymentMethod } from '@okampus/shared/enums';
import { useTypedLazyQuery } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import { Skeleton } from '@okampus/ui/atoms';
import { ActionButton, DateInput, DocumentInput, NumberInput, SelectInput, TextInput } from '@okampus/ui/molecules';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import type { teamTransactionCreateDefaultValues } from './default';
import type { FormStepContext } from '@okampus/ui/organisms';

type Context = FormStepContext<typeof teamTransactionCreateDefaultValues>;
type ReceiptUploadProps = { values: Context['values']; setValues: Context['setValues'] };
export function ReceiptUpload({ values, setValues }: ReceiptUploadProps) {
  const [processReceipt, { data, loading }] = useTypedLazyQuery({
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
  });

  useEffect(() => {
    if (values.fileUploadId) processReceipt();
  }, [processReceipt, values.fileUploadId]);

  useEffect(() => {
    if (data) {
      let description = `${data?.processReceipt?.vendorName} - Produits :\n\n`;
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
        name: data?.processReceipt?.vendorName || '',
        amount: data?.processReceipt?.amount || 0,
        addressQuery: data?.processReceipt?.address || '',
        payedAt: (data?.processReceipt?.date && new Date(data.processReceipt.date)) || new Date(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const src = values.file ? URL.createObjectURL(values.file) : '';
  return (
    <div className="w-full flex gap-6 md-max:flex-col">
      <div className="shrink-0 w-[42rem] aspect-square overflow-scroll rounded-2xl self-center">
        <embed className="w-[42rem] min-h-[100%]" src={src} />
      </div>
      {loading ? (
        <div className="w-[42rem] shrink-0 flex flex-col gap-4">
          <Skeleton height={18} width={'full'} />
          <Skeleton height={18} width={'full'} />
          <Skeleton height={112} width={'full'} />
        </div>
      ) : (
        <ReceiptUploadFormStep setValues={setValues} values={values} />
      )}
    </div>
  );
}

type ReceiptUploadFormStepProps = { values: Context['values']; setValues: Context['setValues'] };
export function ReceiptUploadFormStep({ values, setValues }: ReceiptUploadFormStepProps) {
  const { t } = useTranslation();

  // const [search, { data }] = useTypedLazyQuery({
  //   searchLocation: [
  //     { query: values.addressQuery },
  //     {
  //       id: true,
  //       name: true,
  //       city: true,
  //       zip: true,
  //       country: true,
  //       state: true,
  //       street: true,
  //       coordinates: { latitude: true, longitude: true },
  //     },
  //   ],
  // });

  // useEffect(() => {
  //   if (values.addressQuery) search();
  // }, [search, values.addressQuery]);

  return (
    <div className="text-0 flex flex-col gap-4 max-w-[42rem]">
      <TextInput
        value={values.name}
        onChange={(value) => setValues({ ...values, name: value })}
        options={{ label: 'Nom de la transaction', name: 'name' }}
      />
      <NumberInput
        value={values.amount}
        onChange={(value) => setValues({ ...values, amount: value })}
        options={{ label: 'Montant de la dépense', name: 'amount' }}
      />

      <DateInput
        className="w-full"
        date={values.payedAt}
        onChange={(date) => setValues({ ...values, payedAt: date })}
        options={{ label: 'Date de la transaction', name: 'payedAt' }}
      />
      <SelectInput
        items={Object.entries(PaymentMethod).map(([, value]) => ({ label: t(value), value }))}
        options={{ label: 'Méthode de paiement', name: 'method' }}
        value={values.method}
        onChange={(value) => setValues({ ...values, method: value })}
      />

      {/* <SearchInput
        options={{ label: 'Lieu de la dépense', name: 'location' }}
        items={(data?.searchLocation ?? []).map((item) => ({ label: <TextAddress address={item} />, value: item }))}
        value={values.addressItem}
        onChangeValue={(address) => setValues({ ...values, addressItem: address })}
        query={values.addressQuery}
        onChangeQuery={(query) => setValues({ ...values, addressQuery: query })}
      /> */}
    </div>
  );
}

export const receiptUploadFormStep = {
  header: 'Justificatif de paiement',
  onEnter: ({ values, setValues }: Context) => setValues({ ...values, fileUploadId: null }),
  content: ({ values, setValues, goToNextStep }: Context) => (
    <DocumentInput
      bucket={Buckets.Receipts}
      onChange={(id, file) => {
        setValues({ ...values, fileUploadId: id, file });
        id && goToNextStep(0);
      }}
    />
  ),
  footer: ({ goToNextStep }: Context) => (
    <ActionButton
      action={{
        type: ActionType.Action,
        label: "Je n'ai pas de justificatif de paiement",
        linkOrActionOrMenu: () => goToNextStep(1),
      }}
    />
  ),
  nextSteps: [
    {
      header: 'Détails de la transaction',
      content: ({ values, setValues }: Context) => <ReceiptUpload values={values} setValues={setValues} />,
      // header: 'Contexte de la transaction',
      footer: ({ goToNextStep }: Context) => (
        <ActionButton
          action={{ type: ActionType.Success, label: 'Continuer', linkOrActionOrMenu: () => goToNextStep(0) }}
        />
      ),
      nextSteps: [
        {
          header: 'Responsable de la transaction',
          content: ({ values, setValues }: Context) => <PayedByFormStep values={values} setValues={setValues} />,
          footer: ({ goToNextStep }: Context) => (
            <ActionButton
              action={{ type: ActionType.Success, label: 'Continuer', linkOrActionOrMenu: () => goToNextStep(0) }}
            />
          ),
          nextSteps: [
            {
              header: 'Récapitulatif',
              content: ({ values, setValues }: Context) => <SummaryFormStep values={values} setValues={setValues} />,
              footer: ({ values, onSubmit }: Context) => (
                <ActionButton
                  action={{
                    type: ActionType.Success,
                    label: 'Créer la transaction',
                    // linkOrActionOrMenu: () => onSubmit(values),
                    linkOrActionOrMenu: () => onSubmit(values),
                  }}
                />
              ),
            },
          ],
        },
      ],
    },
  ],
};
