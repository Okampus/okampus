import DateInput from '../../molecules/Input/Date/DateInput';
import LegalUnitInput from '../../molecules/Input/LegalUnit/LegalUnitInput';
import SelectInput from '../../molecules/Input/Select/SelectInput';
import TextAreaInput from '../../molecules/Input/TextAreaInput';
import TextInput from '../../molecules/Input/TextInput';
import UserLabeled from '../../molecules/Labeled/UserLabeled';

import { useTranslation } from '../../../hooks/context/useTranslation';

import { FinanceCategory, PayedByType, PaymentMethod } from '@okampus/shared/enums';

import { useMemo } from 'react';
import { Controller } from 'react-hook-form';

import type { FinanceFormStepProps } from './FinanceForm';

export default function FinanceSummaryStep({
  methods: { formMethods },
  context: { teamManage },
}: FinanceFormStepProps) {
  const { control, register, watch, formState } = formMethods;

  const { t } = useTranslation();

  const projectId = watch('projectId');
  const payedByType = watch('payedByType');
  const attachments = watch('attachments');

  const selectedProject = teamManage.projects.find((project) => project.id === projectId) ?? null;
  const src = useMemo(() => (attachments ? URL.createObjectURL(attachments[0]) : ''), [attachments]);

  const paymentMethods = Object.entries(PaymentMethod).map(([, value]) => ({
    label: t(`enums.PaymentMethod.${value}`),
    value,
  }));
  const payedByTypes = Object.entries(PayedByType).map(([, value]) => ({
    label: t(`enums.PayedByType.${value}`),
    value,
  }));

  return (
    <div className="w-full flex gap-4 md-max:flex-col">
      <div className="flex flex-col gap-4">
        <div className="shrink-0 w-[25rem] aspect-square overflow-scroll rounded-2xl self-center">
          <embed className="w-[25rem] min-h-[100%]" src={src} />
        </div>
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
                {...field}
              />
            )}
          />
        </div>

        <Controller
          name="payedByType"
          control={control}
          render={({ field }) => (
            <SelectInput
              error={formState.errors.amount?.message}
              options={payedByTypes}
              label="Qui a payé la transaction ?"
              {...field}
            />
          )}
        />

        {payedByType === PayedByType.Manual && (
          <Controller
            name="initiatedById"
            control={formMethods.control}
            render={({ field }) => (
              <SelectInput
                error={formState.errors.initiatedById?.message}
                label="Membre de l'équipe"
                options={
                  teamManage?.teamMembers.map((teamMember) => ({
                    label: <UserLabeled user={teamMember.user} showCardOnClick={false} small={true} />,
                    value: teamMember.user.individual?.id,
                  })) || []
                }
                {...field}
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
              <LegalUnitInput error={formState.errors.legalUnit?.message} label="Entreprise" {...field} />
            )}
          />
        </div>
        <DateInput error={formState.errors.payedAt?.message} label="Date de la transaction" {...register('payedAt')} />
        <Controller
          name="projectId"
          render={({ field }) => (
            <SelectInput
              error={formState.errors.projectId?.message}
              label="Projet lié"
              options={[
                { label: 'Dépenses générales', value: null },
                ...(teamManage.projects?.map((item) => ({ label: item.name, value: item.id })) ?? []),
              ]}
              {...field}
            />
          )}
        />
        <Controller
          name="projectId"
          render={({ field }) => (
            <SelectInput
              options={[
                { label: 'Dépenses générales', value: null },
                ...(teamManage.projects.map((item) => ({ label: item.name, value: item.id })) ?? []),
              ]}
              label="Projet lié"
              {...field}
              // name="projectId"
              // value={values.projectId}
              // onChange={(projectId) => setValues({ ...values, projectId: projectId as string, eventId: null })}
            />
          )}
        />
        {selectedProject && (
          <Controller
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
                {...field}
              />
            )}
          />
        )}
        <Controller
          name="category"
          render={({ field }) => (
            <SelectInput
              error={formState.errors.category?.message}
              label="Catégorie de dépense"
              options={Object.entries(FinanceCategory).map(([, value]) => ({
                label: t(`enums.FinanceCategory.${value}`),
                value,
              }))}
              {...field}
            />
          )}
        />
        <TextAreaInput label="Description" className="!h-56 input py-2 tabular-nums" {...register('description')} />
      </div>
    </div>
  );
}
