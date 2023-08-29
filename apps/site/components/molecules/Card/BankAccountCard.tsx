import ICopiable from '../../atoms/Inline/ICopiable';
import { useTranslation } from '../../../hooks/context/useTranslation';

import { formatIBAN } from '@okampus/shared/utils';

import type { BankAccountDetailsInfo } from '../../../types/features/bank-account.info';

export type BankAccountCardProps = { bankAccount: BankAccountDetailsInfo };
export default function BankAccountCard({ bankAccount }: BankAccountCardProps) {
  const { format } = useTranslation();
  const currentBankAccountBalance = bankAccount.financesAggregate.aggregate?.sum?.amount ?? 0;

  const remaining = bankAccount.childrenAccounts.reduce(
    (acc, childBankAccount) => acc + (childBankAccount.financesAggregate.aggregate?.sum?.amount ?? 0),
    currentBankAccountBalance,
  );

  return (
    <div className="card p-7 gap-8">
      <div className="flex flex-col gap-1">
        <div className="text-lg text-1 font-semibold">{bankAccount.name}</div>
        {bankAccount.bankInfo && (
          <>
            <div className="flex gap-1 items-center">
              <div className="text-1 text-sm font-medium">IBAN : </div>
              <ICopiable text={formatIBAN(bankAccount.bankInfo.iban)} copyText={bankAccount.bankInfo.iban} />
            </div>
          </>
        )}
      </div>
      <div>
        <div className="text-2xl text-0 font-semibold">{format('euro', currentBankAccountBalance)}</div>
        <div className="label-title text-1">
          {bankAccount.parent ? `Votre solde alloué par ${bankAccount.parent.team.actor?.name}` : 'Votre solde restant'}
        </div>
      </div>
      {remaining !== currentBankAccountBalance && (
        <div className="text-lg font-semibold">
          <div className="text-lg flex gap-6 items-center">
            <div className="text-1 font-semibold w-24 text-end">{format('euro', remaining)}</div>
            <div className="text-1 font-medium">Total réel</div>
          </div>
          <hr className="my-2 border-[var(--border-2)]" />
          <div className="flex flex-col gap-1 mt-3">
            {bankAccount.childrenAccounts.length > 0 && (
              <>
                {bankAccount.childrenAccounts.map((childBankAccount) => (
                  <div key={childBankAccount.id} className="flex gap-6 items-center">
                    <div className="text-1 text-sm font-semibold w-24 text-end whitespace-nowrap">
                      {format('euro', childBankAccount.financesAggregate.aggregate?.sum?.amount ?? 0)}
                    </div>
                    <div className="text-1 text-sm font-medium">{childBankAccount.team.actor?.name}</div>
                  </div>
                ))}
              </>
            )}
            <div className="flex gap-6 items-center">
              <div className="text-1 text-sm font-semibold w-24 text-end">
                {format('euro', currentBankAccountBalance)}
              </div>
              <div className="text-1 text-sm font-medium">{bankAccount.team.actor?.name}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
