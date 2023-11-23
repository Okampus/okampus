'use client';

import ICopiable from '../../atoms/Inline/ICopiable';
import { getCurrencyFormatter } from '../../../../utils/format/format';

import { formatIBAN } from '@okampus/shared/utils';
import { useFormatter } from 'next-intl';

import type { MoneyAccountWithBankAccountInfo } from '../../../../types/prisma/MoneyAccount/money-account-with-bank-info';

export type MoneyAccountCardProps = { moneyAccount: MoneyAccountWithBankAccountInfo };
export default function MoneyAccountCard({ moneyAccount }: MoneyAccountCardProps) {
  const format = useFormatter();
  // TODO: get sum?
  // const currentBankAccountBalance = moneyAccount.transactionsAggregate.aggregate?.sum?.amount ?? 0;

  // const remaining = moneyAccount.children.reduce(
  //   (acc, childBankAccount) => acc + (childBankAccount.transactionsAggregate.aggregate?.sum?.amount ?? 0),
  //   currentBankAccountBalance,
  // );

  return (
    <div className="card">
      <div className="flex flex-col gap-1">
        <div className="text-lg text-1 font-semibold">{moneyAccount.name}</div>
        {moneyAccount.bankAccountInfo && (
          <>
            <div className="flex gap-1 items-center">
              <div className="text-1 text-sm font-medium">IBAN : </div>
              <ICopiable
                text={formatIBAN(moneyAccount.bankAccountInfo.iban)}
                copyText={moneyAccount.bankAccountInfo.iban}
              />
            </div>
          </>
        )}
      </div>
      <div>
        {/* <div className="text-2xl text-0 font-semibold">{format('euro', currentBankAccountBalance)}</div> */}
        <div className="text-base font-medium text-[var(--text-1)]">
          {moneyAccount.parent
            ? `Votre solde alloué par ${moneyAccount.parent.team.actor.name}`
            : 'Votre solde restant'}
        </div>
      </div>
      {
        // remaining !== currentBankAccountBalance
        moneyAccount && (
          <div className="text-lg font-semibold">
            <div className="text-lg flex gap-6 items-center">
              {/* <div className="text-1 font-semibold w-24 text-end">{format('euro', remaining)}</div> */}
              <div className="text-1 font-medium">Total réel</div>
            </div>
            <hr className="my-2 border-[var(--border-2)]" />
            <div className="flex flex-col gap-1 mt-3">
              {moneyAccount.children.length > 0 && (
                <>
                  {moneyAccount.children.map((childBankAccount) => (
                    <div key={childBankAccount.id} className="flex gap-6 items-center">
                      <div className="text-1 text-sm font-semibold w-24 text-end whitespace-nowrap">
                        {format.number(childBankAccount.balance, getCurrencyFormatter(childBankAccount.currency))}
                      </div>
                      <div className="text-1 text-sm font-medium">{childBankAccount.team.actor.name}</div>
                    </div>
                  ))}
                </>
              )}
              <div className="flex gap-6 items-center">
                <div className="text-1 text-sm font-semibold w-24 text-end">
                  {/* {format('euro', currentBankAccountBalance)} */}
                </div>
                <div className="text-1 text-sm font-medium">{moneyAccount.team.actor?.name}</div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}
