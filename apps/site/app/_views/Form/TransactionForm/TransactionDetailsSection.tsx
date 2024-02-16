'use client';

import AddPaymentMethodForm from '../ComboBox/AddPaymentMethodForm';

import SelectorInput from '../../../_components/molecules/Input/Controlled/Select/SelectorInput';
import CurrencyInput from '../../../_components/molecules/Input/Controlled/Number/CurrencyInput';
import DateInput from '../../../_components/molecules/Input/Controlled/Date/DateInput';
import ComboBoxInput from '../../../_components/molecules/Input/Controlled/ComboBox/ComboBoxInput';

import TextAreaInput from '../../../_components/molecules/Input/Uncontrolled/String/TextAreaInput';
import TextInput from '../../../_components/molecules/Input/Uncontrolled/String/TextInput';

import { Currency, PaymentMethod } from '@prisma/client';
import { useTranslations } from 'next-intl';

import type { FormMethods } from '../../../_components/molecules/Form/Form';

import type { updateTransactionSchema } from '../../../../schemas/Transaction/updateTransactionSchema';
import type { TeamManageTransactions } from '../../../../types/prisma/Team/team-manage-transactions';

export type TransactionDetailsSectionProps = {
  team: TeamManageTransactions;
  cannotEdit?: boolean;
  isBankTransaction?: boolean;
  methods: FormMethods<typeof updateTransactionSchema>;
};
export default function TransactionDetailsSection({
  team,
  cannotEdit,
  isBankTransaction,
  methods,
}: TransactionDetailsSectionProps) {
  const t = useTranslations();

  const selectedMoneyAccount = methods.watch('moneyAccountId');
  const currentCurrency = selectedMoneyAccount
    ? team.moneyAccounts.find((account) => account.id === selectedMoneyAccount)?.currency
    : null;

  const basePaymentMethods = ['BankTransfer', 'CreditCard', 'MobilePayment', 'Cash', 'Check', 'DirectDebit'] as const;
  const paymentMethods = [
    ...basePaymentMethods.map((method) => ({
      label: t(`Enums.PaymentMethod.${method}`),
      value: PaymentMethod[method],
      searchText: t(`Enums.PaymentMethod.${method}`),
    })),
    ...team.teamPaymentMethods.map((method) => ({ label: method.name, value: method.id, searchText: method.name })),
  ];

  return (
    <div className="flex flex-col gap-3 max-w-2xl">
      <div className="flex md-max:flex-col gap-3">
        <div className="flex gap-3">
          <SelectorInput
            className="mr-4"
            name="isIncome"
            label="Type de transaction"
            disabled={cannotEdit || isBankTransaction}
            control={methods.control}
            options={[
              { label: 'Revenu', value: true },
              { label: 'Dépense', value: false },
            ]}
          />
          <CurrencyInput
            className="min-w-[10rem]"
            disabled={cannotEdit || isBankTransaction}
            name="amount"
            label="Montant"
            control={methods.control}
            currency={currentCurrency ?? Currency.EUR}
          />
        </div>
        <DateInput
          disabled={cannotEdit || isBankTransaction}
          name="payedAt"
          control={methods.control}
          label="Date de la transaction"
        />
      </div>
      <div className="grid md-max:grid-cols-1 grid-cols-2 gap-3">
        <ComboBoxInput
          name="moneyAccountId"
          label="Compte lié"
          disabled={cannotEdit || isBankTransaction}
          control={methods.control}
          getOptionsKey={(search) => `${team.id}/moneyAccounts?search=${search}`}
          getOptions={team.moneyAccounts.map((account) => ({
            label: account.name,
            value: account.id,
            searchText: account.name,
          }))}
        />
        <ComboBoxInput<bigint | PaymentMethod, { teamId: bigint }>
          disabled={cannotEdit}
          name="paymentMethod"
          label="Méthode de paiement"
          control={methods.control}
          getOptions={paymentMethods}
          getOptionsKey={(search) => `${team.id}/paymentMethods?search=${search}`}
          onAddSearch={{ render: AddPaymentMethodForm, context: { teamId: team.id } }}
        />
      </div>
      <div className="grid grid-cols-[1fr_20rem] md-max:grid-cols-1 gap-3">
        <TextInput name="wording" disabled={cannotEdit || isBankTransaction} label="Libellé de la transaction" />
        <TextInput name="referenceNumber" label="Référence" disabled={cannotEdit || isBankTransaction} />
      </div>
      <TextAreaInput rows={4} name="note" label="Note" disabled={cannotEdit || isBankTransaction} />
    </div>
  );
}
