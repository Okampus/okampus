import ComboBoxInput from '../../../_components/molecules/Input/Controlled/ComboBox/ComboBoxInput';
import SelectorInput from '../../../_components/molecules/Input/Controlled/Select/SelectorInput';

import OrSeparator from '../../../_components/atoms/Decoration/OrSeparator';
import ActorCard from '../../../_components/molecules/Card/ActorCard';
import TextInput from '../../../_components/molecules/Input/Uncontrolled/String/TextInput';
import AvatarLabeled from '../../../_components/molecules/Labeled/AvatarLabeled';

import { useTenant } from '../../../_hooks/context/useTenant';
import { jsonFetcher } from '../../../../utils/json-fetcher';

import { ActorType, TransactionType } from '@prisma/client';

import type { updateTransactionSchema } from '../../../../schemas/Transaction/updateTransactionSchema';
import type { TeamManageTransactions } from '../../../../types/prisma/Team/team-manage-transactions';
import type { FormMethods } from '../../../_components/molecules/Form/Form';
import type { BankMinimal } from '../../../../types/prisma/Bank/bank-minimal';
import type { PrismaSerialize } from '../../../../utils/prisma-serialize';
import type { TeamMinimal } from '../../../../types/prisma/Team/team-minimal';
import type { UserMinimal } from '../../../../types/prisma/User/user-minimal';

export type TransactionCounterpartySectionProps = {
  bank?: BankMinimal;
  transactionType?: TransactionType;
  team: TeamManageTransactions;
  methods: FormMethods<typeof updateTransactionSchema>;
};

const noChoiceTransactionTypes = new Set<TransactionType>([
  TransactionType.Balance,
  TransactionType.BankingFees,
  TransactionType.Subvention,
]);

export default function TransactionCounterpartySection({
  bank,
  methods,
  transactionType,
}: TransactionCounterpartySectionProps) {
  const { data: tenant } = useTenant();
  const options = [
    { label: 'Utilisateur Okampus', value: ActorType.User },
    { label: 'Association Okampus', value: ActorType.Team },
    { label: 'Fournisseur / Client', value: ActorType.LegalUnit },
    ...(bank ? [{ label: bank.name, value: ActorType.Bank }] : []),
    { label: 'Autre', value: null },
  ];

  const counterPartyActorType = methods.watch('counterPartyActorType');

  return (
    <div className="flex flex-col gap-3 max-w-2xl">
      {!transactionType ||
        (!noChoiceTransactionTypes.has(transactionType) && (
          <SelectorInput
            name="counterPartyActorType"
            label="Autre partie impliquée dans la transaction"
            options={options}
            control={methods.control}
          />
        ))}
      <hr className="border-[var(--border-1)]" />
      {counterPartyActorType === ActorType.User && (
        <div className="flex flex-col gap-3 max-w-xl">
          <ComboBoxInput
            name="counterPartyActorId"
            getOptionsKey={(search: string) => (search ? `/api/search/user?search=${search}` : null)}
            getOptions={async (searchUrl) => {
              if (!searchUrl) return [];
              return jsonFetcher(searchUrl).then((users: PrismaSerialize<UserMinimal>[]) => {
                return users.map((user) => ({
                  searchText: user.actor.name,
                  value: user.actor.id,
                  label: <AvatarLabeled actor={user.actor} />,
                }));
              });
            }}
            label="Association Okampus"
            control={methods.control}
          />
          <OrSeparator />
          <div className="flex flex-col gap-2">
            Si l&apos;utilisateur n&apos;est pas encore inscrit, indiquez son nom et son addresse email{' '}
            {tenant.actor.email}
            <TextInput name="counterPartyName" />
            <TextInput name="counterPartyExpectingEmail" type="email" />
          </div>
        </div>
      )}
      {counterPartyActorType === ActorType.Team && (
        <ComboBoxInput
          name="counterPartyActorId"
          getOptionsKey={(search: string) => (search ? `/api/search/team?search=${search}` : null)}
          getOptions={async (searchUrl) => {
            if (!searchUrl) return [];
            return jsonFetcher(searchUrl).then((teams: PrismaSerialize<TeamMinimal>[]) => {
              return teams.map((team) => ({
                searchText: team.actor.name,
                value: team.actor.id,
                label: <AvatarLabeled actor={team.actor} />,
              }));
            });
          }}
          label="Association Okampus"
          control={methods.control}
        />
      )}
      {counterPartyActorType === ActorType.LegalUnit && (
        <div className="flex flex-col gap-3 max-w-xl">
          {/* <ComboBoxInput /> */}
          <OrSeparator />
          <div className="flex flex-col gap-2">
            Si l&apos;utilisateur n&apos;est pas encore inscrit, indiquez son nom et son addresse email{' '}
            {tenant.actor.email}
            <TextInput name="counterPartyName" />
            <TextInput name="counterPartyExpectingEmail" type="email" />
          </div>
        </div>
        // <SelectorInput
        //   name="counterPartyId"
        //   label="Entreprise"
        //   options={team.teamLegalUnits.map((legalUnit) => ({
        //     label: legalUnit.name,
        //     value: legalUnit.id,
        //     searchText: legalUnit.name,
        //   }))}
        //   control={methods.control}
        // />
      )}
      {counterPartyActorType === ActorType.Bank && bank && (
        <ActorCard actor={bank.actor} subtitle="Banque associé à votre compte" />
      )}
      {counterPartyActorType === null && <TextInput name="counterPartyName" label="Nom de l'autre partie" />}
    </div>
  );
}
