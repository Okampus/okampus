'use client';

import AddPaymentMethodForm from './ComboBox/AddPaymentMethodForm';
import AddTransactionTypeForm from './ComboBox/AddTransactionTypeForm';

import FormWithAction from '../../_components/molecules/Form/FormWithAction';
import SelectorInput from '../../_components/molecules/Input/Controlled/Select/SelectorInput';

import ComboBoxInput from '../../_components/molecules/Input/Controlled/ComboBox/ComboBoxInput';
import DateInput from '../../_components/molecules/Input/Uncontrolled/Date/DateInput';
import CurrencyInput from '../../_components/molecules/Input/Controlled/Number/CurrencyInput';
import TextInput from '../../_components/molecules/Input/Uncontrolled/String/TextInput';

import updateTransaction from '../../../server/actions/Transaction/updateTransaction';
import { updateTransactionSchema } from '../../../schemas/Transaction/updateTransactionSchema';

import { Currency, PaymentMethod, TransactionType } from '@prisma/client';
import { useTranslations } from 'next-intl';

import type { TransactionMinimal } from '../../../types/prisma/Transaction/transaction-minimal';
import type { TeamManageTransactions } from '../../../types/prisma/Team/team-manage-transactions';

export type TransactionFormProps = { transaction: TransactionMinimal; team: TeamManageTransactions };

