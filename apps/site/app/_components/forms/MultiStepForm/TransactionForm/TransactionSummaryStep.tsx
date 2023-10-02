'use client';

import DateInput from '../../../molecules/Input/Date/DateInput';
import LegalUnitInput from '../../../molecules/Input/LegalUnit/LegalUnitInput';
import SelectInput from '../../../molecules/Input/Select/SelectInput';
import TextAreaInput from '../../../molecules/Input/TextAreaInput';
import TextInput from '../../../molecules/Input/TextInput';
import UserLabeled from '../../../molecules/Labeled/UserLabeled';
import FormStep from '../../../../_components/organisms/Form/FormStep';

import { useTranslation } from '../../../../_hooks/context/useTranslation';

import { getS3Url } from '../../../../../utils/s3/get-s3-url';
import {
  TransactionCategory,
  ProcessedByType,
  PaymentMethod,
  S3Providers,
  OCRBucketNames,
} from '@okampus/shared/enums';

import { Controller } from 'react-hook-form';
import type { TransactionFormStepProps } from './TransactionForm';

export default function TransactionSummaryStep(context: TransactionFormStepProps) {
  const { control, register, watch, formState } = context.formMethods;

  const { t } = useTranslation();

  const projectId = watch('projectId');
  const processedByType = watch('processedByType');

  const selectedProject = context.data.teamManage.projects.find(({ id }) => id === projectId) ?? null;
  const receipt = watch('receipt');

  const paymentMethods = Object.entries(PaymentMethod).map(([, value]) => ({
    label: t(`enums.PaymentMethod.${value}`),
    value,
  }));

  const processedByTypes = Object.entries(ProcessedByType).map(([, value]) => ({
    label: t(`enums.processedByType.${value}`),
    value,
  }));

  const receiptUrl = receipt
    ? getS3Url({ provider: S3Providers.OCR, bucket: OCRBucketNames.Receipts, key: receipt.key })
    : null;

  return (
    <FormStep context={context} header="Récapitulatif" footer={{ right: { label: 'Créer la transaction' } }}>
      <div className="w-full flex gap-4 md-max:flex-col">
        <div className="flex flex-col gap-4">
          {receiptUrl && (
            <div className="shrink-0 w-[25rem] aspect-square overflow-scroll rounded-2xl self-center">
              <embed className="w-[25rem] min-h-[100%]" src={receiptUrl} />
            </div>
          )}
          <div className="grid grid-cols-[9rem,1fr]">
            <TextInput error={formState.errors.amount?.message} label="Montant" {...register('amount')} />
            <Controller
              control={control}
              name="method"
              render={({ field }) => (
                <SelectInput
                  error={formState.errors.method?.message}
                  label="Méthode de paiement"
                  options={paymentMethods}
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name="processedByType"
            render={({ field }) => (
              <SelectInput
                error={formState.errors.amount?.message}
                options={processedByTypes}
                label="Qui a payé la transaction ?"
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />

          {processedByType === ProcessedByType.Manual && (
            <Controller
              control={control}
              name="processedById"
              render={({ field }) => (
                <SelectInput
                  error={formState.errors.processedById?.message}
                  label="Membre de l'équipe"
                  options={
                    context.data.teamManage.teamMembers.map((teamMember) => ({
                      label: <UserLabeled user={teamMember.user} showCardOnClick={false} small={true} />,
                      value: teamMember.user?.id,
                    })) || []
                  }
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          )}
        </div>
        <div className="flex flex-col gap-4 md:w-[35rem]">
          <div>
            <div className="text-[var(--text-1)] font-semibold text-xs pl-3 pb-1">Entreprise</div>
            <Controller
              control={control}
              name="legalUnit"
              render={({ field }) => (
                <LegalUnitInput
                  error={formState.errors.legalUnit?.message}
                  label="Entreprise"
                  name={field.name}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          </div>
          <DateInput
            error={formState.errors.payedAt?.message}
            label="Date de la transaction"
            {...register('payedAt')}
          />
          <Controller
            control={control}
            name="projectId"
            render={({ field }) => (
              <SelectInput
                error={formState.errors.projectId?.message}
                label="Projet lié"
                options={[
                  { label: 'Dépenses générales', value: null },
                  ...(context.data.teamManage.projects.map((item) => ({ label: item.name, value: item.id })) ?? []),
                ]}
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />
          <Controller
            control={control}
            name="projectId"
            render={({ field }) => (
              <SelectInput
                options={[
                  { label: 'Dépenses générales', value: null },
                  ...(context.data.teamManage.projects.map((item) => ({ label: item.name, value: item.id })) ?? []),
                ]}
                label="Projet lié"
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />
          {selectedProject && (
            <Controller
              control={control}
              name="eventId"
              render={({ field }) => (
                <SelectInput
                  options={[
                    { label: 'Dépenses hors-événement', value: null },
                    ...(selectedProject.eventOrganizes.map(({ event }) => ({
                      label: event?.name,
                      value: event.id,
                    })) ?? []),
                  ]}
                  label="Événement lié"
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
          )}
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <SelectInput
                error={formState.errors.category?.message}
                label="Catégorie de dépense"
                options={Object.entries(TransactionCategory).map(([, value]) => ({
                  label: t(`enums.TransactionCategory.${value}`),
                  value,
                }))}
                name={field.name}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />
          <TextAreaInput label="Description" className="!h-56 input py-2 tabular-nums" {...register('description')} />
        </div>
      </div>
    </FormStep>
  );
}
