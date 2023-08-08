'use client';

import GroupItem from '../../../../components/atoms/Item/GroupItem';
import FileIcon from '../../../../components/atoms/Icon/FileIcon';
import DateInput from '../../../molecules/Input/Date/DateInput';
import SelectInput from '../../../../components/molecules/Input/SelectInput';
import ChangeSetToast from '../../../../components/organisms/Form/ChangeSetToast';

import { notificationAtom } from '../../../../context/global';
import { useTranslation } from '../../../../hooks/context/useTranslation';
// import { useForm } from '../../../../hooks/form/useForm';

import { PaymentMethod, FinanceCategory } from '@okampus/shared/enums';
import { updateFinanceMutation } from '@okampus/shared/graphql';
import { ToastType } from '@okampus/shared/types';
import { bytes, extractPositiveNumber } from '@okampus/shared/utils';

import { useMutation } from '@apollo/client';
import { IconTrash } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';

import type { FinanceBaseInfo } from '@okampus/shared/graphql';

export type FinanceEditProps = { finance: FinanceBaseInfo; isRevenue: boolean };
export default function FinanceEdit({ finance, isRevenue }: FinanceEditProps) {
  const [, setNotification] = useAtom(notificationAtom);

  const { t } = useTranslation();

  const defaultValues = {
    payedAt: new Date(finance.payedAt).toISOString(),
    amount: Math.abs(finance.amount).toFixed(2),
    method: finance.method,
    category: finance.category,
    attachments: finance.financeAttachments.map((attachment) => attachment.fileUpload),
  };

  const [updateFinance] = useMutation(updateFinanceMutation);

  const { register, setValue, handleSubmit, formState, watch, reset } = useForm({
    defaultValues,
  });

  const onSubmit = handleSubmit((data) => {
    const { amount, attachments: _, ...rest } = data;
    const update = {
      ...rest,
      ...(amount ? { amount: isRevenue ? extractPositiveNumber(amount) : -(extractPositiveNumber(amount) || 0) } : {}),
    };
    updateFinance({
      // @ts-ignore
      variables: { update, id: finance.id },
      onCompleted: () => setNotification({ type: ToastType.Success, message: 'Transaction modifiée !' }),
      onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
    });
  });

  // const { errors, register, setValue, values, onSubmit, loading, reset, changed } = useForm({
  //   defaultValues,
  //   submit: async (data) => {
  //     const { amount, attachments: _, ...rest } = data;
  //     const update = {
  //       ...rest,
  //       ...(amount
  //         ? { amount: isRevenue ? extractPositiveNumber(amount) : -(extractPositiveNumber(amount) || 0) }
  //         : {}),
  //     };
  //     updateFinance({
  //       // @ts-ignore
  //       variables: { update, id: finance.id },
  //       onCompleted: () => setNotification({ type: ToastType.Success, message: 'Transaction modifiée !' }),
  //       onError: (error) => setNotification({ type: ToastType.Error, message: error.message }),
  //     });
  //   },
  // });

  const attachments = watch('attachments');
  const method = watch('method');
  const category = watch('category');

  return (
    <form onSubmit={onSubmit} className="py-4 flex flex-col gap-2">
      <ChangeSetToast changed={formState.isDirty} errors={{}} loading={[]} onCancel={reset} />

      {attachments.length > 0 && (
        <>
          <GroupItem heading="Justificatifs" groupClassName="py-4">
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
          </GroupItem>
          <hr className="border-[var(--border-2)] my-2" />
        </>
      )}
      <GroupItem heading="Informations">
        <DateInput {...register('method')} label="Date de paiement" />
        {/* <NumberInput
          value={values.amount}
          onChange={(amount) => {
            changeValues((current) => ({ ...current, amount }));
          }}
          label={`Montant de la dépense (€)`}
          name="amount"
        /> */}
        <SelectInput
          options={Object.entries(PaymentMethod).map(([, value]) => ({
            label: t(`enums.PaymentMethod.${value}`),
            value,
          }))}
          label="Méthode de paiement"
          name="method"
          value={method}
          onChange={(method) => setValue('method', method as string)}
        />
        <SelectInput
          options={Object.entries(FinanceCategory).map(([, value]) => ({
            label: t(`enums.FinanceCategory.${value}`),
            value,
          }))}
          label="Catégorie de dépense"
          name="category"
          value={category}
          onChange={(category) => setValue('category', category as string)}
        />
      </GroupItem>
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
  //       updateFinance({
  //         // @ts-ignore
  //         variables: { update, id: finance.id },
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
  //             options={Object.entries(FinanceCategory).map(([, value]) => ({
  //               label: t(`enums.FinanceCategory.${value}`),
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
