'use client';

import TransactionForm from '../../../../../../../components/forms/MultiStepForm/TransactionForm/TransactionForm';
import ActionButton from '../../../../../../../components/molecules/Button/ActionButton';
import EmptyStateImage from '../../../../../../../components/atoms/Image/EmptyStateImage';
import ViewLayout from '../../../../../../../components/atoms/Layout/ViewLayout';
import ModalLayout from '../../../../../../../components/atoms/Layout/ModalLayout';

import { useTeamManage } from '../../../../../../../context/navigation';
import { useModal } from '../../../../../../../hooks/context/useModal';
import { useTranslation } from '../../../../../../../hooks/context/useTranslation';

import TransactionDashboard from '../../../../../../../views/TransactionDashboard';

import { ReactComponent as AddBankAccountEmptyState } from '@okampus/assets/svg/empty-state/add-bank-account.svg';

import { TeamType } from '@okampus/shared/enums';
import { ActionType } from '@okampus/shared/types';
import { IconPlus } from '@tabler/icons-react';

export default function TeamManageTransactionsPage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);
  const { openModal } = useModal();

  const { format } = useTranslation();

  if (!teamManage) return null;

  const bankAccount = teamManage.bankAccounts[0];
  if (!bankAccount) {
    return (
      <ViewLayout header="Transactions">
        <EmptyStateImage
          image={<AddBankAccountEmptyState className="max-h-[28rem]" />}
          title="Vous n'avez pas encore de compte bancaire lié à votre équipe"
          cta={
            teamManage.type === TeamType.Club ? (
              <ActionButton
                action={{
                  type: ActionType.Primary,
                  label: 'Demander une part de compte à votre association-mère',
                  linkOrActionOrMenu: () =>
                    // TODO: improve modal
                    openModal({
                      node: (
                        <ModalLayout header="Demander une part de compte">
                          <div>
                            Contactez le trésorier de votre association-mère pour qu&apos;il procède à
                            l&apos;attribution de votre part de compte.
                          </div>
                        </ModalLayout>
                      ),
                    }),
                }}
              />
            ) : (
              <ActionButton
                action={{
                  type: ActionType.Primary,
                  label: 'Créer votre compte bancaire',
                  linkOrActionOrMenu: `/manage/team/${teamManage.slug}/bank/onboard`,
                }}
              />
            )
          }
        />
      </ViewLayout>
    );
  }

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
