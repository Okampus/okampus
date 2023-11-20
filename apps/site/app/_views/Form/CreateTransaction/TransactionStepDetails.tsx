import SelectorInput from '../../../_components/molecules/Input/Controlled/Select/SelectorInput';
import CheckboxInput from '../../../_components/molecules/Input/Uncontrolled/Boolean/CheckboxInput';

import { MoneyAccountType, PaymentMethod, TeamRoleType, TransactionType } from '@prisma/client';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import type { FormStepContext } from '../../../_components/templates/MultiStepFormView';
import type { TeamWithMoneyAccounts } from '../../../../types/prisma/Team/team-with-money-accounts';

const revenueTypes = [
  TransactionType.Subvention,
  TransactionType.MembershipFees,
  TransactionType.TicketFees,
  TransactionType.Gift,
  TransactionType.Income,
];

const expenseTypes = [
  TransactionType.ExpenseClaim,
  TransactionType.Groceries,
  TransactionType.Subscription,
  TransactionType.Expense,
];

const treasurerTransactonTypes = new Set([
  TransactionType.Subvention,
  TransactionType.Gift,
  TransactionType.ExpenseClaim,
  TransactionType.Subscription,
]);

// TODO: gérer les dépôts de cash à la banque
export default function TransactionStepDetails({ context, goToNextStep }: FormStepContext<TeamWithMoneyAccounts>) {
  const { control, watch, setValue } = useFormContext();

  const account: TeamWithMoneyAccounts['moneyAccounts'][number] | undefined = watch('account');
  const isIncome = watch('isIncome');
  const paymentMethod = watch('paymentMethod');
  const type = watch('type');

  const treasurer = context.teamMembers.find(({ teamMemberRoles }) =>
    teamMemberRoles.some(({ teamRole }) => teamRole.type === TeamRoleType.Treasurer),
  );

  const transactionTypeOptions = typeof isIncome === 'boolean' ? (isIncome ? revenueTypes : expenseTypes) : [];

  const isCashAccount = account?.type === MoneyAccountType.Cash;
  useEffect(() => {
    if (isCashAccount) setValue('paymentMethod', PaymentMethod.Cash);
  }, [isCashAccount, setValue]);

  const isTreasurerTransaction = treasurerTransactonTypes.has(type);
  useEffect(() => {
    if (isTreasurerTransaction) setValue('processedBy', treasurer);
  }, [account, setValue]);

  return (
    <div>
      <SelectorInput
        label="Compte concerné"
        control={control}
        name="account"
        options={context.moneyAccounts.map((account) => ({ label: account.name, value: account }))}
      />
      <SelectorInput
        label="Type de mouvement"
        control={control}
        name="isIncome"
        options={[
          { label: 'Recette', value: true },
          { label: 'Dépense', value: false },
        ]}
      />
      {/* {isCashAccount && typeof isIncome === 'boolean' && (
        <ComboBoxInput<bigint | PaymentMethod, { teamId: bigint }>
          name="paymentMethod"
          label="Méthode de paiement"
          control={control}
          getOptions={paymentMethods}
          getOptionsKey={(search) => `${transaction.team.id}/paymentMethods?search=${search}`}
          onAddSearch={{ render: AddPaymentMethodForm, context: { teamId: transaction.team.id } }}
        />
      )} */}
      {paymentMethod && (
        <SelectorInput
          name="type"
          label={`Type de ${isIncome ? 'recette' : 'dépense'}`}
          control={control}
          options={transactionTypeOptions.map((type) => ({ label: type, value: type }))}
        />
      )}
      {type && (
        <SelectorInput
          name="processedBy"
          label={`Qui a ${isIncome ? 'réceptionné' : 'éxécuté'} cette transaction côté ${context.actor.name} ?`}
          control={control}
          disabled={isTreasurerTransaction}
          options={context.teamMembers.map((member) => ({ label: member.user.actor.name, value: member }))}
          info={
            isTreasurerTransaction &&
            'Les trésoriers sont responsables des abonnements, remboursements et réception de dons, subventions ou paiements de prestation.'
          }
        />
      )}
      {!isTreasurerTransaction && (
        <CheckboxInput name="processedByUnsure" label="Responsable de la transaction incertain ?" />
      )}
    </div>
  );
}
