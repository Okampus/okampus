import EmptyStateImage from '../../../../../../../_components/atoms/Image/EmptyStateImage';
import AvatarImage from '../../../../../../../_components/atoms/Image/AvatarImage';
import Button from '../../../../../../../_components/molecules/Button/Button';
import MoneyAccountCard from '../../../../../../../_components/molecules/Card/MoneyAccountCard';
import BaseView from '../../../../../../../_components/templates/BaseView';

import prisma from '../../../../../../../../database/prisma/db';

import { teamDetails } from '../../../../../../../../types/prisma/Team/team-details';
import { moneyAccountWithBankAccountInfo } from '../../../../../../../../types/prisma/MoneyAccount/money-account-with-bank-info';
import { bankRequisitionMinimal } from '../../../../../../../../types/prisma/BankRequisition/bank-requisition-minimal';

import { getTranslation } from '../../../../../../../../server/ssr/getTranslation';
import { ReactComponent as AddBankAccountEmptyState } from '@okampus/assets/svg/empty-state/add-bank-account.svg';

import { ActionType } from '@okampus/shared/enums';
import { MoneyAccountType, TeamType } from '@prisma/client';
import { notFound } from 'next/navigation';

import type { DomainSlugParams } from '../../../../../../../params.type';

export default async function TeamManageBankAccountInfoPage({ params }: DomainSlugParams) {
  const { format } = await getTranslation(params.locale);

  const teamManage = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: {
      ...teamDetails.select,
      moneyAccounts: moneyAccountWithBankAccountInfo,
      bankRequisitions: { where: { accountsLastAccessedAt: null }, select: bankRequisitionMinimal.select },
    },
  });
  // const { openModal } = useModal();

  if (!teamManage) notFound();

  const hasCashTreasury = teamManage.moneyAccounts.some((moneyAccount) => moneyAccount.type === MoneyAccountType.Cash);

  return (
    <BaseView header="Compte">
      {teamManage.moneyAccounts.length === 0 && teamManage.bankRequisitions.length === 0 ? (
        <EmptyStateImage
          image={<AddBankAccountEmptyState className="max-h-[28rem]" />}
          title="Vous n'avez pas encore de compte bancaire lié à votre équipe"
          cta={
            teamManage.type === TeamType.Club ? (
              <Button
                type={ActionType.Primary}
                // action={{
                // TODO: improve modal
                // openModal({
                //   node: (
                //     <ModalLayout header="Demander une part de compte">
                //       <div>
                //         Contactez le trésorier de votre association-mère pour qu&apos;il procède à
                //         l&apos;attribution de votre part de compte.
                //       </div>
                //     </ModalLayout>
                //   ),
                // }),
                // }}
              >
                Demander une part de compte à votre association mère
              </Button>
            ) : (
              <Button type={ActionType.Primary} action={`/manage/team/${teamManage.slug}/bank/new`}>
                Créer votre compte bancaire
              </Button>
            )
          }
        />
      ) : (
        <div>
          <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(22rem,26rem))] gap-8">
            {teamManage.moneyAccounts.map((moneyAccount) => (
              <MoneyAccountCard key={moneyAccount.id} moneyAccount={moneyAccount} />
            ))}
            {teamManage.bankRequisitions.length > 0 &&
              teamManage.bankRequisitions.map((requisition) => (
                <div className="card" key={requisition.goCardLessRequisitionId}>
                  <div className="text-lg text-1 font-semibold">Accès bancaire en attente</div>
                  <div className="flex gap-4 items-center">
                    <AvatarImage actor={requisition.bank.actor} size={48} className="rounded-[50%]" />
                    <div className="font-semibold text-2xl">{requisition.bank.name}</div>
                  </div>
                  <div className="text-2 font-medium">Initié le {format('day', requisition.createdAt)}</div>
                  <Button
                    type={ActionType.Action}
                    className="w-fit"
                    action={`/manage/team/${teamManage.slug}/bank/onboard/${requisition.bank.goCardLessInstitutionId}`}
                  >
                    Finaliser l&apos;accès
                  </Button>
                </div>
              ))}
            {!hasCashTreasury && (
              <div className="card">
                <div className="text-lg text-1 font-semibold">Ajouter une trésorerie physique (caisse)</div>
                <div className="text-2">
                  Si vous tenez une caisse, vous pouvez la gérer comme un compte où seront enregistrées vos transactions
                  en liquide.
                </div>
                <Button type={ActionType.Action} className="w-fit" action={`/manage/team/${teamManage.slug}/bank/new`}>
                  Ajouter une caisse
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </BaseView>
  );
}
