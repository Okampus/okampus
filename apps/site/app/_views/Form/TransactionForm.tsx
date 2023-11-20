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

import { useTranslation } from '../../_hooks/context/useTranslation';

import { sum } from '@okampus/shared/utils';
import { Currency, PaymentMethod, TransactionType } from '@prisma/client';

import type { TransactionMinimal } from '../../../types/prisma/Transaction/transaction-minimal';
import type { TeamManageTransactions } from '../../../types/prisma/Team/team-manage-transactions';

export type TransactionFormProps = { transaction: TransactionMinimal; team: TeamManageTransactions };

export default function TransactionForm({
  transaction,
  team: { teamPaymentMethods, teamTransactionTypes, moneyAccounts, projects, eventOrganizes },
}: TransactionFormProps) {
  const { t } = useTranslation();

  const incomeTransactionType = [
    { label: t('enums', `TransactionType.Subvention`), value: TransactionType.Subvention, searchText: 'subvention' },
    {
      label: t('enums', `TransactionType.MembershipFees`),
      value: TransactionType.MembershipFees,
      searchText: 'frais adhésion',
    },
    {
      label: t('enums', `TransactionType.TicketFees`),
      value: TransactionType.TicketFees,
      searchText: 'ticket événement',
    },
    { label: t('enums', `TransactionType.Gift`), value: TransactionType.Gift, searchText: 'don' },
    { label: t('enums', `TransactionType.Income`), value: TransactionType.Income, searchText: 'revenu' },
    ...teamTransactionTypes
      .filter((type) => type.isIncome)
      .map((type) => ({ label: type.name, value: type.id, searchText: type.name })),
  ];

  const expenseTransactionTypes = [
    {
      label: t('enums', `TransactionType.BankingFees`),
      value: TransactionType.BankingFees,
      searchText: 'frais bancaires',
    },
    {
      label: t('enums', `TransactionType.ExpenseClaim`),
      value: TransactionType.ExpenseClaim,
      searchText: 'remboursement',
    },
    { label: t('enums', `TransactionType.Groceries`), value: TransactionType.Groceries, searchText: 'courses' },
    { label: t('enums', `TransactionType.Equipment`), value: TransactionType.Equipment, searchText: 'équipement' },
    { label: t('enums', `TransactionType.Travel`), value: TransactionType.Travel, searchText: 'frais de déplacement' },
    {
      label: t('enums', `TransactionType.Communication`),
      value: TransactionType.Communication,
      searchText: 'frais de communication',
    },
    {
      label: t('enums', `TransactionType.Subscription`),
      value: TransactionType.Subscription,
      searchText: 'abonnement',
    },
    { label: t('enums', `TransactionType.Expense`), value: TransactionType.Expense, searchText: 'dépense' },
    ...teamTransactionTypes
      .filter((type) => !type.isIncome)
      .map((type) => ({ label: type.name, value: type.id, searchText: type.name })),
  ];

  const paymentMethods = [
    {
      label: t('enums', `PaymentMethod.BankTransfer`),
      value: PaymentMethod.BankTransfer,
      searchText: 'virement bancaire',
    },
    {
      label: t('enums', `PaymentMethod.CreditCard`),
      value: PaymentMethod.CreditCard,
      searchText: 'carte bleue cb de crédit',
    },
    {
      label: t('enums', `PaymentMethod.MobilePayment`),
      value: PaymentMethod.MobilePayment,
      searchText: 'application mobile paiement',
    },
    { label: t('enums', `PaymentMethod.Cash`), value: PaymentMethod.Cash, searchText: 'espèces liquide cash' },
    { label: t('enums', `PaymentMethod.Check`), value: PaymentMethod.Check, searchText: 'chèque' },
    {
      label: t('enums', `PaymentMethod.DirectDebit`),
      value: PaymentMethod.DirectDebit,
      searchText: 'prélèvement automatique mandat sepa',
    },
    ...teamPaymentMethods.map((method) => ({ label: method.name, value: method.id, searchText: method.name })),
  ];

  const projectOptions = [
    { label: 'Général', value: null, searchText: 'dépenses générales divers' },
    ...projects.map((project) => ({ label: project.name, value: project.id, searchText: project.name })),
  ];

  const eventOptions = [
    { label: 'Hors-événement', value: null, searchText: 'hors événement' },
    ...eventOrganizes.map(({ event }) => ({ label: event.name, value: event.id, searchText: event.name })),
  ];

  const {
    payedAt,
    paymentMethod,
    teamPaymentMethod,
    transactionType,
    teamTransactionType,
    bankTransactions,
    attachments,
    counterPartyActor,
    counterPartyTeamVendor,
    counterPartyName,
    ...transactionDefaults
  } = transaction;

  const amount = sum(bankTransactions.map((transaction) => transaction.amount));

  const isAggregate = bankTransactions.length > 0;
  const isIncome = amount > 0;
  const latestBankTransaction = bankTransactions.at(0);

  return (
    <FormWithAction
      action={updateTransaction}
      className="flex flex-col gap-4 max-w-3xl"
      defaultValues={{
        isIncome: isIncome ?? false,
        payedAt: payedAt ?? (latestBankTransaction ? latestBankTransaction.bookedAt : null) ?? undefined,
        ...transactionDefaults,
      }}
      zodSchema={updateTransactionSchema}
      render={(state, methods) => {
        const selectedIsIncome = methods.watch('isIncome');
        const transactionTypes = selectedIsIncome ? incomeTransactionType : expenseTransactionTypes;

        const selectedMoneyAccount = methods.watch('moneyAccountId');
        const currentCurrency =
          moneyAccounts.find((account) => account.id === selectedMoneyAccount)?.currency ?? Currency.EUR;

        const selectedTransactionType = methods.watch('transactionType');

        return (
          <>
            <div className="flex md-max:flex-col gap-3">
              <SelectorInput
                name="isIncome"
                label="Type de transaction"
                disabled={isIncome !== undefined}
                control={methods.control}
                options={[
                  { label: 'Dépense', value: false },
                  { label: 'Revenu', value: true },
                ]}
              />
              <ComboBoxInput
                name="moneyAccountId"
                label="Compte lié"
                control={methods.control}
                getOptionsKey={(search) => `${transaction.team.id}/moneyAccounts?search=${search}`}
                getOptions={moneyAccounts.map((account) => ({
                  label: account.name,
                  value: account.id,
                  searchText: account.name,
                }))}
              />
            </div>
            <div className="grid md-max:grid-cols-1 grid-cols-[11rem_9rem_1fr] gap-3">
              <DateInput name="payedAt" label="Date de la transaction" />
              <CurrencyInput name="amount" label="Montant" control={methods.control} currency={currentCurrency} />
              <ComboBoxInput<bigint | PaymentMethod, { teamId: bigint }>
                name="paymentMethod"
                label="Méthode de paiement"
                control={methods.control}
                getOptions={paymentMethods}
                getOptionsKey={(search) => `${transaction.team.id}/paymentMethods?search=${search}`}
                onAddSearch={{ render: AddPaymentMethodForm, context: { teamId: transaction.team.id } }}
              />
            </div>
            <div className="flex md-max:flex-col gap-3">
              <SelectorInput
                name="isOnline"
                label="Transaction réalisée"
                control={methods.control}
                options={[
                  { label: 'En ligne', value: true },
                  { label: 'En personne', value: false },
                ]}
              />
              <ComboBoxInput<bigint | TransactionType, { teamId: bigint }>
                name="transactionType"
                label="Type de transaction"
                control={methods.control}
                getOptions={transactionTypes}
                getOptionsKey={(search) => `${transaction.team.id}/transactionTypes?search=${search}`}
                onAddSearch={{ render: AddTransactionTypeForm, context: { teamId: transaction.team.id } }}
              />
            </div>
            <div className="flex md-max:flex-col gap-3">
              <ComboBoxInput
                name="project"
                label="Projet lié"
                control={methods.control}
                getOptions={projectOptions}
                getOptionsKey={(search) => `${transaction.team.id}/project?search=${search}`}
              />
              <ComboBoxInput
                name="event"
                label="Événement lié"
                control={methods.control}
                getOptions={eventOptions}
                getOptionsKey={(search) => `${transaction.team.id}/event?search=${search}`}
              />
            </div>
            <div className="grid grid-cols-[3fr_1fr] md-max:grid-cols-1 gap-3">
              <TextInput name="wording" label="Libellé de la transaction" />
              <TextInput name="referenceNumber" label="Référence" />
            </div>
          </>
        );
      }}
    />
  );
}
