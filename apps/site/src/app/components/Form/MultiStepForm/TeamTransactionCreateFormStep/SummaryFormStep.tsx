import { payedByLabel } from './PayedByFormStep';

import { DateInput, NumberInput, SearchInput, SelectInput, TextInput, UserItem } from '@okampus/ui/molecules';
import { projectBaseInfo, useTypedLazyQuery, useTypedQuery } from '@okampus/shared/graphql';
import { FinanceCategory, PayedByType, PaymentMethod } from '@okampus/shared/enums';
import { TextAddress } from '@okampus/ui/atoms';
import { useTeamManage } from '@okampus/ui/hooks';
import { getAvatar } from '@okampus/ui/utils';

import { t } from 'i18next';
import { useEffect } from 'react';

import type { teamTransactionCreateDefaultValues } from './default';
import type { FormStepContext } from '@okampus/ui/organisms';

type Context = FormStepContext<typeof teamTransactionCreateDefaultValues>;
type SummaryFormStepProps = { values: Context['values']; setValues: Context['setValues'] };
export function SummaryFormStep({ values, setValues }: SummaryFormStepProps) {
  const { teamManage } = useTeamManage();

  const { data: projectData } = useTypedQuery({
    project: [{ where: { team: { id: { _eq: teamManage?.id } } } }, projectBaseInfo],
  });

  const selectedProject = projectData?.project.find((project) => project.id === values.projectId) || null;

  const [search, { data }] = useTypedLazyQuery({
    searchLocation: [
      { query: values.addressQuery },
      {
        id: true,
        name: true,
        city: true,
        zip: true,
        country: true,
        state: true,
        street: true,
        coordinates: { latitude: true, longitude: true },
      },
    ],
  });

  useEffect(() => {
    if (values.addressQuery) search();
  }, [search, values.addressQuery]);

  const src = values.file ? URL.createObjectURL(values.file) : '';
  return (
    <div className="w-full flex gap-4 md-max:flex-col">
      <div className="flex flex-col gap-4">
        <div className="shrink-0 w-[30rem] aspect-square overflow-scroll rounded-2xl self-center">
          <embed className="w-[30rem] min-h-[100%]" src={src} />
        </div>
        <TextInput
          value={values.name}
          onChange={(value) => setValues({ ...values, name: value })}
          options={{ label: 'Nom de la transaction', name: 'name' }}
        />
        <DateInput
          className="w-full"
          date={values.payedAt}
          onChange={(date) => setValues({ ...values, payedAt: date })}
          options={{ label: 'Date de la transaction', name: 'payedAt' }}
        />
        <NumberInput
          value={values.amount}
          onChange={(value) => setValues({ ...values, amount: value })}
          options={{ label: 'Montant de la dépense', name: 'amount' }}
        />
        <SelectInput
          items={Object.entries(PaymentMethod).map(([, value]) => ({ label: t(value), value }))}
          options={{ label: 'Méthode de paiement', name: 'method' }}
          value={values.method}
          onChange={(value) => setValues({ ...values, method: value })}
        />
        <div className="flex gap-4">
          <SelectInput
            items={Object.entries(payedByLabel).map(([key, value]) => ({ label: t(value), value: key as PayedByType }))}
            options={{ label: 'Qui a payé la transaction ?', name: 'payedByType' }}
            value={values.payedByType}
            onChange={(value) => setValues({ ...values, payedByType: value, payedById: null })}
          />
          {values.payedByType === PayedByType.Manual && (
            <SelectInput
              options={{ label: "Membre de l'équipe", name: 'payedBy' }}
              items={
                teamManage?.teamMembers.map((teamMember) => ({
                  label: (
                    <UserItem
                      name={teamMember.userInfo.individualById?.actor?.name || ''}
                      avatar={{
                        src: getAvatar(teamMember.userInfo.individualById?.actor?.actorImages),
                        size: 7,
                      }}
                    />
                  ),
                  value: teamMember.userInfo.individualById?.actor?.id,
                })) || []
              }
              value={values.payedById}
              onChange={(value) => setValues({ ...values, payedById: value as string })}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4">
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
              ...(selectedProject.eventsAggregate.nodes.map((item) => ({
                label: item.contentMaster?.name,
                value: item.id,
              })) ?? []),
            ]}
            options={{ label: 'Événement lié', name: 'eventId' }}
            value={values.eventId}
            onChange={(eventId) => setValues({ ...values, eventId: eventId as string })}
          />
        )}
        <SelectInput
          items={Object.entries(FinanceCategory).map(([, value]) => ({ label: t(value), value }))}
          options={{ label: 'Catégorie de dépense', name: 'category' }}
          value={values.category}
          onChange={(category) => setValues({ ...values, category })}
        />
        <SearchInput
          options={{ label: 'Lieu de la dépense', name: 'location' }}
          items={(data?.searchLocation ?? []).map((item) => ({
            label: <TextAddress address={item} />,
            value: item,
          }))}
          value={values.addressItem}
          onChangeValue={(addressItem) => setValues({ ...values, addressItem })}
          query={values.addressQuery}
          onChangeQuery={(query) => setValues({ ...values, addressQuery: query })}
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
