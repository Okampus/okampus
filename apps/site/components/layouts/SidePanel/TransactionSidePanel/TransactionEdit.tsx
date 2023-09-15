'use client';

import SimpleList from '../../../molecules/List/SimpleList';
import FileIcon from '../../../atoms/Icon/FileIcon';
import DateInput from '../../../molecules/Input/Date/DateInput';
import SelectInput from '../../../molecules/Input/Select/SelectInput';
import ChangeSetToast from '../../../organisms/Form/ChangeSetToast';

import { notificationAtom } from '../../../../context/global';
import { useTranslation } from '../../../../hooks/context/useTranslation';

import { useUpdateTransactionMutation } from '@okampus/shared/graphql';
import { PaymentMethod, TransactionCategory, InitiatedByType } from '@okampus/shared/enums';
import { ToastType } from '@okampus/shared/types';
import { bytes, parsePositiveNumber } from '@okampus/shared/utils';

import { IconTrash } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import type { TransactionMinimalInfo } from '../../../../types/features/transaction.info';
import type { LegalUnitMinimalInfo } from '../../../../types/features/legal-unit.info';

const transactionUpdateFormSchema = z.object({
  amount: z.string().refine((value) => parsePositiveNumber(value), {
    message: 'Le montant doit être supérieur à 0.',
  }),
  description: z.string().max(10_000, { message: 'La description ne peut pas dépasser 10 000 caractères.' }),
  projectId: z.string().nullable(),
  eventId: z.string().nullable(),
  fileUploadId: z.string().nullable(),
  attachments: z.array(
    z.object({ id: z.string(), name: z.string(), size: z.number(), type: z.string(), url: z.string() }),
  ),
  isRevenue: z.boolean(),
  legalUnit: z.any().nullable() as z.ZodType<LegalUnitMinimalInfo | null>,
  legalUnitQuery: z.string(),
  initiatedById: z.string().nullable(),
  initiatedByType: z.nativeEnum(InitiatedByType),
  payedAt: z.date(),
  category: z.nativeEnum(TransactionCategory),
  method: z.nativeEnum(PaymentMethod),
});

type TransactionUpdateFormValues = z.infer<typeof transactionUpdateFormSchema>;

