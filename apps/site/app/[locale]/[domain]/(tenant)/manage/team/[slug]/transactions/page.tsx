// import TransactionForm from '../../../../../../../_components/forms/MultiStepForm/TransactionForm/TransactionForm';
import EmptyStateImage from '../../../../../../../_components/atoms/Image/EmptyStateImage';
import Button from '../../../../../../../_components/molecules/Button/Button';
import BaseView from '../../../../../../../_components/templates/BaseView';
// import ModalLayout from '../../../../../../../_components/atoms/Layout/ModalLayout';

// import { useModal } from '../../../../../../../_hooks/context/useModal';
// import { useTranslation } from '../../../../../../../_hooks/context/useTranslation';

import TransactionDashboard from '../../../../../../../_views/Dashboard/TransactionDashboard';

import { teamDetails } from '../../../../../../../../types/prisma/Team/team-details';
import { teamManageTransactions } from '../../../../../../../../types/prisma/Team/team-manage-transactions';
import { transactionMinimal } from '../../../../../../../../types/prisma/Transaction/transaction-minimal';
import { getCurrencyFormatter } from '../../../../../../../../utils/format/format';

import prisma from '../../../../../../../../database/prisma/db';
import { getIntlMessages } from '../../../../../../../../i18n';

import { getNextLang } from '../../../../../../../../server/ssr/getLang';

import { ReactComponent as AddBankAccountEmptyState } from '@okampus/assets/svg/empty-state/add-bank-account.svg';

import { ActionType } from '@okampus/shared/enums';

import { TeamType } from '@prisma/client';
import { Plus } from '@phosphor-icons/react/dist/ssr';

import { NextIntlClientProvider } from 'next-intl';
import { getFormatter } from 'next-intl/server';

import type { DomainSlugParams } from '../../../../../../../params.type';

export default async function TeamManageTransactionsPage({ params }: DomainSlugParams) {
  const format = await getFormatter({ locale: params.locale });

  const teamManage = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: { ...teamDetails.select, ...teamManageTransactions.select },
  });

  // const { openModal } = useModal();

  // const format = useFormatter();

  if (!teamManage) return null;

  const moneyAccount = teamManage.moneyAccounts[0];
  if (!moneyAccount) {
    return (
      <BaseView header="Transactions">
        <EmptyStateImage
          image={<AddBankAccountEmptyState className="max-h-[28rem]" />}
          title="Vous n'avez pas encore de compte bancaire lié à votre équipe"
          cta={
            teamManage.type === TeamType.Club ? (
              <Button
                type={ActionType.Primary}
                // action={{
                //   // TODO: improve modal
                //   // openModal({
                //   //   node: (
                //   //     <ModalLayout header="Demander une part de compte">
                //   //       <div>
                //   //         Contactez le trésorier de votre association-mère pour qu&apos;il procède à
                //   //         l&apos;attribution de votre part de compte.
                //   //       </div>
                //   //     </ModalLayout>
                //   //   ),
                //   // }),
                // }}
              >
                Demander une part de compte à votre association mère
              </Button>
            ) : (
              <Button type={ActionType.Primary} action={`/manage/team/${teamManage.slug}/bank/onboard`}>
                Ajouter votre compte bancaire
              </Button>
            )
          }
        />
      </BaseView>
    );
  }

  const transactions = await prisma.transaction.findMany({
    where: { moneyAccountId: moneyAccount.id },
    orderBy: { payedAt: 'desc' },
    select: transactionMinimal.select,
  });

  const balanceSum = await prisma.moneyAccount.aggregate({
    where: { id: moneyAccount.id },
    _sum: { balance: true },
  });

  return (
    <NextIntlClientProvider messages={await getIntlMessages(getNextLang(), ['Enums'])}>
      <TransactionDashboard
        team={teamManage}
        header={`${format.number(balanceSum._sum.balance ?? 0, getCurrencyFormatter(moneyAccount.currency))}`}
        searchBarButtons={
          <Button type={ActionType.Primary} action={`/manage/team/${params.slug}/transactions/new`}>
            <Plus className="w-7 h-7" />
            Ajouter une transaction
          </Button>
        }
        transactions={transactions}
      />
    </NextIntlClientProvider>
  );
}
