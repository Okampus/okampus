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

export type FinanceSidePanelProps = { finance: FinanceMinimalInfo; teamManageActorId: string; onClose: () => void };
export default function FinanceSidePanel({ finance, teamManageActorId, onClose }: FinanceSidePanelProps) {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(DETAILS);

  const actor = finance.receivedBy.id === teamManageActorId ? finance.payedBy : finance.receivedBy;
  const isRevenue = finance.receivedBy.id === teamManageActorId;

  const tabs = [
    { label: 'Détails', key: DETAILS, onClick: () => setSelectedTab(DETAILS) },
    { label: 'Historique', key: HISTORY, onClick: () => setSelectedTab(HISTORY) },
  ];

  const payedAt = finance.payedAt ? new Date(finance.payedAt) : new Date();

  return (
    <SidePanel>
      <CloseButtonIcon className="absolute top-2 right-4" onClick={onClose} />
      <div className="text-0 font-medium text-center">
        {t('common.format.date.weekDay', { date: payedAt }).replace(' à ', ', ')}
      </div>
      <div className="flex flex-col gap-1 items-center border border-[var(--border-2)] rounded-lg mt-10 bg-2 pb-4">
        <AvatarImage actor={actor} type="team" className="-translate-y-1/2" />
        <IMoney amount={finance.amount} className="text-xl -mt-2" textClass="text-0" />
        <div className="text-lg text-0 font-medium">{actor?.name}</div>
        <div className="text-2 text-center font-medium">{t(`enums.PaymentMethod.${finance.method}`)}</div>
        <hr className="border-[var(--border-2)] w-full my-2" />
        <div className="flex gap-2 items-center">
          Payée par
          {finance.initiatedBy?.user ? (
            <UserLabeled user={{ ...finance.initiatedBy.user, individual: finance.initiatedBy }} />
          ) : (
            <div className="text-1 font-semibold text-sm">Inconnu</div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          Ajoutée par
          {finance.createdBy?.user ? (
            <UserLabeled user={{ ...finance.createdBy.user, individual: finance.createdBy }} small={true} />
          ) : (
            <div className="text-1 font-semibold text-sm">Système</div>
          )}
        </div>
      </div>
      {/* <div className="text-1 text-xl font-semibold px-16 text-center pt-1.5">{t(finance.method)}</div>
      <div className="border border-color-2 bg-main flex flex-col items-center mt-14 pb-8">
        <div
          className="h-14 w-14 rounded-2xl -translate-y-1/2"
          style={{ backgroundColor: getColorHexFromData(finance.category as string) }}
        />
        <TextFinance amount={finance.amount} className="text-3xl" />
        <div className="text-xl my-2 text-0">{actor?.name}</div>
        <div className="text-xl text-1 my-8">{formatDateDayOfWeekNoHour(payedAt)}</div>
        <LabeledUser
          id={finance.actor?.individualByIndividualId?.user?.id as string}
          name={finance.actor?.name}
        />
      </div> */}
      <TabList selected={selectedTab} tabs={tabs} tabClassName="mt-12 w-full" />
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
