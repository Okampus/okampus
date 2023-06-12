import { TeamFinanceHistoryList } from './TeamFinanceHistoryList';
import { FinanceCategory, PaymentMethod } from '@okampus/shared/enums';
import { formatDateDayOfWeekNoHour, getColorHexFromData } from '@okampus/shared/utils';
import { CloseButton, TextFinance } from '@okampus/ui/atoms';
import { NavigationContext } from '@okampus/ui/hooks';

import {
  DateInput,
  //  LabeledUser,
  NumberInput,
  SelectInput,
  TabsList,
  TextInput,
} from '@okampus/ui/molecules';
// import { useTypedLazyQuery } from '@okampus/shared/graphql';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { TeamFinanceBaseInfo } from '@okampus/shared/graphql';

const DETAILS = 'details';
const HISTORY = 'history';

export type TeamFinanceSidePanelProps = { teamFinance: TeamFinanceBaseInfo };
export function TeamFinanceSidePanel({ teamFinance }: TeamFinanceSidePanelProps) {
  const { t } = useTranslation();
  const { hideSidePanel } = useContext(NavigationContext);

  const [selectedTab, setSelectedTab] = useState(DETAILS);
  // const [getTeamFinanceEdits, { data: teamFinanceEdits }] = useTypedLazyQuery({
  //   teamFinanceEdit: [{ where: { : { _eq: teamFinance.id as string } } }],
  // });

  const tabs = [
    {
      label: 'Détails',
      key: DETAILS,
      onClick: () => setSelectedTab(DETAILS),
    },
    {
      label: 'Historique',
      key: HISTORY,
      onClick: () => setSelectedTab(HISTORY),
    },
  ];

  const payedAt = teamFinance.payedAt ? new Date(teamFinance.payedAt as string) : new Date();

  return (
    <div className="p-4 relative flex flex-col">
      <CloseButton className="absolute top-4 right-4" onClick={hideSidePanel} />
      <div className="text-1 text-xl font-semibold px-16 text-center pt-1.5">{t(teamFinance.method)}</div>
      <div className="border border-color-2 bg-main flex flex-col items-center mt-14 pb-8">
        <div
          className="h-14 w-14 rounded-2xl -translate-y-1/2"
          style={{ backgroundColor: getColorHexFromData(teamFinance.category as string) }}
        />
        <TextFinance amount={teamFinance.amount} className="text-3xl" />
        <div className="text-xl my-2 text-0">{teamFinance.name}</div>
        <div className="text-xl text-1 my-8">{formatDateDayOfWeekNoHour(payedAt)}</div>
        {/* <LabeledUser
          id={teamFinance.actor?.individualByIndividualId?.userInfo?.id as string}
          name={teamFinance.actor?.name}
        /> */}
        {/* <SelectInput items={{
          
        }} */}
        {/* <TabsList */}
      </div>
      <TabsList selected={selectedTab} tabs={tabs} tabClassName="mt-12 w-full" />
      {selectedTab === DETAILS ? (
        <div className="flex flex-col gap-4 p-5">
          <TextInput
            options={{
              label: 'Nom',
              name: 'name',
            }}
            value={teamFinance.name as string}
            onChange={() => console.log('change')}
          />
          <DateInput
            options={{
              label: 'Date de paiement',
              name: 'payedAt',
            }}
            date={payedAt}
            onChange={() => console.log('change')}
          />

          <NumberInput
            value={-teamFinance.amount}
            onChange={() => console.log('change')}
            options={{ label: 'Montant de la dépense', name: 'amount' }}
          />
          <SelectInput
            items={Object.entries(PaymentMethod).map(([, value]) => ({ label: t(value), value }))}
            options={{ label: 'Méthode de paiement', name: 'method' }}
            value={teamFinance.method}
            onChange={() => console.log('change')}
          />
          <SelectInput
            items={Object.entries(FinanceCategory).map(([, value]) => ({ label: t(value), value }))}
            options={{ label: 'Catégorie de dépense', name: 'category' }}
            value={teamFinance.category}
            onChange={() => console.log('change')}
          />
        </div>
      ) : (
        <TeamFinanceHistoryList teamFinance={teamFinance} />
      )}
    </div>
  );
}
