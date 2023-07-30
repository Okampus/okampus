'use client';

import EmptyStateImage from '../../../../../../../components/atoms/Image/EmptyStateImage';
import ModalLayout from '../../../../../../../components/atoms/Layout/ModalLayout';
import ViewLayout from '../../../../../../../components/atoms/Layout/ViewLayout';
import ActionButton from '../../../../../../../components/molecules/Button/ActionButton';
import AccountCard from '../../../../../../../components/molecules/Card/AccountCard';

import { useTeamManage } from '../../../../../../../context/navigation';
import { useModal } from '../../../../../../../hooks/context/useModal';

import { ReactComponent as AddAccountEmptyState } from '@okampus/assets/svg/empty-state/add-account.svg';
import { TeamType } from '@okampus/shared/enums';
import { ActionType } from '@okampus/shared/types';

export default function TeamManageBankPage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);
  // const openModal = useNavigation((state) => state.openModal);
  const { openModal } = useModal();

  if (!teamManage?.actor) return null;

  return teamManage.accounts.length === 0 ? (
    <EmptyStateImage
      image={<AddAccountEmptyState className="max-h-[28rem]" />}
      title="Vous n'avez pas encore de compte lié à votre équipe"
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
                        Contactez le trésorier de votre association-mère pour qu&apos;il procède à l&apos;attribution de
                        votre part de compte
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
              linkOrActionOrMenu: `/manage/team/${teamManage.actor.slug}/bank/create`,
            }}
          />
        )
      }
    />
  ) : (
    <ViewLayout header="Compte">
      <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(22rem,26rem))] gap-8">
        {teamManage.accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </ViewLayout>
  );
}
