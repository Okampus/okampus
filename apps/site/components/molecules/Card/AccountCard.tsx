import ICopiable from '../../atoms/Inline/ICopiable';
import { useTranslation } from '../../../hooks/context/useTranslation';

import { formatIBAN } from '@okampus/shared/utils';

import type { AccountDetailsInfo } from '../../../types/features/account.info';

export type AccountCardProps = { account: AccountDetailsInfo };
export default function AccountCard({ account }: AccountCardProps) {
  const { format } = useTranslation();
  const currentAccountBalance = account.financesAggregate.aggregate?.sum?.amount ?? 0;

  const remaining = account.children.reduce(
    (acc, childAccount) => acc + (childAccount.financesAggregate.aggregate?.sum?.amount ?? 0),
    currentAccountBalance,
  );

  return (
    <div className="card p-7 gap-8">
      <div className="flex flex-col gap-1">
        <div className="text-lg text-1 font-semibold">{account.name}</div>
        {account.bank && (
          <>
            <div className="flex gap-1 items-center">
              <div className="text-1 text-sm font-medium">IBAN : </div>
              <ICopiable text={formatIBAN(account.bank.iban)} copyText={account.bank.iban} />
            </div>
          </>
        )}
      </div>
      <div>
        <div className="text-2xl text-0 font-semibold">{format('euro', currentAccountBalance)}</div>
        <div className="label-title text-1">
          {account.parent ? `Votre solde alloué par ${account.parent.team.actor?.name}` : 'Votre solde restant'}
        </div>
      </div>
      {remaining !== currentAccountBalance && (
        <div className="text-lg font-semibold">
          <div className="text-lg flex gap-6 items-center">
            <div className="text-1 font-semibold w-24 text-end">{format('euro', remaining)}</div>
            <div className="text-1 font-medium">Total réel</div>
          </div>
          <hr className="my-2 border-[var(--border-2)]" />
          <div className="flex flex-col gap-1 mt-3">
            {account.children.length > 0 && (
              <>
                {account.children.map((childAccount) => (
                  <div key={childAccount.id} className="flex gap-6 items-center">
                    <div className="text-1 text-sm font-semibold w-24 text-end whitespace-nowrap">
                      {format('euro', childAccount.financesAggregate.aggregate?.sum?.amount ?? 0)}
                    </div>
                    <div className="text-1 text-sm font-medium">{childAccount.team.actor?.name}</div>
                  </div>
                ))}
              </>
            )}
            <div className="flex gap-6 items-center">
              <div className="text-1 text-sm font-semibold w-24 text-end">{format('euro', currentAccountBalance)}</div>
              <div className="text-1 text-sm font-medium">{account.team.actor?.name}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
