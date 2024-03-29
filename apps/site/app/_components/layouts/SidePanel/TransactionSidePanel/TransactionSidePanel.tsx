// import TransactionHistory from './TransactionHistory';
// import TransactionEdit from './TransactionEdit';
import Sidepanel from '../../Sidepanel';

import CloseButtonIcon from '../../../atoms/Icon/CloseButtonIcon';
import AvatarImage from '../../../atoms/Image/AvatarImage';
import IMoney from '../../../atoms/Inline/IMoney';
import UserLabeled from '../../../molecules/Labeled/UserLabeled';
import TabList from '../../../molecules/List/TabList';

import { dateFormatters } from '../../../../../utils/format/format';

import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';

import type { TransactionMinimal } from '../../../../../types/prisma/Transaction/transaction-minimal';

const DETAILS = 'details';
const HISTORY = 'history';

export type TransactionSidePanelProps = { transaction: TransactionMinimal; actorId: bigint; onClose: () => void };
export default function TransactionSidePanel({ transaction, actorId, onClose }: TransactionSidePanelProps) {
  const format = useFormatter();
  const t = useTranslations();

  const [selectedTab, setSelectedTab] = useState(DETAILS);

  const counterParty =
    transaction.counterPartyActor?.id === actorId
      ? transaction.counterPartyActor
      : { name: transaction.counterPartyName };
  const isIncome = transaction.amount > 0;

  const tabs = [
    { label: 'Détails', key: DETAILS, onClick: () => setSelectedTab(DETAILS) },
    { label: 'Historique', key: HISTORY, onClick: () => setSelectedTab(HISTORY) },
  ];

  const payedAt = transaction.payedAt ? new Date(transaction.payedAt) : new Date();

  return (
    <Sidepanel>
      <CloseButtonIcon className="absolute top-3 right-4" onClick={onClose} />
      <div className="text-0 font-medium text-lg text-center mt-[var(--py-content)]">
        {format.dateTime(payedAt, dateFormatters.weekDay)}
      </div>
      <div className="flex flex-col gap-1 items-center rounded-lg mt-10 bg-3 pb-4 mx-4">
        <AvatarImage
          actor={'id' in counterParty ? counterParty : undefined}
          name="?"
          size={20}
          className="-translate-y-1/2"
        />
        <IMoney amount={transaction.amount} className="text-xl -mt-4" />
        <div className="text-lg text-0 font-medium">{counterParty.name}</div>
        <div className="text-1 text-center font-medium">{t(`Enums.PaymentMethod.${transaction.paymentMethod}`)}</div>
        <hr className="border-[var(--border-1)] w-full my-2" />
        <div className="flex gap-2 items-center">
          Paiement fait par
          {transaction.liableTeamMember ? (
            <UserLabeled user={transaction.liableTeamMember.user} />
          ) : (
            <div className="text-1 font-semibold text-sm">Inconnu</div>
          )}
        </div>
        <hr className="border-[var(--border-1)] w-full my-2" />
        <div className="flex gap-2 items-center">
          Ajouté par
          {transaction.createdBy ? (
            <UserLabeled user={transaction.createdBy} small={true} />
          ) : (
            <div className="text-1 font-semibold text-sm">Système</div>
          )}
        </div>
      </div>
      <TabList selected={selectedTab} tabs={tabs} tabClassName="mt-12 mx-3 w-full" />
      {/* <div className="px-4">
        {selectedTab === DETAILS ? (
          <TransactionEdit transaction={transaction} isIncome={isIncome} />
        ) : (
          <TransactionHistory transaction={transaction} />
        )}
      </div> */}
    </Sidepanel>
  );
}
