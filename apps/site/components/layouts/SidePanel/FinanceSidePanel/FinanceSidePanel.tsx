import FinanceHistory from './FinanceHistory';
import FinanceEdit from './FinanceEdit';
import SidePanel from '../../SidePanel';

import CloseButtonIcon from '../../../../components/atoms/Icon/CloseButtonIcon';
import AvatarImage from '../../../../components/atoms/Image/AvatarImage';
import IMoney from '../../../atoms/Inline/IMoney';
import UserLabeled from '../../../../components/molecules/Labeled/UserLabeled';
import TabList from '../../../../components/molecules/List/TabList';

import { useTranslation } from '../../../../hooks/context/useTranslation';

import { useState } from 'react';

import type { FinanceMinimalInfo } from '../../../../types/features/finance.info';

const DETAILS = 'details';
const HISTORY = 'history';

export type FinanceSidePanelProps = { finance: FinanceMinimalInfo; actorId: string; onClose: () => void };
export default function FinanceSidePanel({ finance, actorId, onClose }: FinanceSidePanelProps) {
  const { format, t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(DETAILS);

  const actor = finance.receivedBy.id === actorId ? finance.payedBy : finance.receivedBy;
  const isRevenue = finance.receivedBy.id === actorId;

  const tabs = [
    { label: 'Détails', key: DETAILS, onClick: () => setSelectedTab(DETAILS) },
    { label: 'Historique', key: HISTORY, onClick: () => setSelectedTab(HISTORY) },
  ];

  const payedAt = finance.payedAt ? new Date(finance.payedAt) : new Date();

  return (
    <SidePanel>
      <CloseButtonIcon className="absolute top-3 right-4" onClick={onClose} />
      <div className="text-0 font-medium text-lg text-center mt-[var(--py-content)]">{format('weekDay', payedAt)}</div>
      <div className="flex flex-col gap-1 items-center rounded-lg mt-10 bg-3 pb-4 mx-4">
        <AvatarImage actor={actor} size={20} type="team" className="-translate-y-1/2" />
        <IMoney amount={finance.amount} className="text-xl -mt-4" textClass="text-0" />
        <div className="text-lg text-0 font-medium">{actor?.name}</div>
        <div className="text-1 text-center font-medium">{t(`enums.PaymentMethod.${finance.method}`)}</div>
        <hr className="border-[var(--border-1)] w-full my-2" />
        <div className="flex gap-2 items-center">
          Paiement fait par
          {finance.initiatedBy ? (
            <UserLabeled user={finance.initiatedBy} />
          ) : (
            <div className="text-1 font-semibold text-sm">Inconnu</div>
          )}
        </div>
        <hr className="border-[var(--border-1)] w-full my-2" />
        <div className="flex gap-2 items-center">
          Ajouté par
          {finance.createdBy ? (
            <UserLabeled user={finance.createdBy} small={true} />
          ) : (
            <div className="text-1 font-semibold text-sm">Système</div>
          )}
        </div>
      </div>
      <TabList selected={selectedTab} tabs={tabs} tabClassName="mt-12 mx-3 w-full" />
      <div className="px-4">
        {selectedTab === DETAILS ? (
          <FinanceEdit finance={finance} isRevenue={isRevenue} />
        ) : (
          <FinanceHistory finance={finance} />
        )}
      </div>
    </SidePanel>
  );
}
