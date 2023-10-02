'use client';

import DateInput from '../../../molecules/Input/Date/DateInput';
import DocumentInput from '../../../molecules/Input/File/DocumentInput';
import SelectInput from '../../../molecules/Input/Select/SelectInput';
import Skeleton from '../../../atoms/Skeleton/Skeleton';
import TextInput from '../../../molecules/Input/TextInput';
import FormStep from '../../../organisms/Form/FormStep';

import { notificationAtom } from '../../../../_context/global';
import { trpcClient } from '../../../../_context/trpcClient';
import { useTranslation } from '../../../../_hooks/context/useTranslation';
import { getS3Url } from '../../../../../utils/s3/get-s3-url';

import { TransactionCategory, PaymentMethod, OCRBucketNames, S3Providers } from '@okampus/shared/enums';
import { ToastType } from '@okampus/shared/types';

import { useAtom } from 'jotai';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

import type { TransactionFormStepProps } from './TransactionForm';

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

export default function TransactionDetailsStep(context: TransactionFormStepProps) {
  const [, setNotification] = useAtom(notificationAtom);
  const { control, register, watch, setValue, formState } = context.formMethods;
  const isOnline = watch('isOnline');

  const [isUploading, setIsUploading] = useState(false);

  const { t } = useTranslation();

  const { data, isLoading, error } = trpcClient.getOcrPresignedUrl.useQuery({ bucket: OCRBucketNames.Receipts });
  const processReceipt = trpcClient.processReceipt.useMutation({
    onSettled: (processedReceipt, error) => {
      if (error) return setNotification({ type: ToastType.Error, message: error.message });
      if (!processedReceipt)
        return setNotification({
          type: ToastType.Error,
          message: 'Une erreur est survenue. Veuillez réessayer plus tard.',
        });

      const { address, amount, date, lineItems, phone, vendorName } = processedReceipt;
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
      setIsUploading(false);
    },
  });

  const receipt = watch('receipt');

  const methods = Object.entries(PaymentMethod).map(([, value]) => ({
    label: t(`enums.PaymentMethod.${value}`),
    value,
  }));

  const categories = Object.entries(TransactionCategory).map(([, value]) => ({
    label: t(`enums.TransactionCategory.${value}`),
    value,
  }));

  if (isUploading) {
    return (
      <FormStep
        context={context}
        header="Reçu ou justificatif principal"
        footer={
          receipt
            ? { right: { label: 'Continuer', onClick: () => setIsUploading(false) } }
            : {
                right: {
                  label: "Je n'ai pas de justificatif principal",
                  isSkip: true,
                  onClick: () => {
                    setIsUploading(false);
                    setValue('receipt', null);
                  },
                },
              }
        }
      >
        {isLoading || !data ? (
          <Skeleton height="35rem" width="35rem" />
        ) : (
          <DocumentInput
            presignedUrl={data}
            onUploaded={(upload) => {
              if (upload) {
                setValue('receipt', { fileUploadId: upload.fileUploadId, key: upload.key });
                processReceipt.mutate(upload.fileUploadId);
              } else setValue('receipt', null);
            }}
          />
        )}
      </FormStep>
    );
  }

  const receiptUrl = receipt
    ? getS3Url({ provider: S3Providers.OCR, bucket: OCRBucketNames.Receipts, key: receipt.key })
    : null;

  return (
    <FormStep context={context} header="Détails de la transaction" nextStep="company">
      <div className="w-full flex gap-6 md-max:flex-col">
        {receiptUrl ? (
          <div className="shrink-0 w-[32rem] aspect-square overflow-scroll rounded-2xl self-center">
            <embed className="w-[32rem] min-h-[100%]" src={receiptUrl} />
          </div>
        ) : null}
        {isLoading ? (
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
            <DateInput
              error={formState.errors.amount?.message}
              label="Date de la transaction"
              {...register('payedAt')}
            />
            <Controller
              control={control}
              name="method"
              render={({ field }) => (
                <SelectInput
                  error={formState.errors.method?.message}
                  options={methods}
                  label="Méthode de paiement"
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={field.value}
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
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            {isOnline && (
              <TextInput error={formState.errors.website?.message} label="Site de l'achat" {...register('website')} />
            )}
          </div>
        )}
      </div>
    </FormStep>
  );
}
