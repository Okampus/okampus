'use client';

import FileIcon from '../../../atoms/Icon/FileIcon';
import DateInput from '../../../molecules/Input/Uncontrolled/Date/DateInput';
import SelectInput from '../../../molecules/Input/Controlled/Select/SelectInput';
import ChangeSetToast from '../../../organisms/Form/ChangeSetToast';

// import { useUpdateTransactionMutation } from '@okampus/shared/graphql';
// import { ToastType } from '@okampus/shared/types';
import { bytes, parsePositiveNumber } from '@okampus/shared/utils';

import { Trash } from '@phosphor-icons/react';
import { PaymentMethod, TransactionType } from '@prisma/client';
// import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import type { TransactionMinimal } from '../../../../../types/prisma/Transaction/transaction-minimal';

const transactionUpdateFormSchema = z.object({
  amount: z.string().refine((value) => parsePositiveNumber(value), {
    message: 'Le montant doit être supérieur à 0.',
  }),
  // description: z.string().max(10_000, { message: 'La description ne peut pas dépasser 10 000 caractères.' }).nullable(),
  projectId: z.string().nullable(),
  eventId: z.string().nullable(),
  fileUploadId: z.string().nullable(),
  attachments: z.array(
    z.object({ id: z.bigint(), name: z.string(), size: z.number(), type: z.string(), url: z.string() }),
  ),
  isIncome: z.boolean(),
  liableTeamMemberId: z.string().nullable(),
  payedAt: z.date(),
  // type: z.nativeEnum(TransactionType).nullable(),
  paymentMethod: z.nativeEnum(PaymentMethod).nullable(),
});

type TransactionUpdateFormValues = z.infer<typeof transactionUpdateFormSchema>;

export type TransactionEditProps = { transaction: TransactionMinimal; isIncome: boolean };
export default function TransactionEdit({ transaction, isIncome }: TransactionEditProps) {
  const t = useTranslations();

  const defaultValues: TransactionUpdateFormValues = {
    amount: Math.abs(transaction.amount).toFixed(2),
    attachments: transaction.attachments,
    // type: transaction.type,
    // description: transaction.description,
    fileUploadId: null,
    isIncome,
    paymentMethod: transaction.paymentMethod,
    payedAt: transaction.payedAt ? new Date(transaction.payedAt) : new Date(),
    eventId: transaction.event?.id.toString() ?? null,
    projectId: transaction.project?.id.toString() ?? null,
    liableTeamMemberId: transaction.liableTeamMember?.id.toString() ?? null,
  };

  // const [updateTransaction] = useUpdateTransactionMutation();

  const { control, register, handleSubmit, formState, watch, reset } = useForm<TransactionUpdateFormValues>({
    defaultValues,
  });

  const onSubmit = handleSubmit((data) => {
    const { amount, payedAt, attachments: _, ...rest } = data;
    const update = {
      ...rest,
      ...(amount ? { amount: isIncome ? parsePositiveNumber(amount) : -(parsePositiveNumber(amount) || 0) } : {}),
      payedAt: payedAt.toISOString(),
    };
    // TODO: mutate
    // updateTransaction({
    //   variables: { update, id: transaction.id.toString() },
    //   onCompleted: () => setNotification({ type: ToastType.Success, message: 'Transaction modifiée !' }),
    //   onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
    // });
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
          {/*           < heading="Justificatifs" groupClassName="py-4"> */}
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
                <div>
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-underline line-clamp-1 underline"
                  >
                    {attachment.name}
                  </a>
                  <div className="text-sm text-2 font-medium">{bytes(attachment.size)}</div>
                </div>
              </div>
              <Trash />
            </div>
          ))}
          {/*           </> */}
          <hr className="border-[var(--border-2)] my-2" />
        </>
      )}
      <div className="flex flex-col gap-2">
        <DateInput {...register('payedAt')} label="Date de paiement" />
        <SelectInput
          control={control}
          error={formState.errors.paymentMethod?.message}
          options={Object.values(PaymentMethod).map((value) => ({
            label: t(`Enums.PaymentMethod.${value}`),
            value,
          }))}
          label="Méthode de paiement"
          name="paymentMethod"
        />
        <SelectInput
          options={Object.values(TransactionType).map((value) => ({
            label: t(`Enums.TransactionType.${value}`),
            value,
          }))}
          label="Catégorie de dépense"
          control={control}
          name="type"
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
  //           ? { amount: isIncome ? extractPositiveNumber(amount) : -(extractPositiveNumber(amount) || 0) }
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
  //                     <div>
  //                       <a
  //                         href={attachment.url}
  //                         target="_blank"
  //                         rel="noopener noreferrer"
  //                         className="button-underline line-clamp-1 underline"
  //                       >
  //                         {attachment.name}
  //                       </a>
  //                       <div className="text-sm text-2 font-medium">{bytes(attachment.size)}</div>
  //                     </div>
  //                   </div>
  //                   <Trash />
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
  //               label: t('enums', `PaymentMethod.${value}`)),
  //               value,
  //             }))}
  //             label="Méthode de paiement"
  //             name="method"
  //             value={values.method}
  //             onChange={(method) => changeValues((current) => ({ ...current, method }))}
  //           />
  //           <SelectInput
  //             options={Object.entries(TransactionType).map(([, value]) => ({
  //               label: t('enums', `TransactionType.${value}`)),
  //               value,
  //             }))}
  //             label="Catégorie de dépense"
  //             name="type"
  //             value={values.type}
  //             onChange={(type) => changeValues((current) => ({ ...current, type }))}
  //           />
  //         </GroupItem>
  //       </div>
  //     )}
  //   />
  // );
}
