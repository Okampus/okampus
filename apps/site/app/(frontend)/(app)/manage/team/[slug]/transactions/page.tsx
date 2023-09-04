'use client';

import TransactionForm from '../../../../../../../components/forms/MultiStepForm/TransactionForm/TransactionForm';
import ActionButton from '../../../../../../../components/molecules/Button/ActionButton';

import { useTeamManage } from '../../../../../../../context/navigation';
import { useModal } from '../../../../../../../hooks/context/useModal';
import { useTranslation } from '../../../../../../../hooks/context/useTranslation';

import TransactionDashboard from '../../../../../../../views/TransactionDashboard';

import { ActionType } from '@okampus/shared/types';
import { IconPlus } from '@tabler/icons-react';

export default function TeamManageTransactionsPage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);
  const { openModal } = useModal();

  const { format } = useTranslation();

  const bankAccount = teamManage?.bankAccounts?.[0];
  if (!bankAccount) return null;

  return (
    <TransactionDashboard
      actor={teamManage.actor}
      header={format('euro', bankAccount.transactionsAggregate.aggregate?.sum?.amount ?? 0)}
      searchBarButtons={
        <ActionButton
          action={{
            label: 'Ajouter une transaction',
            linkOrActionOrMenu: () => openModal({ node: <TransactionForm teamManage={teamManage} /> }),
            iconOrSwitch: <IconPlus />,
            type: ActionType.Primary,
          }}
        />
      }
    />
  );
}
