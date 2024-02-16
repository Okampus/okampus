'use client';

import TransactionDetailsSection from './TransactionDetailsSection';
import TransactionCounterpartySection from './TransactionCounterpartySection';

import AddTransactionTypeForm from '../ComboBox/AddTransactionTypeForm';

import FormWithAction from '../../../_components/molecules/Form/FormWithAction';
import ComboBoxInput from '../../../_components/molecules/Input/Controlled/ComboBox/ComboBoxInput';
import TabList from '../../../_components/molecules/List/TabList';

import { updateTransactionSchema } from '../../../../schemas/Transaction/updateTransactionSchema';
import updateTransaction from '../../../../server/actions/Transaction/updateTransaction';

import { TransactionType } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { TransactionMinimal } from '../../../../types/prisma/Transaction/transaction-minimal';
import type { TeamManageTransactions } from '../../../../types/prisma/Team/team-manage-transactions';

export type TransactionFormProps = { transaction: TransactionMinimal; team: TeamManageTransactions };

const DETAILS = 'details';
const CATEGORY = 'category';
const PARTIES = 'parties';
const RECEIPTS = 'receipts';

export default function TransactionForm({ transaction, team }: TransactionFormProps) {
  const t = useTranslations();
  const [selectedTab, setSelectedTab] = useState(DETAILS);

  const incomeTransactionType = [
    {
      label: t('Enums.TransactionType.Subvention'),
      value: TransactionType.Subvention,
      searchText: t('Enums.TransactionType.Subvention'),
    },
    {
      label: t('Enums.TransactionType.MembershipFees'),
      value: TransactionType.MembershipFees,
      searchText: t('Enums.TransactionType.MembershipFees'),
    },
    {
      label: t('Enums.TransactionType.TicketFees'),
      value: TransactionType.TicketFees,
      searchText: t('Enums.TransactionType.TicketFees'),
    },
    {
      label: t('Enums.TransactionType.Gift'),
      value: TransactionType.Gift,
      searchText: t('Enums.TransactionType.Gift'),
    },
    {
      label: t('Enums.TransactionType.Income'),
      value: TransactionType.Income,
      searchText: t('Enums.TransactionType.Income'),
    },
    ...team.teamTransactionTypes
      .filter((type) => type.isIncome)
      .map((type) => ({ label: type.name, value: type.id, searchText: type.name })),
  ];

  const balanceTransactionType = {
    label: t('Enums.TransactionType.Balance'),
    value: TransactionType.Balance,
    searchText: t('Enums.TransactionType.Balance'),
  };

  const expenseTransactionTypes = [
    {
      label: t('Enums.TransactionType.BankingFees'),
      value: TransactionType.BankingFees,
      searchText: t('Enums.TransactionType.BankingFees'),
    },
    {
      label: t('Enums.TransactionType.ExpenseClaim'),
      value: TransactionType.ExpenseClaim,
      searchText: t('Enums.TransactionType.ExpenseClaim'),
    },
    {
      label: t('Enums.TransactionType.Groceries'),
      value: TransactionType.Groceries,
      searchText: t('Enums.TransactionType.Groceries'),
    },
    {
      label: t('Enums.TransactionType.Equipment'),
      value: TransactionType.Equipment,
      searchText: t('Enums.TransactionType.Equipment'),
    },
    {
      label: t('Enums.TransactionType.Travel'),
      value: TransactionType.Travel,
      searchText: t('Enums.TransactionType.Travel'),
    },
    {
      label: t('Enums.TransactionType.Communication'),
      value: TransactionType.Communication,
      searchText: t('Enums.TransactionType.Communication'),
    },
    {
      label: t('Enums.TransactionType.Subscription'),
      value: TransactionType.Subscription,
      searchText: t('Enums.TransactionType.Subscription'),
    },
    {
      label: t('Enums.TransactionType.Expense'),
      value: TransactionType.Expense,
      searchText: t('Enums.TransactionType.Expense'),
    },
    ...team.teamTransactionTypes
      .filter((type) => !type.isIncome)
      .map((type) => ({ label: type.name, value: type.id, searchText: type.name })),
  ];

  const projectOptions = [
    { label: 'Dépenses générales', value: null, searchText: 'Dépenses générales' },
    ...team.projects.map((project) => ({ label: project.name, value: project.id, searchText: project.name })),
  ];

  const eventOptions = [
    { label: 'Hors-événement', value: null, searchText: 'Hors-événement' },
    ...team.eventOrganizes.map(({ event }) => ({ label: event.name, value: event.id, searchText: event.name })),
  ];

  const isBankTransaction = transaction.bankTransactions.length > 0;
  const bank = isBankTransaction
    ? team.moneyAccounts.find((account) => account.id === transaction.bankTransactions[0].moneyAccountId)
        ?.bankAccountInfo?.bank ?? undefined
    : undefined;

  const transactionDefaults = {
    isIncome: transaction.amount > 0,
    isOnline: transaction.isOnline,
    transactionType: transaction.teamTransactionType?.id ?? transaction.transactionType ?? undefined,
    paymentMethod: transaction.teamPaymentMethod?.id ?? transaction.paymentMethod ?? undefined,
    payedAt: transaction.payedAt?.toISOString() ?? '',
    amount: Math.abs(transaction.amount),
    projectId: transaction.project?.id,
    eventId: transaction.event?.id,
    wording: transaction.wording,
    referenceNumber: transaction.referenceNumber,
    note: transaction.note,
    moneyAccountId: transaction.moneyAccountId,
  };

  const cannotEdit = transaction.transactionType === TransactionType.Balance;
  const tabs = [
    { label: 'Informations', key: DETAILS, onClick: () => setSelectedTab(DETAILS) },
    { label: 'Parties concernées', key: PARTIES, onClick: () => setSelectedTab(PARTIES) },
    { label: 'Catégorisation', key: CATEGORY, onClick: () => setSelectedTab(CATEGORY) },
    { label: 'Justificatifs', key: RECEIPTS, onClick: () => setSelectedTab(RECEIPTS) },
  ];

  return (
    <FormWithAction
      action={updateTransaction}
      defaultValues={{ ...transactionDefaults }}
      zodSchema={updateTransactionSchema}
      render={(state, methods) => {
        const selectedIsIncome = methods.watch('isIncome');
        const transactionType = methods.watch('transactionType');
        const transactionTypes = selectedIsIncome ? incomeTransactionType : expenseTransactionTypes;

        const selectedMoneyAccount = methods.watch('moneyAccountId');

        return (
          <>
            <TabList selected={selectedTab} tabs={tabs} className="mb-2" />
            {selectedTab === DETAILS ? (
              <TransactionDetailsSection
                team={team}
                cannotEdit={cannotEdit}
                isBankTransaction={isBankTransaction}
                methods={methods}
              />
            ) : selectedTab === PARTIES ? (
              <TransactionCounterpartySection
                team={team}
                bank={bank}
                methods={methods}
                transactionType={typeof transactionType === 'string' ? transactionType : undefined}
              />
            ) : selectedTab === CATEGORY ? (
              <div className="flex flex-col gap-3 max-w-2xl">
                <ComboBoxInput<bigint | TransactionType, { teamId: bigint }>
                  name="transactionType"
                  disabled={cannotEdit}
                  label="Type de transaction"
                  control={methods.control}
                  getOptions={[
                    ...transactionTypes,
                    ...(transaction.transactionType === TransactionType.Balance ? [balanceTransactionType] : []),
                  ]}
                  getOptionsKey={(search) => `${transaction.team.id}/transactionTypes?search=${search}`}
                  onAddSearch={{ render: AddTransactionTypeForm, context: { teamId: transaction.team.id } }}
                />
                {transaction.transactionType !== TransactionType.Balance && (
                  <div className="flex md-max:flex-col gap-3">
                    <ComboBoxInput
                      disabled={cannotEdit}
                      name="project"
                      label="Projet lié"
                      control={methods.control}
                      getOptions={projectOptions}
                      getOptionsKey={(search) => `${transaction.team.id}/project?search=${search}`}
                    />
                    <ComboBoxInput
                      disabled={cannotEdit}
                      name="event"
                      label="Événement lié"
                      control={methods.control}
                      getOptions={eventOptions}
                      getOptionsKey={(search) => `${transaction.team.id}/event?search=${search}`}
                    />
                  </div>
                )}
                <ComboBoxInput
                  disabled={cannotEdit}
                  name="tags"
                  label="Tags"
                  control={methods.control}
                  getOptions={projectOptions}
                  getOptionsKey={(search) => `${transaction.team.id}/project?search=${search}`}
                />
              </div>
            ) : selectedTab === RECEIPTS ? (
              <div className="flex flex-col gap-3 max-w-2xl">Justificatifs</div>
            ) : (
              <div className="flex flex-col gap-3 max-w-2xl">Historique</div>
            )}
            {/* <div className="flex md-max:flex-col gap-3">
                <SelectorInput
                  name="isOnline"
                  label="Transaction réalisée"
                  disabled={cannotEdit}
                  control={methods.control}
                  options={[
                    { label: 'En ligne', value: true },
                    { label: 'En personne', value: false },
                  ]}
                />
              </div> */}
          </>
        );
      }}
    />
  );
}
