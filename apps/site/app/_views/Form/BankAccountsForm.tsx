'use client';

import FormWithAction from '../../_components/molecules/Form/FormWithAction';
import Section from '../../_components/atoms/Container/Section';
import TextInput from '../../_components/molecules/Input/Uncontrolled/String/TextInput';
import CurrencyInput from '../../_components/molecules/Input/Controlled/Number/CurrencyInput';
import IBANInput from '../../_components/molecules/Input/String/IBANInput';

import insertBankAccounts from '../../../server/actions/MoneyAccount/insertBankAccounts';

import { insertBankAccountsSchema } from '../../../schemas/MoneyAccount/insertBankAccountsSchema';

import type { GoCardLessParsedBankAccount } from '../../../server/services/bank';
import type { BankMinimal } from '../../../types/prisma/Bank/bank-minimal';

export type BankAccountsFormProps = {
  initialAccounts: GoCardLessParsedBankAccount[];
  bank: BankMinimal;
  teamId: bigint;
};

export default function BankAccountsForm({ initialAccounts, bank, teamId }: BankAccountsFormProps) {
  return (
    <FormWithAction
      className="max-w-[48rem]"
      action={insertBankAccounts}
      defaultValues={{
        teamId,
        institutionId: bank.goCardLessInstitutionId,
        accounts: initialAccounts.map((account) => ({
          id: account.id,
          name: account.name ?? '',
          iban: account.iban ?? '',
          ownerName: account.ownerName ?? '',
          balance: account.balance,
          referenceDate: new Date(account.referenceDate ?? Date.now()),
        })),
      }}
      zodSchema={insertBankAccountsSchema}
      render={(state, methods) => {
        return (
          <Section
            border={true}
            title={`${initialAccounts.length} ${initialAccounts.length > 0 ? 'compte trouvé' : 'comptes trouvés'}`}
          >
            <div className="flex flex-col gap-6">
              {initialAccounts.map(({ id, balance, currency, iban, name }, idx) => (
                <div key={id} className="bg-1 rounded-xl p-6 flex flex-col gap-6">
                  <TextInput
                    name={`accounts.${idx}.name`}
                    label="Nom du compte"
                    defaultValue={name}
                    allowedChars={/a/}
                  />
                  <div className="flex flex-col gap-6 md:flex-row md:items-center">
                    <CurrencyInput
                      currency={currency}
                      control={methods.control}
                      className="md:w-48 shrink-0"
                      name={`accounts.${idx}.balance`}
                      label="Solde du compte"
                      disabled={!!balance}
                    />
                    <IBANInput control={methods.control} name={`accounts.${idx}.iban`} label="IBAN" disabled={!!iban} />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        );
      }}
    />
  );
}
