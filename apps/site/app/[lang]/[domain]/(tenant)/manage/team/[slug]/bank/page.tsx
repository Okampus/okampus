'use client';

import EmptyStateImage from '../../../../../../../_components/atoms/Image/EmptyStateImage';
import ModalLayout from '../../../../../../../_components/atoms/Layout/ModalLayout';
import ViewLayout from '../../../../../../../_components/atoms/Layout/ViewLayout';
import ActionButton from '../../../../../../../_components/molecules/Button/ActionButton';
import BankAccountCard from '../../../../../../../_components/molecules/Card/BankAccountCard';

import { useTeamManage } from '../../../../../../../_context/navigation';
import { useModal } from '../../../../../../../_hooks/context/useModal';

import { ReactComponent as AddBankAccountEmptyState } from '@okampus/assets/svg/empty-state/add-bank-account.svg';

import { ActionType } from '@okampus/shared/types';
import { TeamType } from '@prisma/client';

export default function TeamManageBankInfoPage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);
  const { openModal } = useModal();

  if (!teamManage?.actor) return null;

  return (
    <ViewLayout header="Compte">
      {teamManage.bankAccounts.length === 0 ? (
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
      ) : (
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(22rem,26rem))] gap-8">
          {teamManage.bankAccounts.map((bankAccount) => (
            <BankAccountCard key={bankAccount.id} bankAccount={bankAccount} />
          ))}
        </div>
      )}
    </ViewLayout>
  );
}