export default function TransactionForm({
  transaction,
  team: { teamPaymentMethods, teamTransactionTypes, moneyAccounts, projects, eventOrganizes },
}: TransactionFormProps) {
  const t = useTranslations();

  const incomeTransactionType = [
    { label: t('Enums.TransactionType.Subvention'), value: TransactionType.Subvention, searchText: 'subvention' },
    {
      label: t('Enums.TransactionType.MembershipFees'),
      value: TransactionType.MembershipFees,
      searchText: 'frais adhésion',
    },
    {
      label: t('Enums.TransactionType.TicketFees'),
      value: TransactionType.TicketFees,
      searchText: 'ticket événement',
    },
    { label: t('Enums.TransactionType.Gift'), value: TransactionType.Gift, searchText: 'don' },
    { label: t('Enums.TransactionType.Income'), value: TransactionType.Income, searchText: 'revenu' },
    ...teamTransactionTypes
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
    { label: t('Enums.TransactionType.Groceries'), value: TransactionType.Groceries, searchText: 'courses' },
    { label: t('Enums.TransactionType.Equipment'), value: TransactionType.Equipment, searchText: 'équipement' },
    { label: t('Enums.TransactionType.Travel'), value: TransactionType.Travel, searchText: 'frais de déplacement' },
    {
      label: t('Enums.TransactionType.Communication'),
      value: TransactionType.Communication,
      searchText: 'frais de communication',
    },
    {
      label: t('Enums.TransactionType.Subscription'),
      value: TransactionType.Subscription,
      searchText: 'abonnement',
    },
    { label: t('Enums.TransactionType.Expense'), value: TransactionType.Expense, searchText: 'dépense' },
    ...teamTransactionTypes
      .filter((type) => !type.isIncome)
      .map((type) => ({ label: type.name, value: type.id, searchText: type.name })),
  ];

  const paymentMethods = [
    {
      label: t('Enums.PaymentMethod.BankTransfer'),
      value: PaymentMethod.BankTransfer,
      searchText: t('Enums.PaymentMethod.BankTransfer'),
    },
    {
      label: t('Enums.PaymentMethod.CreditCard'),
      value: PaymentMethod.CreditCard,
      searchText: t('Enums.PaymentMethod.CreditCard'),
    },
    {
      label: t('Enums.PaymentMethod.MobilePayment'),
      value: PaymentMethod.MobilePayment,
      searchText: t('Enums.PaymentMethod.MobilePayment'),
    },
    {
      label: t('Enums.PaymentMethod.Cash'),
      value: PaymentMethod.Cash,
      searchText: t('Enums.PaymentMethod.Cash'),
    },
    {
      label: t('Enums.PaymentMethod.Check'),
      value: PaymentMethod.Check,
      searchText: t('Enums.PaymentMethod.Check'),
    },
    {
      label: t('Enums.PaymentMethod.DirectDebit'),
      value: PaymentMethod.DirectDebit,
      searchText: t('Enums.PaymentMethod.DirectDebit'),
    },
    ...teamPaymentMethods.map((method) => ({ label: method.name, value: method.id, searchText: method.name })),
  ];

  const projectOptions = [
    { label: 'Dépenses générales', value: null, searchText: 'Dépenses générales' },
    ...projects.map((project) => ({ label: project.name, value: project.id, searchText: project.name })),
  ];

  const eventOptions = [
    { label: 'Hors-événement', value: null, searchText: 'Hors-événement' },
    ...eventOrganizes.map(({ event }) => ({ label: event.name, value: event.id, searchText: event.name })),
  ];

  const isBankTransaction = transaction.bankTransactions.length > 0;
  const transactionDefaults = {
    isIncome: transaction.amount > 0,
    isOnline: transaction.isOnline,
    transactionType: transaction.teamTransactionType?.id ?? transaction.transactionType ?? undefined,
    paymentMethod: transaction.teamPaymentMethod?.id ?? transaction.paymentMethod ?? undefined,
    payedAt: transaction.payedAt ?? undefined,
    amount: Math.abs(transaction.amount),
    projectId: transaction.project?.id,
    eventId: transaction.event?.id,
    wording: transaction.wording,
    referenceNumber: transaction.referenceNumber,
    note: transaction.note,
    moneyAccountId: transaction.moneyAccountId,
  };

  const cannotEdit = transaction.transactionType === TransactionType.Balance;

  return (
    <FormWithAction
      action={updateTransaction}
      className="flex flex-col gap-3 max-w-3xl"
      defaultValues={{ ...transactionDefaults }}
      zodSchema={updateTransactionSchema}
      render={(state, methods) => {
        const selectedIsIncome = methods.watch('isIncome');
        const transactionTypes = selectedIsIncome ? incomeTransactionType : expenseTransactionTypes;

        const selectedMoneyAccount = methods.watch('moneyAccountId');
        const currentCurrency =
          moneyAccounts.find((account) => account.id === selectedMoneyAccount)?.currency ?? Currency.EUR;

        return (
          <>
            <div className="flex md-max:flex-col gap-3">
              <SelectorInput
                name="isIncome"
                label="Type de transaction"
                disabled={cannotEdit || isBankTransaction}
                control={methods.control}
                options={[
                  { label: 'Revenu', value: true },
                  { label: 'Dépense', value: false },
                ]}
              />
              <ComboBoxInput
                name="moneyAccountId"
                label="Compte lié"
                disabled={cannotEdit || isBankTransaction}
                control={methods.control}
                getOptionsKey={(search) => `${transaction.team.id}/moneyAccounts?search=${search}`}
                getOptions={moneyAccounts.map((account) => ({
                  label: account.name,
                  value: account.id,
                  searchText: account.name,
                }))}
              />
            </div>
            <div className="flex md-max:flex-col gap-3">
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
            </div>
            <div className="grid md-max:grid-cols-1 grid-cols-[11rem_9rem_1fr] gap-3">
              <DateInput disabled={cannotEdit || isBankTransaction} name="payedAt" label="Date de la transaction" />
              <CurrencyInput
                disabled={cannotEdit || isBankTransaction}
                name="amount"
                label="Montant"
                control={methods.control}
                currency={currentCurrency}
              />
              <ComboBoxInput<bigint | PaymentMethod, { teamId: bigint }>
                disabled={cannotEdit}
                name="paymentMethod"
                label="Méthode de paiement"
                control={methods.control}
                getOptions={paymentMethods}
                getOptionsKey={(search) => `${transaction.team.id}/paymentMethods?search=${search}`}
                onAddSearch={{ render: AddPaymentMethodForm, context: { teamId: transaction.team.id } }}
              />
            </div>
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
            <div className="grid grid-cols-[1fr_20rem] md-max:grid-cols-1 gap-3">
              <TextInput name="wording" disabled={cannotEdit || isBankTransaction} label="Libellé de la transaction" />
              <TextInput name="referenceNumber" label="Référence" disabled={cannotEdit || isBankTransaction} />
            </div>
            <TextInput name="note" label="Note" disabled={cannotEdit || isBankTransaction} />
          </>
        );
      }}
    />
  );
}
