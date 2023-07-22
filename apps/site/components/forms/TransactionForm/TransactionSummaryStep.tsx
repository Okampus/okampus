import DateInput from '../../molecules/Input/DateInput';
import LegalUnitInput from '../../molecules/Input/LegalUnitInput';
import NumberInput from '../../molecules/Input/NumberInput';
import SelectInput from '../../molecules/Input/SelectInput';
import UserLabeled from '../../molecules/Labeled/UserLabeled';

import { useTranslation } from '../../../hooks/context/useTranslation';

import { FinanceCategory, PayedByType, PaymentMethod } from '@okampus/shared/enums';
import { projectBaseInfo, useTypedQuery } from '@okampus/shared/graphql';

import { useMemo } from 'react';
import type { TeamManageInfo } from '@okampus/shared/graphql';

import type { transactionFormDefaultValues } from './TransactionForm';
import type { FormStepContext } from '../../molecules/Form/MultiStepForm';

type Context = FormStepContext<typeof transactionFormDefaultValues>;
type SummaryFormStepProps = { teamManage: TeamManageInfo; values: Context['values']; setValues: Context['setValues'] };
export default function TransactionSummaryStep({ teamManage, values, setValues }: SummaryFormStepProps) {
  const { t } = useTranslation();

  const { data: projectData } = useTypedQuery({
    project: [{ where: { team: { id: { _eq: teamManage?.id } } } }, projectBaseInfo],
  });

  const selectedProject = projectData?.project.find((project) => project.id === values.projectId) || null;
  const src = useMemo(
    () => (values.attachments ? URL.createObjectURL(values.attachments[0]) : ''),
    [values.attachments]
  );

  return (
    <div className="w-full flex gap-4 md-max:flex-col">
      <div className="flex flex-col gap-4">
        <div className="shrink-0 w-[25rem] aspect-square overflow-scroll rounded-2xl self-center">
          <embed className="w-[25rem] min-h-[100%]" src={src} />
        </div>
        <div className="grid grid-cols-[9rem,1fr]">
          <NumberInput
            value={values.amount}
            onChange={(value) => setValues({ ...values, amount: value })}
            options={{ label: 'Montant', name: 'amount' }}
          />
          <SelectInput
            items={Object.entries(PaymentMethod).map(([, value]) => ({
              label: t(`enums.PaymentMethod.${value}`),
              value,
            }))}
            options={{ label: 'Méthode de paiement', name: 'method' }}
            value={values.method}
            onChange={(value) => setValues({ ...values, method: value })}
          />
        </div>
        <SelectInput
          items={Object.entries(PayedByType).map(([, value]) => ({ label: t(`enums.PayedByType.${value}`), value }))}
          options={{ label: 'Qui a payé la transaction ?', name: 'payedByType' }}
          value={values.payedByType}
          onChange={(value) => setValues({ ...values, payedByType: value, initiatedById: null })}
        />
        {values.payedByType === PayedByType.Manual && (
          <SelectInput
            options={{ label: "Membre de l'équipe", name: 'payedBy' }}
            items={
              teamManage?.teamMembers.map((teamMember) => ({
                label: (
                  <UserLabeled
                    individual={teamMember.user.individual}
                    id={teamMember.user.id}
                    showCardOnClick={false}
                    small={true}
                  />
                ),
                value: teamMember.user.individual?.id,
              })) || []
            }
            value={values.initiatedById}
            onChange={(value) => setValues({ ...values, initiatedById: value as string })}
          />
        )}
      </div>
      <div className="flex flex-col gap-4 md:w-[35rem]">
        <div>
          <div className="text-[var(--text-1)] font-semibold text-xs pl-3 pb-1">Entreprise</div>
          <LegalUnitInput
            onQueryChange={(value) => setValues((values) => ({ ...values, legalUnitQuery: value }))}
            legalUnitQuery={values.legalUnitQuery}
            value={values.legalUnit}
            onChange={(value) => setValues((values) => ({ ...values, legalUnit: value }))}
          />
        </div>
        <DateInput
          className="w-full"
          date={values.payedAt}
          onChange={(date) => setValues({ ...values, payedAt: date })}
          options={{ label: 'Date de la transaction', name: 'payedAt' }}
        />
        <SelectInput
          items={[
            { label: 'Dépenses générales', value: null },
            ...(projectData?.project.map((item) => ({ label: item.name, value: item.id })) ?? []),
          ]}
          options={{ label: 'Projet lié', name: 'projectId' }}
          value={values.projectId}
          onChange={(projectId) => setValues({ ...values, projectId: projectId as string, eventId: null })}
        />
        {selectedProject && (
          <SelectInput
            items={[
              { label: 'Dépenses hors-événement', value: null },
              ...(selectedProject.eventOrganizes.map(({ event }) => ({
                label: event?.name,
                value: event.id,
              })) ?? []),
            ]}
            options={{ label: 'Événement lié', name: 'eventId' }}
            value={values.eventId}
            onChange={(eventId) => setValues({ ...values, eventId: eventId as string })}
          />
        )}
        <SelectInput
          items={Object.entries(FinanceCategory).map(([, value]) => ({
            label: t(`enums.FinanceCategory.${value}`),
            value,
          }))}
          options={{ label: 'Catégorie de dépense', name: 'category' }}
          value={values.category}
          onChange={(category) => setValues({ ...values, category })}
        />
        <textarea
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
          className="!h-56 input py-2 tabular-nums"
        />
      </div>
    </div>
  );
}