export type TransactionEditProps = { transaction: TransactionMinimalInfo; isRevenue: boolean };
export default function TransactionEdit({ transaction, isRevenue }: TransactionEditProps) {
  const [, setNotification] = useAtom(notificationAtom);

  const { t } = useTranslation();

  const defaultValues: TransactionUpdateFormValues = {
    amount: Math.abs(transaction.amount).toFixed(2),
    attachments: transaction.transactionAttachments.map(({ attachment }) => attachment),
    category: transaction.category as TransactionCategory,
    description: transaction.description,
    fileUploadId: null,
    isRevenue,
    method: transaction.method as PaymentMethod,
    payedAt: new Date(transaction.payedAt),
    initiatedByType: transaction.initiatedByType as InitiatedByType,
    eventId: transaction.event?.id ?? null,
    projectId: transaction.project?.id ?? null,
    legalUnit: transaction.legalUnit ?? null,
    legalUnitQuery: transaction.legalUnit?.legalName ?? '',
    initiatedById: transaction.initiatedBy?.id ?? null,
  };

  const [updateTransaction] = useUpdateTransactionMutation();

  const { control, register, handleSubmit, formState, watch, reset } = useForm<TransactionUpdateFormValues>({
    defaultValues,
  });

  const onSubmit = handleSubmit((data) => {
    const { amount, payedAt, attachments: _, ...rest } = data;
    const update = {
      ...rest,
      ...(amount ? { amount: isRevenue ? parsePositiveNumber(amount) : -(parsePositiveNumber(amount) || 0) } : {}),
      payedAt: payedAt.toISOString(),
    };
    updateTransaction({
      variables: { update, id: transaction.id },
      onCompleted: () => setNotification({ type: ToastType.Success, message: 'Transaction modifiée !' }),
      onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
    });
  });

  const attachments = watch('attachments');

  return (
    <form onSubmit={onSubmit} className="py-4 flex flex-col gap-2">
      <ChangeSetToast
        isDirty={formState.isDirty}
        isValid={formState.isValid}
        isLoading={formState.isSubmitting}
        onCancel={() => reset(defaultValues)}
      />

      {attachments.length > 0 && (
        <>
          <SimpleList heading="Justificatifs" groupClassName="py-4">
            {/* <SingleFileInput
                options={{
                  label: 'Ajouter un justificatif',
                  name: 'attachment',
                }}
              /> */}
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex options-center justify-between gap-4 px-2">
                <div className="flex gap-4">
                  <FileIcon className="h-11" type={attachment.type} name={attachment.name} />
                  <div className="flex flex-col">
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="add-button line-clamp-1 underline"
                    >
                      {attachment.name}
                    </a>
                    <div className="text-sm text-2 font-medium">{bytes(attachment.size)}</div>
                  </div>
                </div>
                <IconTrash />
              </div>
            ))}
          </SimpleList>
          <hr className="border-[var(--border-2)] my-2" />
        </>
      )}
      <div className="flex flex-col gap-2">
        <DateInput {...register('payedAt')} label="Date de paiement" />
        <Controller
          control={control}
          name="method"
          render={({ field }) => (
            <SelectInput
              error={formState.errors.method?.message}
              options={Object.entries(PaymentMethod).map(([, value]) => ({
                label: t(`enums.PaymentMethod.${value}`),
                value,
              }))}
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
              options={Object.entries(TransactionCategory).map(([, value]) => ({
                label: t(`enums.TransactionCategory.${value}`),
                value,
              }))}
              label="Catégorie de dépense"
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
      </div>
    </form>
  );
  // return (
  //   <ChangeSetForm
  //     checkFields={[]}
  //     onSave={(data) => {
  //       const { amount, attachments: _, ...rest } = data;
  //       const update = {
  //         ...rest,
  //         ...(amount
  //           ? { amount: isRevenue ? extractPositiveNumber(amount) : -(extractPositiveNumber(amount) || 0) }
  //           : {}),
  //       };
  //       updateTransaction({
  //         // @ts-ignore
  //         variables: { update, id: transaction.id },
  //         onCompleted: () => setNotification({ type: ToastType.Success, message: 'Transaction modifiée !' }),
  //         onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
  //       });
  //     }}
  //     initialValues={initialState}
  //     renderChildren={({ changeValues, values }) => (
  //       <div className="py-4 flex flex-col gap-2">
  //         {values.attachments.length > 0 && (
  //           <>
  //             <GroupItem heading="Justificatifs" groupClassName="py-4">
  //               {/* <SingleFileInput
  //               options={{
  //                 label: 'Ajouter un justificatif',
  //                 name: 'attachment',
  //               }}
  //             /> */}
  //               {values.attachments.map((attachment) => (
  //                 <div key={attachment.id} className="flex options-center justify-between gap-4 px-2">
  //                   <div className="flex gap-4">
  //                     <FileIcon className="h-11" type={attachment.type} name={attachment.name} />
  //                     <div className="flex flex-col">
  //                       <a
  //                         href={attachment.url}
  //                         target="_blank"
  //                         rel="noopener noreferrer"
  //                         className="add-button line-clamp-1 underline"
  //                       >
  //                         {attachment.name}
  //                       </a>
  //                       <div className="text-sm text-2 font-medium">{bytes(attachment.size)}</div>
  //                     </div>
  //                   </div>
  //                   <IconTrash />
  //                 </div>
  //               ))}
  //             </GroupItem>
  //             <hr className="border-[var(--border-2)] my-2" />
  //           </>
  //         )}
  //         <GroupItem heading="Informations">
  //           <DateInput
  //             className="w-full"
  //             label="Date de paiement"
  //             name="payedAt"
  //             defaultValue={values.payedAt}
  //             onChange={(payedAt) => changeValues((current) => ({ ...current, payedAt }))}
  //           />
  //           <NumberInput
  //             value={values.amount}
  //             onChange={(amount) => {
  //               changeValues((current) => ({ ...current, amount }));
  //             }}
  //             label={`Montant de la dépense (€)`}
  //             name="amount"
  //           />
  //           <SelectInput
  //             options={Object.entries(PaymentMethod).map(([, value]) => ({
  //               label: t(`enums.PaymentMethod.${value}`),
  //               value,
  //             }))}
  //             label="Méthode de paiement"
  //             name="method"
  //             value={values.method}
  //             onChange={(method) => changeValues((current) => ({ ...current, method }))}
  //           />
  //           <SelectInput
  //             options={Object.entries(TransactionCategory).map(([, value]) => ({
  //               label: t(`enums.TransactionCategory.${value}`),
  //               value,
  //             }))}
  //             label="Catégorie de dépense"
  //             name="category"
  //             value={values.category}
  //             onChange={(category) => changeValues((current) => ({ ...current, category }))}
  //           />
  //         </GroupItem>
  //       </div>
  //     )}
  //   />
  // );
}
