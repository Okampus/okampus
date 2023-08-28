'use client';

import DateInput from '../../../molecules/Input/Date/DateInput';
import SelectInput from '../../../molecules/Input/Select/SelectInput';
import Skeleton from '../../../atoms/Skeleton/Skeleton';
import TextInput from '../../../molecules/Input/TextInput';

import { useTranslation } from '../../../../hooks/context/useTranslation';
import { useProcessReceiptLazyQuery } from '@okampus/shared/graphql';
import { FinanceCategory, PaymentMethod } from '@okampus/shared/enums';

import { useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';

import type { FinanceFormStepProps } from './FinanceForm';

function getDescriptionFromLineItems(lineItems?: { name: string; quantity: number; price: number }[]) {
  if (lineItems) {
    let description = 'Produits:\n\n';
    for (const { name, price, quantity } of lineItems) {
      const totalPrice = (price * quantity).toFixed(2);
      const totalQuantity = price && quantity > 1 ? `${price.toFixed(2)} € x ${quantity}` : quantity;
      const formattedName = name.replaceAll('\n', ' / ');
      description += `(${totalPrice} €) ${totalQuantity} - ${formattedName}\n`;
    }

    return description + `\n`;
  }

  return '';
}

export default function FinanceReceiptStep({ methods: { formMethods } }: FinanceFormStepProps) {
  const { control, register, watch, setValue, formState } = formMethods;

  const attachments = watch('attachments');
  const isOnline = watch('isOnline');
  const fileUploadId = watch('fileUploadId');

  const { t } = useTranslation();

  const [processReceipt, { data, loading }] = useProcessReceiptLazyQuery({ context: { useApi: true } });

  useEffect(() => {
    if (fileUploadId) processReceipt({ variables: { key: fileUploadId } });
  }, [processReceipt, fileUploadId]);

  useEffect(() => {
    if (data) {
      const { address, amount, date, lineItems, phone, vendorName } = data?.processReceipt ?? {};
      let description = getDescriptionFromLineItems(lineItems);
      if (vendorName) {
        description += `Vendeur: ${vendorName}\n`;
        setValue('legalUnitQuery', vendorName);
      }

      if (phone) description += `Téléphone: ${phone}\n`;
      if (address) setValue('addressQuery', address);
      if (date) setValue('payedAt', new Date(date));
      if (amount) setValue('amount', amount.toFixed(2));

      setValue('description', description);
    }
  }, [data, setValue]);

  const methods = Object.entries(PaymentMethod).map(([, value]) => ({
    label: t(`enums.PaymentMethod.${value}`),
    value,
  }));

  const categories = Object.entries(FinanceCategory).map(([, value]) => ({
    label: t(`enums.FinanceCategory.${value}`),
    value,
  }));

  const src = useMemo(() => (attachments.length > 0 ? URL.createObjectURL(attachments[0]) : ''), [attachments]);

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
            error={formState.errors.amount?.message}
            label="Montant de la dépense (€)"
            {...register('amount')}
          />
          <DateInput error={formState.errors.amount?.message} label="Date de la transaction" {...register('payedAt')} />
          <Controller
            control={control}
            name="method"
            render={({ field }) => (
              <SelectInput
                error={formState.errors.method?.message}
                options={methods}
                label="Méthode de paiement"
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <SelectInput
                error={formState.errors.category?.message}
                options={categories}
                label="Catégorie de dépense"
                {...field}
              />
            )}
          />
          {isOnline && (
            <TextInput error={formState.errors.website?.message} label="Site de l'achat" {...register('website')} />
          )}
        </div>
      )}
    </div>
  );
}
