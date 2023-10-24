// import TransactionHistory from './TransactionHistory';
// import TransactionEdit from './TransactionEdit';
import SidePanel from '../../SidePanel';

import CloseButtonIcon from '../../../atoms/Icon/CloseButtonIcon';
import AvatarImage from '../../../atoms/Image/AvatarImage';
import IMoney from '../../../atoms/Inline/IMoney';
import UserLabeled from '../../../molecules/Labeled/UserLabeled';
import TabList from '../../../molecules/List/TabList';

import { useTranslation } from '../../../../_hooks/context/useTranslation';

import { useState } from 'react';

import type { TransactionMinimalInfo } from '../../../../../types/features/transaction.info';

const DETAILS = 'details';
const HISTORY = 'history';

export type TransactionSidePanelProps = { transaction: TransactionMinimalInfo; actorId: string; onClose: () => void };
export default function TransactionSidePanel({ transaction, actorId, onClose }: TransactionSidePanelProps) {
  const { format, t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(DETAILS);

  const actor = transaction.receivedBy.id === actorId ? transaction.payedBy : transaction.receivedBy;
  const isRevenue = transaction.receivedBy.id === actorId;

  const tabs = [
    { label: 'Détails', key: DETAILS, onClick: () => setSelectedTab(DETAILS) },
    { label: 'Historique', key: HISTORY, onClick: () => setSelectedTab(HISTORY) },
  ];

  const payedAt = transaction.payedAt ? new Date(transaction.payedAt) : new Date();

  return (
    <SidePanel>
      <CloseButtonIcon className="absolute top-3 right-4" onClick={onClose} />
      <div className="text-0 font-medium text-lg text-center mt-[var(--py-content)]">{format('weekDay', payedAt)}</div>
      <div className="flex flex-col gap-1 items-center rounded-lg mt-10 bg-3 pb-4 mx-4">
        <AvatarImage actor={actor} size={20} className="-translate-y-1/2" />
        <IMoney amount={transaction.amount} className="text-xl -mt-4" textClass="text-0" />
        <div className="text-lg text-0 font-medium">{actor?.name}</div>
        <div className="text-1 text-center font-medium">{t('enums', `PaymentMethod.${transaction.method}`)}</div>
        <hr className="border-[var(--border-1)] w-full my-2" />
        <div className="flex gap-2 items-center">
          Paiement fait par
          {transaction.processedBy ? (
            <UserLabeled user={transaction.processedBy} />
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
          <TransactionEdit transaction={transaction} isRevenue={isRevenue} />
        ) : (
          <TransactionHistory transaction={transaction} />
        )}
      </div> */}
    </SidePanel>
  );
}
