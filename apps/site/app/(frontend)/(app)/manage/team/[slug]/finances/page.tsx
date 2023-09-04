'use client';

import FinanceForm from '../../../../../../../components/forms/MultiStepForm/FinanceForm/FinanceForm';
import ActionButton from '../../../../../../../components/molecules/Button/ActionButton';

import { useTeamManage } from '../../../../../../../context/navigation';
import { useModal } from '../../../../../../../hooks/context/useModal';
import { useTranslation } from '../../../../../../../hooks/context/useTranslation';

import FinanceDashboard from '../../../../../../../views/FinanceDashboard';

import { ActionType } from '@okampus/shared/types';
import { IconPlus } from '@tabler/icons-react';

export default function TeamManageTransactionsPage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);
  const { openModal } = useModal();

  const { format } = useTranslation();

  const bankAccount = teamManage?.bankAccounts?.[0];
  if (!bankAccount) return null;

  return (
    <FinanceDashboard
      actor={teamManage.actor}
      header={format('euro', bankAccount.financesAggregate.aggregate?.sum?.amount ?? 0)}
      searchBarButtons={
        <ActionButton
          action={{
            label: 'Ajouter une transaction',
            linkOrActionOrMenu: () => openModal({ node: <FinanceForm teamManage={teamManage} /> }),
            iconOrSwitch: <IconPlus />,
            type: ActionType.Primary,
          }}
        />
      }
    />
  );
}
