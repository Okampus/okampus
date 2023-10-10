import BankForm from '../BankForm';
import AvatarImage from '../../atoms/Image/AvatarImage';
import MultiStepPageLayout from '../../atoms/Layout/MultiStepPageLayout';
import BankInfoPreview from '../../atoms/Preview/BankInfoPreview';
import ActionButton from '../../molecules/Button/ActionButton';
import TextInput from '../../molecules/Input/TextInput';

import { useTenant } from '../../../_context/navigation';
import { useTranslation } from '../../../_hooks/context/useTranslation';

import { ActionType, GeocodeAddress } from '@okampus/shared/types';
import { useInsertBankInfoMutation, useInsertBankAccountMutation } from '@okampus/shared/graphql';
import { PaymentMethod, TransactionCategory } from '@okampus/shared/enums';

import type { MultiStepPageStep } from '../../atoms/Layout/MultiStepPageLayout';
import type { LegalUnitLocationMinimalInfo } from '../../../../types/features/legal-unit-location.info';
import type { TeamManageInfo } from '../../../../utils/apollo/fragments';

export type OnboardBankFormProps = {
  teamManage: TeamManageInfo;
  onCompleted?: () => void;
};
export default function OnboardBankForm({ teamManage, onCompleted }: OnboardBankFormProps) {
  const { format } = useTranslation();
  const { tenant } = useTenant();

  const [insertBankInfo] = useInsertBankInfoMutation();
  const [insertBankAccount] = useInsertBankAccountMutation();

  if (!teamManage || !tenant) return null;

  const initialData = {
    bank: null as LegalUnitLocationMinimalInfo | null,
    branchAddress: null as GeocodeAddress | null,
    bicSwift: '',
    iban: '',
    holderName: '',
    balance: '',
    bankAccountAllocates: teamManage.childrenTeams.map((team) => ({
      actorId: team.actor.id,
      teamId: team.id,
      balance: '',
    })),
  };

  const onSubmit = (values: typeof initialData) => {
    if (!teamManage.actor || !values.branchAddress) return;

    const balance = Number.parseFloat(values.balance.replace(',', '.'));
    const bankAccountAllocates = values.bankAccountAllocates.map((bankAccountAllocate) => ({
      ...bankAccountAllocate,
      balance: Number.parseFloat(bankAccountAllocate.balance.replace(',', '.')),
    }));

    const remaining =
      balance - bankAccountAllocates.reduce((acc, bankAccountAllocate) => acc + bankAccountAllocate.balance, 0);

    const bankInfo = {
      actorId: teamManage.actor.id,
      branchAddress: { data: values.branchAddress },
      bankId: values.bank?.id,
      bicSwift: values.bicSwift,
      iban: values.iban,
      holderName: values.holderName,
    };
    insertBankInfo({
      variables: { object: bankInfo },
      onCompleted: ({ insertBankInfoOne }) => {
        if (!insertBankInfoOne) return;

        insertBankAccount({
          variables: {
            object: {
              bankInfoId: insertBankInfoOne.id,
              name: 'Compte principal',
              teamId: teamManage.id,
              transactions: {
                data: [
                  {
                    amount: remaining,
                    method: PaymentMethod.Transfer,
                    category: TransactionCategory.Subvention,
                    payedById: tenant.actor.id,
                    receivedById: teamManage.actor.id,
                    payedAt: new Date().toISOString(),
                  },
                ],
              },
              childrenAccounts: {
                data: bankAccountAllocates.map((bankAccountAllocate) => ({
                  teamId: bankAccountAllocate.teamId,
                  name: 'Compte principal',
                  transactions: {
                    data: [
                      {
                        amount: bankAccountAllocate.balance,
                        method: PaymentMethod.Transfer,
                        category: TransactionCategory.Subvention,
                        payedById: tenant.actor.id,
                        receivedById: bankAccountAllocate.actorId,
                        payedAt: new Date().toISOString(),
                        teamId: bankAccountAllocate.teamId,
                      },
                    ],
                  },
                })),
              },
            },
          },
          onCompleted,
        });
      },
    });
  };

  const teamsString =
    teamManage.childrenTeams.length > 0
      ? ` (incluant les soldes de ${teamManage.childrenTeams.map((team) => team.actor?.name).join(', ')})`
      : '';

  const steps: MultiStepPageStep<typeof initialData>[] = [
    {
      title: 'RIB',
      subtitle: 'Pour identifier votre compte et recevoir vos subventions et remboursements',
      render: ({ values, goToNextStep, setValues }) => {
        if (!teamManage.actor) return null;
        return (
          <BankForm
            actor={teamManage.actor}
            onSubmit={async ({ branchAddress, bicSwift, holderName, iban }) => {
              setValues({ ...values, branchAddress, bicSwift, holderName, iban });
              goToNextStep();
            }}
          />
        );
      },
    },
    {
      title: 'Solde',
      subtitle: `Indiquez votre solde total actuel${teamsString}`,
      render: ({ values, onSubmit, setValues }) => {
        const balance = Number.parseFloat(values.balance.replace(',', '.'));
        const allocates = values.bankAccountAllocates.map((bankAccountAllocate) => ({
          ...bankAccountAllocate,
          balance: Number.parseFloat(bankAccountAllocate.balance.replace(',', '.')),
        }));

        const remaining =
          balance - allocates.reduce((total, { balance }) => total + (Number.isNaN(balance) ? 0 : balance), 0);

        return (
          <div className="grid grid-cols-1 lg:grid-cols-[36rem_1fr] gap-10">
            <BankInfoPreview
              branchAddress={values.branchAddress}
              bicSwift={values.bicSwift}
              iban={values.iban}
              holderName={values.holderName}
            />
            <div className="flex flex-col gap-6 lg:max-w-[30rem]">
              <div className="page-subtitle">Quel est le solde total de votre compte{teamsString} ?</div>
              <TextInput
                name="balance"
                value={values.balance}
                textAlign="right"
                onChange={(event) => setValues({ ...values, balance: event.target.value })}
                placeholder="Solde total (XXXX,XX)"
                endContent={<div className="ml-2">€</div>}
              />
              {teamManage.childrenTeams.length > 0 && (
                <>
                  <div className="page-subtitle">Quel est le solde alloué à vos clubs ?</div>
                  {teamManage.childrenTeams.map((team) => (
                    <div key={team.id} className="flex items-center gap-4">
                      <AvatarImage actor={team.actor} type="team" />
                      <TextInput
                        name={`balance-${team.slug}`}
                        endContent={<div className="ml-2">€</div>}
                        placeholder={`Solde de ${team.actor?.name} (XXXX,XX)`}
                        textAlign="right"
                        onChange={(event) =>
                          setValues({
                            ...values,
                            bankAccountAllocates: values.bankAccountAllocates.map((bankAccountAllocate) => {
                              if (bankAccountAllocate.teamId === team.id)
                                return { ...bankAccountAllocate, balance: event.target.value };
                              return bankAccountAllocate;
                            }),
                          })
                        }
                      />
                    </div>
                  ))}
                  {!Number.isNaN(balance) && (
                    <>
                      <hr className="border border-[var(--border-2)]" />
                      <div className="flex items-center gap-4">
                        <AvatarImage actor={teamManage.actor} type="team" />
                        <div className="grow font-semibold flex justify-between gap-4 items-center">
                          <span>Solde restant</span>
                          {format('euro', remaining)}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
              {!Number.isNaN(balance) &&
                allocates.every((bankAccountAllocate) => !Number.isNaN(bankAccountAllocate.balance)) && (
                  <ActionButton
                    action={{
                      type: ActionType.Success,
                      label: 'Valider',
                      linkOrActionOrMenu: () => onSubmit(values),
                    }}
                  />
                )}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <MultiStepPageLayout
      header="Créer votre compte bancaire"
      initialData={initialData}
      steps={steps}
      onSubmit={onSubmit}
    />
  );
}
